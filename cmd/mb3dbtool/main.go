package main

import (
	"archive/zip"
	"bufio"
	"bytes"
	"errors"
	"flag"
	"fmt"
	"github.com/Code-Hex/dd"
	"github.com/MassBank/MassBank3/pkg/database"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"github.com/go-git/go-git/v5"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type config struct {
	database.DBConfig
	gitRepo   string
	gitBranch string
	dataDir   string
	drop      bool
}

const (
	DB_DEFAULT                = "postgres"
	DB_USER_DEFAULT           = "massbank3"
	DB_PASSWORD_DEFAULT       = "massbank3password"
	DB_HOST_DEFAULT           = "localhost"
	DB_PORT_DEFAULT           = "0"
	DB_NAME_DEFAULT           = "massbank3"
	DB_CONN_STRING_DEFAULT    = ""
	MB_GIT_REPO_DEFAULT       = "https://github.com/MassBank/MassBank-data"
	MB_GIT_BRANCH_DEFAULT     = "main"
	MB_DATA_DIRECTORY_DEFAULT = ""
	MB_DROP_ALL_DEFAULT       = "true"
)

func main() {
	var userConfig = getConfig()
	var db database.MB3Database
	var err error
	if userConfig.Database == database.MongoDB {
		db, err = database.NewMongoDB(userConfig.DBConfig)
		if err != nil {
			panic(err)
		}
	} else if userConfig.Database == database.Postgres {
		db, err = database.NewPostgresSQLDb(userConfig.DBConfig)
		log.Println(dd.Dump(db))
		if err != nil {
			panic(err)
		}
	}
	if err = db.Connect(); err != nil {
		panic(err)
	}
	if userConfig.drop {
		if err := db.DropAllRecords(); err != nil {
			println(err.Error())
		}
	}
	var mbfiles []*massbank.MassBank2
	var versionData *massbank.MbMetaData
	if len(userConfig.dataDir) > 0 {
		mbfiles, versionData, err = readDirectoryData(userConfig.dataDir)
		if err != nil {
			println(err.Error())
		}
	}
	if mbfiles == nil && len(userConfig.gitRepo) > 0 {
		mbfiles, versionData, err = readGitData(userConfig.gitRepo, userConfig.gitBranch)
		if err != nil {
			panic(err)
		}
	}
	count, err := db.Count()
	if err != nil {
		println(err.Error())
	}
	metaId, err := db.UpdateMetadata(versionData)
	if err != nil {
		panic(err)
	}
	if count < 1 {
		err = db.AddRecords(mbfiles, metaId)
		if err != nil {
			panic(err)
		}
	} else {
		_, _, err := db.UpdateRecords(mbfiles, metaId, true)
		if err != nil {
			panic(err)
		}
	}
	if err != nil {
		println("Could not add records: " + err.Error())
	}
	if mbfiles == nil {
		panic("No files found")
	}
}

func getEnv(name string, fallback string) string {
	if value, ok := os.LookupEnv(name); ok {
		return value
	}
	return fallback
}

func getConfig() config {
	var c = config{}
	var err error
	c.DbUser = getEnv("DB_USER", DB_USER_DEFAULT)
	c.DbPwd = getEnv("DB_PASSWORD", DB_PASSWORD_DEFAULT)
	c.DbHost = getEnv("DB_HOST", DB_HOST_DEFAULT)
	c.DbName = getEnv("DB_NAME", DB_NAME_DEFAULT)
	c.DbConnStr = getEnv("DB_CONN_STRING", DB_CONN_STRING_DEFAULT)
	c.gitRepo = getEnv("MB_GIT_REPO", MB_GIT_REPO_DEFAULT)
	c.gitBranch = getEnv("MB_GIT_BRANCH", MB_GIT_BRANCH_DEFAULT)
	c.dataDir = getEnv("MB_DATA_DIRECTORY", MB_DATA_DIRECTORY_DEFAULT)
	var drop = getEnv("MB_DROP_ALL", MB_DROP_ALL_DEFAULT)
	c.drop, err = strconv.ParseBool(drop)
	if err != nil {
		println(err.Error())
	}
	var databaseType = getEnv("DB_TYPE", DB_DEFAULT)
	var dbPortEnv = getEnv("DB_PORT", DB_PORT_DEFAULT)
	var dbPort uint64
	dbPort, err = strconv.ParseUint(dbPortEnv, 10, 16)
	if err != nil {
		panic(errors.New("Could not read port variable: DB_PORT=" + dbPortEnv))
	}
	c.DbPort = uint(dbPort)
	flag.StringVar(&databaseType, "db_type", databaseType, "Database type must be postgres or mongodb. Overwrites environment variable DB_DEFAULT")
	flag.StringVar(&c.DbUser, "user", c.DbUser, "database user name. Overwrites environment variable DB_USER")
	flag.StringVar(&c.DbPwd, "pwd", c.DbPwd, "database user password. Overwrites environment variable DB_PASSWORD")
	flag.StringVar(&c.DbHost, "host", c.DbHost, "database host. Overwrites environment variable DB_HOST")
	flag.StringVar(&c.DbName, "db", c.DbName, "database name. Overwrites environment variable DB_NAME")
	flag.UintVar(&c.DbPort, "port", c.DbPort, "database port. Overwrites environment variable DB_PORT")
	flag.StringVar(&c.DbConnStr, "connstr", c.DbConnStr, "database connection string. Overwrites environment variable DB_CONN_STRING")
	flag.StringVar(&c.gitRepo, "git", c.gitRepo, "git repository. Overwrites environment variable MB_GIT_REPO")
	flag.StringVar(&c.gitBranch, "branch", c.gitBranch, "git branch. Overwrites environment variable MB_GIT_BRANCH")
	flag.StringVar(&c.dataDir, "dir", c.dataDir, "data directory. Overwrites environment variable MB_DATA_DIRECTORY")
	flag.BoolVar(&c.drop, "dropall", c.drop, "drop all data. Overwrites environment variable MB_DROP_ALL")
	flag.Parse()
	if databaseType == "postgres" {
		c.Database = database.Postgres
	} else if databaseType == "mongodb" {
		c.Database = database.MongoDB
	} else {
		panic("Database must be postgres or mongodb")
	}
	if c.DbPort == 0 {
		if c.Database == database.Postgres {
			c.DbPort = 5432
		} else {
			c.DbPort = 27017
		}
	}
	if len(c.gitRepo) > 0 && len(c.dataDir) > 0 {
		println("Git repo and data directory are set. Using data directory as default and git repo as fallback.")
	}
	return c
}

func readDirectoryData(dir string) ([]*massbank.MassBank2, *massbank.MbMetaData, error) {
	println("Reading files from directory " + dir + " ...")
	filesNames, err := filepath.Glob(dir + "/**/*.txt")
	if err != nil {
		return nil, nil, err
	}
	var mbmeta = massbank.MbMetaData{}
	verFile, err := os.Open(dir + "/VERSION")
	readVersionFile(verFile, &mbmeta)
	if err != nil {
		return nil, nil, err
	}
	repo, err := git.PlainOpen(dir)

	if err != nil {
		println(err.Error())
	} else {
		head, err := repo.Head()
		if err != nil {
			println(err.Error())
		} else {
			mbmeta.Commit = head.Hash().String()
		}
	}
	var mbfiles = []*massbank.MassBank2{}
	for _, name := range filesNames {
		file, err := os.Open(name)
		if err != nil {
			println(err.Error())
			return nil, nil, err
		}
		mb, err := massbank.ScanMbFile(file, name)
		file.Close()
		mbfiles = append(mbfiles, mb)
	}
	return mbfiles, &mbmeta, nil
}

func readGitData(repo string, branch string) ([]*massbank.MassBank2, *massbank.MbMetaData, error) {
	c := http.Client{}
	var url = fmt.Sprintf("%v/archive/refs/heads/%v.zip", repo, branch)
	println("Downloading file " + url)
	resp, err := c.Get(url)
	if err != nil {
		return nil, nil, err
	}
	body, err := io.ReadAll(resp.Body)
	println("Download finished")
	if err != nil {
		return nil, nil, err
	}
	zReader, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	if err != nil {
		log.Panicln(err)
	}
	var mbfiles = []*massbank.MassBank2{}
	var mbmeta = massbank.MbMetaData{Commit: zReader.Comment}
	for _, zFile := range zReader.File {
		if strings.HasSuffix(zFile.Name, "VERSION") {
			file, err := zFile.Open()
			if err != nil {
				println("Could not read VERSION file: " + err.Error())
			}
			readVersionFile(file, &mbmeta)
		}
		if strings.HasSuffix(zFile.Name, ".txt") {
			file, err := zFile.Open()
			if err != nil {
				return nil, nil, err
			}
			mb, err := massbank.ScanMbFile(file, zFile.Name)
			mbfiles = append(mbfiles, mb)
		}
	}
	return mbfiles, &mbmeta, nil
}

func readVersionFile(file io.Reader, mbmeta *massbank.MbMetaData) {
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.Split(scanner.Text(), "=")
		if len(line) == 2 {
			switch strings.TrimSpace(line[0]) {
			case "version":
				mbmeta.Version = strings.TrimSpace(line[1])
			case "timestamp":
				mbmeta.Timestamp = strings.TrimSpace(line[1])

			}
		}
	}
}

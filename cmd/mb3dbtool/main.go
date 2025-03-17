package main

import (
	"archive/zip"
	"bufio"
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/MassBank/MassBank3/pkg/config"
	"github.com/MassBank/MassBank3/pkg/database"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"github.com/go-git/go-git/v5"
)

func main() {
	var userConfig = config.GetToolConfig()
	var db database.MB3Database
	var err error
	if userConfig.Database == database.Postgres {
		db, err = database.NewPostgresSQLDb(userConfig.DBConfig)
		if err != nil {
			panic(err)
		}
	}
	fmt.Println("Connecting to database...")
	if err = db.Connect(); err != nil {
		panic(err)
	}

	if userConfig.Init {
		println("Removing indexes...")
		err = db.RemoveIndexes()
		if err != nil {
			println("Could not remove indexes: " + err.Error())
			panic(err)
		}

		fmt.Println("Start initialising database...")
		if err := db.Init(); err != nil {
			println(err.Error())
		}

		var mbfiles []*massbank.MassBank2
		var versionData *massbank.MbMetaData
		if len(userConfig.DataDir) > 0 {
			fmt.Println("Reading data from directory...")
			mbfiles, versionData, err = readDirectoryData(userConfig.DataDir)
			if err != nil {
				println(err.Error())
			}
		}
		if mbfiles == nil && len(userConfig.GitRepo) > 0 {
			fmt.Println("Reading data from git repository...")
			mbfiles, versionData, err = readGitData(userConfig.GitRepo, userConfig.GitBranch)
			if err != nil {
				panic(err)
			}
		}
		println("Start updating database...")
		println("Updating metadata...")
		metaId, err := db.UpdateMetadata(versionData)
		if err != nil {
			println("Could not update metadata: " + err.Error())
			panic(err)
		}
		println("Updating records...")
		err = db.AddRecords(mbfiles, metaId)
		if err != nil {
			panic(err)
		}

		if mbfiles == nil {
			panic("No files found")
		}
		count, err := db.Count()
		if err != nil {
			panic(err)
		}

		println("Database filling was successful. ", count, " records in database.")

		println("Adding indexes...")
		err = db.AddIndexes()
		if err != nil {
			println("Could not add indexes: " + err.Error())
			panic(err)
		}

		println("Finished database update.")
	} else {
		println("Database initialisation was skipped.")
	}

	fmt.Println("Disconnecting to database...")
	if err = db.Disconnect(); err != nil {
		panic(err)
	}
	fmt.Println("Done.")
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
			mbmeta.GitCommit = head.Hash().String()
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
	println("Reading of data finished.")
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
	var mbmeta = massbank.MbMetaData{GitCommit: zReader.Comment}
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
	println("Reading of data finished.")
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

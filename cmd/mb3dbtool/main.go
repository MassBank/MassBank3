package main

import (
	"errors"
	"flag"
	"github.com/MassBank/MassBank3/pkg/database"
	"os"
	"strconv"
)

type config struct {
	database.DBConfig
	gitRepo string
	dataDir string
}

func main() {
	var userConfig = getConfig()
	var db database.MB3Database
	var err error
	db, err = database.NewMongoDB(userConfig.DBConfig)
	if err != nil {
		panic(err)
	}
	err = db.Connect()
	if err != nil {
		panic(err)
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
	c.DbUser = getEnv("DB_USER", "massbank3")
	c.DbPwd = getEnv("DB_PASSWORD", "massbank3password")
	c.DbHost = getEnv("DB_HOST", "localhost")
	c.DbName = getEnv("DB_NAME", "massbank3")
	c.DbConnStr = getEnv("DB_CONN_STRING", "")
	c.gitRepo = getEnv("MB_GIT_REPO", "https://github.com/MassBank/MassBank-data.git")
	c.dataDir = getEnv("MB_DATA_DIRECTORY", "")
	var dbPortEnv = getEnv("DB_PORT", "27017")
	dbPort, err := strconv.ParseUint(dbPortEnv, 10, 16)
	if err != nil {
		panic(errors.New("Could not read port variable: DB_PORT=" + dbPortEnv))
	}
	c.DbPort = uint(dbPort)
	flag.StringVar(&c.DbUser, "user", c.DbUser, "database user name")
	flag.StringVar(&c.DbPwd, "pwd", c.DbPwd, "database user password")
	flag.StringVar(&c.DbHost, "host", c.DbHost, "database host")
	flag.StringVar(&c.DbName, "db", c.DbName, "database name")
	flag.UintVar(&c.DbPort, "port", c.DbPort, "database port")
	flag.StringVar(&c.DbConnStr, "connstr", c.DbConnStr, "database connection string")
	flag.StringVar(&c.gitRepo, "git", c.gitRepo, "git host")
	flag.StringVar(&c.dataDir, "dir", c.dataDir, "data directory")
	flag.Parse()
	if len(c.gitRepo) > 0 && len(c.dataDir) > 0 {
		println("Git repo and data directory are set. Using data directory as default and git repo as fallback.")
	}
	return c
}

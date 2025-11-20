package config

import (
	"errors"
	"flag"
	"log"
	"os"
	"strconv"

	"github.com/MassBank/MassBank3/pkg/database"
)

type ToolConfig struct {
	database.DBConfig
	GitRepo   string
	GitBranch string
	DataDir   string
	Init      bool
}

type ServerConfig struct {
	database.DBConfig
	ServerPort uint
	ApiUrl     string
	BaseUrl    string
}

const (
	dbDefault              = "postgres"
	dbUserDefault          = "massbank3"
	dbPasswordDefault      = "massbank3password"
	dbHostDefault          = "localhost"
	dbPortDefault          = "5432"
	dbNameDefault          = "massbank3"
	dbConnStringDefault    = ""
	mbGitRepoDefault       = "https://github.com/MassBank/MassBank-data"
	mbGitBranchDefault     = "main"
	mbDataDirectoryDefault = ""
	mbDbInitDefault        = "true"
	serverPortDefault      = "8080"
	apiUrlDefault          = "localhost:8081"
	baseUrlDefault         = "/MassBank-api"
)

var toolConfig *ToolConfig = nil
var serverConfig *ServerConfig = nil

func GetToolConfig() ToolConfig {
	if toolConfig != nil {
		return *toolConfig
	}
	toolConfig = &ToolConfig{DBConfig: getDBConfig()}
	var err error
	toolConfig.GitRepo = getEnv("MB_GIT_REPO", mbGitRepoDefault)
	toolConfig.GitBranch = getEnv("MB_GIT_BRANCH", mbGitBranchDefault)
	var init = getEnv("MB_DB_INIT", mbDbInitDefault)
	toolConfig.DataDir = getEnv("MB_DATA_DIRECTORY", mbDataDirectoryDefault)
	toolConfig.Init, err = strconv.ParseBool(init)
	if err != nil {
		log.Println(err.Error())
	}
	flag.StringVar(&toolConfig.GitRepo, "git", toolConfig.GitRepo, "git repository. Overwrites environment variable MB_GIT_REPO")
	flag.StringVar(&toolConfig.GitBranch, "branch", toolConfig.GitBranch, "git branch. Overwrites environment variable MB_GIT_BRANCH")
	flag.StringVar(&toolConfig.DataDir, "dir", toolConfig.DataDir, "data directory. Overwrites environment variable MB_DATA_DIRECTORY")
	flag.BoolVar(&toolConfig.Init, "init", toolConfig.Init, "init the database. Overwrites environment variable MB_DB_INIT")
	flag.Parse()
	if len(toolConfig.GitRepo) > 0 && len(toolConfig.DataDir) > 0 {
		println("Git repo and data directory are set. Using data directory as default and git repo as fallback.")
	} else if len(toolConfig.GitRepo) > 0 {
		println("Git repo is set. Using git repo as data source.")
	} else if len(toolConfig.DataDir) > 0 {
		println("Data directory is set. Using data directory as data source.")
	}
	return *toolConfig
}

func GetServerConfig() *ServerConfig {
	if serverConfig != nil {
		return serverConfig
	}
	serverConfig = &ServerConfig{DBConfig: getDBConfig()}
	var err error
	var serverPortEnv = getEnv("MB3_SERVER_PORT", serverPortDefault)
	var serverPort uint64
	serverPort, err = strconv.ParseUint(serverPortEnv, 10, 16)
	if err != nil {
		panic(errors.New("Could not read port variable: DB_PORT=" + serverPortEnv))
	}
	serverConfig.ServerPort = uint(serverPort)
	flag.UintVar(&serverConfig.ServerPort, "server_port", serverConfig.ServerPort, "Listen on this port. Overwrites environment variable SERVER_PORT")
	flag.Parse()

	serverConfig.ApiUrl = getEnv("MB3_API_URL", apiUrlDefault)
	serverConfig.BaseUrl = getEnv("MB3_API_BASE_URL", baseUrlDefault)

	lastChar := serverConfig.BaseUrl[len(serverConfig.BaseUrl)-1:]
	if lastChar == "/" {
		serverConfig.BaseUrl = serverConfig.BaseUrl[:len(serverConfig.BaseUrl)-1]
	}

	return serverConfig
}

func getDBConfig() database.DBConfig {
	var c = database.DBConfig{}
	var err error
	c.DbUser = getEnv("DB_USER", dbUserDefault)
	c.DbPwd = getEnv("DB_PASSWORD", dbPasswordDefault)
	c.DbHost = getEnv("DB_HOST", dbHostDefault)
	c.DbName = getEnv("DB_NAME", dbNameDefault)
	c.DbConnStr = getEnv("DB_CONN_STRING", dbConnStringDefault)
	var databaseType = getEnv("DB_TYPE", dbDefault)
	var dbPortEnv = getEnv("DB_PORT", dbPortDefault)
	var dbPort uint64
	dbPort, err = strconv.ParseUint(dbPortEnv, 10, 16)
	if err != nil {
		log.Panicln(errors.New("Could not read port variable: DB_PORT=" + dbPortEnv))
	}
	c.DbPort = uint(dbPort)
	flag.StringVar(&databaseType, "db_type", databaseType, "Database type must be postgres (currently). Overwrites environment variable DB_TYPE")
	flag.StringVar(&c.DbUser, "db_user", c.DbUser, "database user name. Overwrites environment variable DB_USER")
	flag.StringVar(&c.DbPwd, "db_pwd", c.DbPwd, "database user password. Overwrites environment variable DB_PASSWORD")
	flag.StringVar(&c.DbHost, "db_host", c.DbHost, "database host. Overwrites environment variable DB_HOST")
	flag.StringVar(&c.DbName, "db", c.DbName, "database name. Overwrites environment variable DB_NAME")
	flag.UintVar(&c.DbPort, "db_port", c.DbPort, "database port. Overwrites environment variable DB_PORT")
	flag.StringVar(&c.DbConnStr, "db_connstr", c.DbConnStr, "database connection string. Overwrites environment variable DB_CONN_STRING")
	flag.Parse()
	if databaseType == "postgres" {
		c.Database = database.Postgres
	} else {
		panic("Database must be postgres (currently).")
	}
	if c.DbPort == 0 {
		if c.Database == database.Postgres {
			c.DbPort = 5432
		}
	}
	return c
}

func getEnv(name string, fallback string) string {
	if value, ok := os.LookupEnv(name); ok {
		return value
	}
	return fallback
}

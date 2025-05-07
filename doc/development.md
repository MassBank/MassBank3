# Developer documentation

## Project structure

### Folders

_/api_

- OpenAPI3 REST API specification

_/cmd_

- Command line tools:
  - _/cmd/mb3server_: generated API server
  - _/cmd/mb3dbtool_: database tool to create/update database

_/doc_

- documentation

_/docker_

- files for docker deployment

_/scripts_

- helper scripts:
  - for server generation

## Development

### Generating the server

The openapi generator script requires _curl_, _mvn_, _jq_, _bash_ and _gofmt_
to be installed in a linux environment.

    /bin/bash scripts/generate_api_server.sh

### Compiling and starting the API server

Compiling and running the server requires at least Go v1.19. Download the
required modules.

    go mod download

Build the server.

    go build -o mb3server cmd/mb3server/main.go

Execute the server:

    ./mb3server

### Building the database tool

To database tool is build with the command:

    > go build -o mb3dbtool cmd/mb3dbtool/main.go

Get help with:

    > ./mb3dbtool --help
    Usage of ./mb3dbtool:
        -branch string
              git branch. Overwrites environment variable MB_GIT_BRANCH
              (default "main")
        -connstr string
              database connection string. Overwrites environment variable
              DB_CONN_STRING
        -db string
              database name. Overwrites environment variable DB_NAME
              (default "massbank3")
        -dir string
              data directory. Overwrites environment variable MB_DATA_DIRECTORY
        -git string
              git repository. Overwrites environment variable MB_GIT_REPO
              (default "https://github.com/MassBank/MassBank-data")
        -host string
              database host. Overwrites environment variable DB_HOST
              (default "localhost")
        -port uint
              database port. Overwrites environment variable DB_PORT
              (default 5432)
        -pwd string
              database user password. Overwrites environment variable
              DB_PASSWORD (default "massbank3password")
        -user string
              database user name. Overwrites environment variable
              DB_USER (default "massbank3")

### Using docker

To run the server in docker containers you need docker and docker-compose (min V2).
Copy the _docker/env.dist_ file to _docker/.env_ and edit it to change the
default values in _docker/.env_.

### Starting a service for production

    docker-compose -f docker/docker-compose-deploy.yaml up

#### Starting a service for production and initialize the database

    docker-compose -f docker-compose-deploy.yaml --profile dbinit up

### Starting a service for debugging

This command starts a docker container for remote debugging with a
[delve](https://github.com/go-delve/delve) debugging server listening on
port 40000.

    docker-compose -f docker-compose-debug.yaml up

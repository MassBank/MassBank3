# Developer documentation

## Project structure

### Folders
*/api*
- OpenAPI3 REST API specification

*/cmd*
- Command line tools:
  - */cmd/mb3server*: generated API server
  - */cmd/mb3dbtool*: database tool to create/update database

*/doc*
- documentation

*/docker*
- files for docker deployment

*/scripts*
- helper scripts:
  - for server generation

## Development 

### Generating the server

The openapi generator script requires *curl*, *mvn*, *jq*, *bash* and *gofmt* 
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
              (default 27017)
        -pwd string
              database user password. Overwrites environment variable 
              DB_PASSWORD (default "massbank3password")
        -user string
              database user name. Overwrites environment variable 
              DB_USER (default "massbank3")

### Using docker

To run the server in docker containers you need docker and docker-compose. 
Copy the *docker/env.dist* file to *docker/.env* and edit it to change the 
default values in *docker/.env*.

### Starting a docker for production

    docker-compose -f docker/docker-compose-common.yaml -f docker/docker-compose-deploy.yaml up

### Starting a docker-container for debugging

This command starts a docker container for remote debugging with a 
[delve](https://github.com/go-delve/delve) debugging server listening on 
port 40000.

    docker-compose -f docker/docker-compose-common.yaml -f docker-compose-debug.yaml up

#!/bin/bash

export GO_POST_PROCESS_FILE="gofmt -w"

mkdir bin
curl https://raw.githubusercontent.com/OpenAPITools/openapi-generator/master/bin/utils/openapi-generator-cli.sh > bin/openapi-generator-cli.sh
chmod +x bin/openapi-generator-cli.sh
bash bin/openapi-generator-cli.sh generate -c config-openapi.yaml
mkdir tmp
bash bin/openapi-generator-cli.sh generate -i api/openapi.yaml -g openapi -o tmp/
mv tmp/openapi.json api/openapi.json 
rm -rf tmp
rm -rf bin
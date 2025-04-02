#!/bin/bash

echo "servers:\n  - url: \"" >> swagger-ui/openapi.yml
echo $1 >> swagger-ui/openapi.yml
echo "\"" >> swagger-ui/openapi.yml

CGO_ENABLED=0
go get -d -v ./...

go build -a -installsuffix cgo -o mb3server .

./mb3server
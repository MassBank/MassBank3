#!/bin/bash

echo "servers:\n  - url: \"" >> swagger-ui/openapi.yaml
echo $1 >> swagger-ui/openapi.yaml
echo "\"" >> swagger-ui/openapi.yaml

CGO_ENABLED=0
go get -d -v ./...

go build -a -installsuffix cgo -o mb3server .

./mb3server
#!/bin/bash

echo -n "servers:\n  - url: \"" >> swagger-ui/openapi.yaml
echo -n $1 >> swagger-ui/openapi.yaml
echo -n $2 >> swagger-ui/openapi.yaml
echo "\"" >> swagger-ui/openapi.yaml

CGO_ENABLED=0
go get -d -v ./...

go build -a -installsuffix cgo -o mb3server .

./mb3server
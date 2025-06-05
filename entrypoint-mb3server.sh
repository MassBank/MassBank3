#!/bin/bash

echo -e -n 'servers:\n - url: "' >> swagger-ui/openapi.yaml
echo -n $1 >> swagger-ui/openapi.yaml
echo -n $2 >> swagger-ui/openapi.yaml
echo "\"" >> swagger-ui/openapi.yaml

swagger-cli bundle swagger-ui/openapi.yaml -o swagger-ui/openapi.json -t json

CGO_ENABLED=0
go get -d -v ./...

go build -a -installsuffix cgo -o mb3server .

./mb3server
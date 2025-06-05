#!/bin/bash

echo -e -n 'servers:\n - url: "' >> swagger-ui/openapi.yaml
echo -n $1 >> swagger-ui/openapi.yaml
echo -n $2 >> swagger-ui/openapi.yaml
echo "\"" >> swagger-ui/openapi.yaml

url1=$(cat swagger-ui/openapi.yaml | grep "url" | sed 's/.*url: //')
url2=$(echo $url1 | sed 's/\//\\\//g')
sed -i "s/\"url\" : \"\/\"/\"url\" : $url2/g" swagger-ui/openapi.json

CGO_ENABLED=0
go get -d -v ./...

go build -a -installsuffix cgo -o mb3server .

./mb3server
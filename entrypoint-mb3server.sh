#!/bin/bash
set -e

echo -e -n 'servers:\n - url: "' >> swagger-ui/openapi.yaml
echo -n $MB3_API_URL >> swagger-ui/openapi.yaml
echo -n $MB3_API_BASE_URL >> swagger-ui/openapi.yaml
echo "\"" >> swagger-ui/openapi.yaml

url1=$(cat swagger-ui/openapi.yaml | grep "url" | sed 's/.*url: //')
url2=$(echo $url1 | sed 's/\//\\\//g')
sed -i "s/\"url\" : \"\/\"/\"url\" : $url2/g" swagger-ui/openapi.json

export CGO_ENABLED=0
go build -mod=readonly -o mb3server .

exec ./mb3server
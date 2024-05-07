#!/bin/bash
rm -r gen
java -jar openapi-generator-cli.jar generate -g python-flask -i openapi.yaml -o gen

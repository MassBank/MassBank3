#!/bin/bash

cd /docker-entrypoint-initdb.d/
cat 0001_datamodel.sql | psql massbank3
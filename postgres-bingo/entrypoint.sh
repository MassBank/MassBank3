#!/bin/bash

echo "\set MB3_SCHEMA $1" > update.sql
echo "\set MB3_DATABASE $1" >> update.sql
echo "\set MB3_USER $2" >> update.sql
echo "\set MB3_PW $3" >> update.sql
cat datamodel.sql >> update.sql
mv update.sql /docker-entrypoint-initdb.d/update.sql

bash /usr/local/bin/docker-entrypoint.sh postgres
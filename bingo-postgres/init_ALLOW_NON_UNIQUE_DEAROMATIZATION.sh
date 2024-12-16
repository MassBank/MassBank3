#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- update ALLOW_NON_UNIQUE_DEAROMATIZATION to 1 --
    UPDATE bingo.bingo_config SET cvalue = 1 WHERE cname = 'ALLOW_NON_UNIQUE_DEAROMATIZATION';
EOSQL
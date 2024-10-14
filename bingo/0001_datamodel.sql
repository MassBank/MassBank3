\set MB3_SCHEMA massbank3
\set MB3_DATABASE massbank3
\set MB3_USER massbank3
\set MB3_PW massbank3

\connect :MB3_DATABASE

-- Bingo database extension (chemistry) --
\i /opt/bingo/bingo_install.sql
GRANT USAGE ON SCHEMA bingo TO :MB3_USER;
GRANT SELECT ON bingo.bingo_config TO :MB3_USER;
GRANT SELECT ON bingo.bingo_tau_config TO :MB3_USER;

-- schema --
CREATE SCHEMA IF NOT EXISTS AUTHORIZATION :MB3_USER;

-- adjust schema search path --
ALTER USER :MB3_USER SET search_path to :MB3_SCHEMA,public;

-- privileges --
GRANT USAGE ON SCHEMA :MB3_SCHEMA, public TO :MB3_USER;
GRANT CONNECT, TEMPORARY, TEMP  ON  DATABASE :MB3_DATABASE to :MB3_USER;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA :MB3_SCHEMA to :MB3_USER;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public to :MB3_USER;
REVOKE ALL ON ALL TABLES IN SCHEMA :MB3_SCHEMA FROM public;

-- set schema --
SET search_path TO :MB3_SCHEMA;
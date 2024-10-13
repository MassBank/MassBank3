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
CREATE SCHEMA AUTHORIZATION :MB3_USER;

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


CREATE TABLE molecules (
        id SERIAL NOT NULL PRIMARY KEY,
        molecule TEXT NOT NULL,
        accession TEXT NOT NULL
);
        
CREATE INDEX i_molecules_mol_idx ON molecules USING bingo_idx (molecule bingo.molecule);


-- example insertions --
-- benzene --
INSERT INTO molecules (molecule, accession) VALUES ('C1=CC=CC=C1', 'MSBNK-Fac_Eng_Univ_Tokyo-JP002103');
-- rutin --
INSERT INTO molecules (molecule, accession) VALUES ('C[C@H]1[C@@H]([C@H]([C@H]([C@@H](O1)OC[C@@H]2[C@H]([C@@H]([C@H]([C@@H](O2)OC3=C(OC4=CC(=CC(=C4C3=O)O)O)C5=CC(=C(C=C5)O)O)O)O)O)O)O)O', 'MSBNK-IPB_Halle-PB001341');
-- caffeine --
INSERT INTO molecules (molecule, accession) VALUES ('O=C2(N(C(=O)N(C=1(N=CN(C=12)C))C)C)', 'MSBNK-IPB_Halle-PB003781');
-- example with triple bond --
INSERT INTO molecules (molecule, accession) VALUES ('OC(=O)C#CC(O)=O', 'MSBNK-Keio_Univ-KO000186');
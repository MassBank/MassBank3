package database

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"log"
	"math"
	"strconv"
)

type PostgresSQLDB struct {
	user       string
	dbname     string
	password   string
	host       string
	port       uint
	connString string
	database   *sql.DB
}

func (p *PostgresSQLDB) Count() (int64, error) {
	var count int64
	err := p.database.QueryRow("SELECT COUNT(*) FROM  massbank").Scan(&count)
	return count, err
}

func (p *PostgresSQLDB) DropAllRecords() error {
	var err error
	if err = p.CheckDatabase(); err != nil {
		return err
	}
	q := "DROP TABLE massbank;"
	_, err = p.database.Exec(q)
	if err != nil {
		return err
	}
	q = "DROP TABLE metadata;"
	_, err = p.database.Exec(q)
	if err != nil {
		return err
	}
	return p.init()
}

func (p *PostgresSQLDB) CheckDatabase() error {
	if p.database == nil {
		return errors.New("database not ready")
	}
	return p.database.Ping()
}

func NewPostgresSQLDb(config DBConfig) (*PostgresSQLDB, error) {
	if config.Database != Postgres {
		return nil, errors.New("database type must be Postgres")
	}
	if len(config.DbConnStr) < 1 &&
		(len(config.DbHost) < 1 ||
			len(config.DbName) < 1 ||
			config.DbPort == 0 ||
			config.DbPort > uint(^uint16(0))) {
		return nil, errors.New("database host and port and name not in config, but DbConnStr is also empty")
	}
	if len(config.DbConnStr) > 0 {
		log.Print("Using connection string for database connection, ignoring other values")
	}
	var postgres = PostgresSQLDB{
		user:       config.DbUser,
		dbname:     config.DbName,
		password:   config.DbPwd,
		host:       config.DbHost,
		port:       config.DbPort,
		connString: config.DbConnStr,
		database:   nil,
	}
	if len(config.DbConnStr) < 1 {
		postgres.connString = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
			config.DbHost, config.DbPort, config.DbUser, config.DbPwd, config.DbName)
	}
	return &postgres, nil
}

func (p *PostgresSQLDB) Connect() error {
	if p.database != nil {
		return errors.New("database already connected")
	}
	if db, err := sql.Open("postgres", p.connString); err != nil {
		return err
	} else {
		if err := db.Ping(); err != nil {
			return err
		} else {
			p.database = db
		}
	}
	return p.init()
}

func (p *PostgresSQLDB) init() error {
	var err error
	var queries = []string{
		`
		CREATE TABLE IF NOT EXISTS metadata
			(id SERIAL,
			commit char(40),
			timestamp timestamp NOT NULL,
			version varchar(10) NOT NULL,
		    PRIMARY KEY (id),
		    UNIQUE (commit,timestamp,version))
		`,
		`
		CREATE TABLE IF NOT EXISTS massbank 
			(id SERIAL, 
			 filename VARCHAR, 
			 document jsonb,
			 metadataId INT,
			 FOREIGN KEY  (metadataId) REFERENCES metadata(id))
 		`,
		`CREATE INDEX IF NOT EXISTS mb_accession_idx ON massbank((document->'Accession'))`,
		`CREATE UNIQUE INDEX IF NOT EXISTS mb_accession_metadata_idx ON massbank((document->'Accession'),metadataid)`,
	}
	for _, q := range queries {
		if _, err = p.database.Exec(q); err != nil {
			return err
		}
	}
	return nil
}

func (p *PostgresSQLDB) Disconnect() error {
	if p.database == nil {
		return errors.New("database not set")
	}
	if err := p.database.Close(); err != nil {
		return err
	}
	p.database = nil
	return nil
}

func (p *PostgresSQLDB) GetRecord(s *string) (*massbank.Massbank, error) {
	var result massbank.Massbank
	var b []byte
	err := p.database.QueryRow("SELECT document FROM massbank WHERE document->'Accession'->>'String' = $1", *s).Scan(&b)
	json.Unmarshal(b, &result)
	return &result, err
}

func (p *PostgresSQLDB) GetRecords(filters Filters, limit uint64, offset uint64) ([]*massbank.Massbank, error) {
	if limit == 0 {
		limit = math.MaxInt64
	}
	rows, err := p.database.Query("SELECT document FROM massbank LIMIT $1 OFFSET $2", limit, offset)
	if err != nil {
		return nil, err
	}
	var result = []*massbank.Massbank{}
	for rows.Next() {
		var mb massbank.Massbank
		var b []byte
		if err = rows.Scan(&b); err != nil {
			return nil, err
		}
		json.Unmarshal(b, &mb)
		result = append(result, &mb)
	}
	return result, nil
}

func (p *PostgresSQLDB) UpdateMetadata(meta *massbank.MbMetaData) (string, error) {
	if err := p.CheckDatabase(); err != nil {
		return "", err
	}
	var id = 0
	q := `INSERT INTO metadata(commit,timestamp,version) 
			VALUES  ($1,$2,$3)  
			ON CONFLICT DO NOTHING 
			RETURNING id;`
	err := p.database.QueryRow(q, meta.Commit, meta.Timestamp, meta.Version).Scan(&id)
	if err != nil {
		err = p.database.QueryRow("SELECT id FROM metadata WHERE commit = $1 AND timestamp = $2 AND  version = $3", meta.Commit, meta.Timestamp, meta.Version).Scan(&id)

	}
	return strconv.Itoa(id), err

}

func (p *PostgresSQLDB) AddRecord(record *massbank.Massbank, metaDataId string) error {
	records := []*massbank.Massbank{record}
	return p.AddRecords(records, metaDataId)
}

func (p *PostgresSQLDB) AddRecords(records []*massbank.Massbank, metaDataId string) error {
	if err := p.CheckDatabase(); err != nil {
		return err
	}
	tx, err := p.database.Begin()
	if err != nil {
		return err
	}
	q := `INSERT INTO massbank(
                     filename,
                     document,
                     metadataid) 
			VALUES ($1,$2,$3);`
	pStmt, err := tx.Prepare(q)
	if err != nil {
		tx.Rollback()
		return err
	}
	mid, err := strconv.ParseInt(metaDataId, 10, 64)
	if err != nil {
		tx.Rollback()
		return err
	}
	for _, record := range records {
		js, err := json.Marshal(record)
		if err != nil {
			tx.Rollback()
			return err
		}
		_, err = pStmt.Exec(record.Metadata.FileName, js, mid)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	err = tx.Commit()
	return err
}

func (p *PostgresSQLDB) UpdateRecord(record *massbank.Massbank, metaDataId string, upsert bool) (uint64, uint64, error) {
	records := []*massbank.Massbank{record}
	return p.UpdateRecords(records, metaDataId, upsert)
}

func (p *PostgresSQLDB) UpdateRecords(records []*massbank.Massbank, metaDataId string, upsert bool) (uint64, uint64, error) {
	var err error
	if err = p.CheckDatabase(); err != nil {
		return 0, 0, err
	}
	tx, err := p.database.Begin()
	if err != nil {
		return 0, 0, err
	}
	mid, err := strconv.ParseInt(metaDataId, 10, 64)
	if err != nil {
		return 0, 0, err
	}
	var inserted int64 = 0
	var modified int64 = 0
	var last int64 = 0
	var q string
	if upsert {
		q = `
		INSERT INTO massbank(
                     filename,
                     document,
                     metadataid)
			VALUES ($1,$2,$3)
			ON CONFLICT ((document->'Accession'),metadataid) DO UPDATE 
				SET filename = $1,
				    document = $2;
		`

	} else {
		q = `
		UPDATE massbank 
			SET filename = $1,
			    document = $2
			WHERE (document->'Accession') == $3 
			  AND  metadataid= $3 `
	}
	stmt, err := tx.Prepare(q)
	if err != nil {
		return 0, 0, err
	}
	for _, r := range records {
		js, err := json.Marshal(r)
		if err != nil {
			tx.Rollback()
			return uint64(modified), uint64(inserted), err
		}
		var res sql.Result
		if upsert {
			res, err = stmt.Exec(r.Metadata.FileName, js, mid)
		} else {
			res, err = stmt.Exec(r.Metadata.FileName, js, mid, r.Accession.String)
		}
		if err != nil {
			return 0, 0, err
		}
		if res != nil {
			mod, _ := res.RowsAffected()
			modified += mod
			l, _ := res.LastInsertId()
			if last != l {
				last = l
				inserted += 1
			}
		}

	}
	return uint64(modified), uint64(inserted), tx.Commit()

}

func (p *PostgresSQLDB) IsEmpty() (bool, error) {
	var err error
	if err = p.CheckDatabase(); err != nil {
		return false, err
	}
	var count uint
	res := p.database.QueryRow(`SELECT COUNT(*) FROM massbank;`)
	err = res.Scan(&count)
	if err != nil && err.(*pq.Error).Code == "42P01" {
		return true, nil
	}
	if err != nil {
		return false, err
	}
	return count == 0, nil
}

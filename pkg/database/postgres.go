package database

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"github.com/nullism/bqb"
	"log"
	"strconv"
)

// PostgresSQLDB is a struct representing a postgres connection. This should implement
// the [MB3Database] interface.
type PostgresSQLDB struct {
	user       string
	dbname     string
	password   string
	host       string
	port       uint
	connString string
	database   *sql.DB
}

func (p *PostgresSQLDB) GetMetaData() (*MB3MetaData, error) {
	//TODO implement me
	panic("implement me")
}

// NewPostgresSQLDb creates a postgres database handle implementing [MB3Database] from the configuration.
// It does test the connection or connect to the database. This should be done by [Connect()].
//
// Returns an error if the connection data is not syntactically valid.
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
		log.Println("Using connection string for database connection, ignoring other values")
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

// Connect see [MB3Database.Connect]
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

func (p *PostgresSQLDB) Ping() error {
	return p.database.Ping()
}

// Disconnect see [MB3Database.Disconnect]
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

// Count see [MB3Database.Count]
func (p *PostgresSQLDB) Count() (int64, error) {
	var count int64
	err := p.database.QueryRow("SELECT COUNT(*) FROM  massbank").Scan(&count)
	if err != nil && err.(*pq.Error).Code == "42P01" {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}
	return count, err
}

// IsEmpty see [MB3Database.IsEmpty]
func (p *PostgresSQLDB) IsEmpty() (bool, error) {
	var err error
	if err = p.checkDatabase(); err != nil {
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

// DropAllRecords see [MB3Database.DropAllRecords]
func (p *PostgresSQLDB) DropAllRecords() error {
	var err error
	if err = p.checkDatabase(); err != nil {
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

// GetRecord see [MB3Database.GetRecord]
func (p *PostgresSQLDB) GetRecord(s *string) (*massbank.MassBank2, error) {
	var result massbank.MassBank2
	var b []byte
	if err := p.database.QueryRow("SELECT document FROM massbank WHERE document->'Accession'->>'String' = $1", *s).Scan(&b); err != nil {
		return nil, err
	}
	var err = json.Unmarshal(b, &result)
	return &result, err
}

// GetRecords see [MB3Database.GetRecords]
func (p *PostgresSQLDB) GetRecords(filters Filters) ([]*massbank.MassBank2, int64, error) {
	if filters.Limit <= 0 {
		filters.Limit = DefaultValues.Limit
	}
	if filters.MassEpsilon == nil {
		filters.MassEpsilon = &DefaultValues.MassEpsilon
	}
	if filters.IntensityCutoff == nil {
		filters.IntensityCutoff = &DefaultValues.IntensityCutoff
	}

	where := bqb.Optional("WHERE")
	if filters.InstrumentType != nil {
		where.And("document->'Acquisition'->'InstrumentType'->>'String' IN (?)", *filters.InstrumentType)
	}
	if filters.MsType != nil {
		var msTypes []string
		for _, ms := range *filters.MsType {
			msTypes = append(msTypes, ms.String())
		}
		where.And("EXISTS (SELECT * FROM jsonb_array_elements(document->'Acquisition'->'MassSpectrometry') ms WHERE ms->>'Subtag' = 'MS_TYPE' AND ms->>'String' IN (?))", msTypes)
	}
	if filters.IonMode != massbank.ANY {
		where.And("EXISTS (SELECT * FROM jsonb_array_elements(document->'Acquisition'->'MassSpectrometry') ms WHERE ms->>'Subtag' = 'ION_MODE' AND ms->>'String' = ?)", string(filters.IonMode))
	}
	if filters.Mass != nil {
		where.And("(document->'Compound'->'mass'->>'Value')::float BETWEEN ? AND ?", *filters.Mass-*filters.MassEpsilon, *filters.Mass+*filters.MassEpsilon)
	}
	if filters.Splash != "" {
		where.And("document->'Peak'->'Splash'->>'String' = ?", filters.Splash)
	}
	if filters.CompoundName != "" {
		where.And("EXISTS (SELECT * FROM jsonb_array_elements(document->'Compound'->'name') name WHERE name->>'String' ILIKE ?)", "%"+filters.CompoundName+"%")
	}
	if filters.Formula != "" {
		where.And("document->'Compound'->'formula'->>'String' ILIKE ?", "%"+filters.Formula+"%")
	}
	if filters.Contributor != "" {
		where.And("document->'Accession'->>'String' ILIKE ?", "%"+filters.Contributor+"%")
	}
	if filters.InchiKey != "" {
		where.And("jsonb_typeof(document->'Compound'->'link') = 'array' AND EXISTS (SELECT * FROM jsonb_array_elements(document->'Compound'->'link') link WHERE link->>'Database' = 'INCHIKEY' AND link->>'Identifier' = ?)", filters.InchiKey)
	}
	if filters.Peaks != nil {
		for _, p := range *filters.Peaks {
			where.And("EXISTS (SELECT * FROM jsonb_array_elements(document->'Peak'->'Peak'->'Mz') mz WHERE mz BETWEEN ? AND ?)", p-*filters.MassEpsilon, p+*filters.MassEpsilon)
		}
	}

	query := bqb.New("SELECT document FROM massbank ?", where)
	if filters.PeakDifferences != nil {
		innerwhere := bqb.New("WHERE t1.mz > t2.mz")
		diff := bqb.Optional("")
		for _, pd := range *filters.PeakDifferences {
			diff.Or("(t1.mz-t2.mz BETWEEN ? AND ?)", pd-*filters.MassEpsilon, pd+*filters.MassEpsilon)
		}
		innerwhere.And("?", diff)
		query = bqb.New("SELECT massbank.document FROM massbank JOIN (WITH t AS (SELECT mz,id FROM (SELECT jsonb_array_elements(document->'Peak'->'Peak'->'Mz')::float AS mz,jsonb_array_elements(document->'Peak'->'Peak'->'Rel')::int AS rel,id FROM massbank) as relmz WHERE relmz.rel>=?) SELECT DISTINCT t1.id FROM t as t1 LEFT JOIN t as t2 ON t1.id=t2.id ?) AS diff ON massbank.id = diff.id", *filters.IntensityCutoff, innerwhere)

	}
	query.Space("ORDER BY massbank.id LIMIT ? OFFSET ?", filters.Limit, filters.Offset)
	sql, params, err := query.ToPgsql()
	rows, err := p.database.Query(sql, params...)
	if err != nil {
		return nil, 0, err
	}
	var result = []*massbank.MassBank2{}
	for rows.Next() {
		var mb massbank.MassBank2
		var b []byte
		if err = rows.Scan(&b); err != nil {
			return nil, 0, err
		}
		if err := json.Unmarshal(b, &mb); err != nil {
			return nil, 0, err
		}
		result = append(result, &mb)
	}
	return result, 0, nil
}

// GetUniqueValues see [MB3Database.GetUniqueValues]
func (p *PostgresSQLDB) GetUniqueValues(filters Filters) (MB3Values, error) {
	var query = `
SELECT to_json(it) as instrument_type,
       to_json(mt) as ms_type,
       to_json(im) as ion_mode,
       mass.maxm   as max_mass,
       mass.minm   as min_mass,
       mz.maxmz    as max_mz,
       mz.minmz    as min_mz,
       i.maxi      as max_intensity,
       i.mini      as min_intensity
FROM (SELECT ARRAY(SELECT t
                   FROM (SELECT document -> 'Acquisition' -> 'InstrumentType' ->> 'String' as val,
                                count(id)
                         from massbank
                         GROUP BY document -> 'Acquisition' -> 'InstrumentType' ->> 'String' ORDER BY document -> 'Acquisition' -> 'InstrumentType' ->> 'String') t)) as it,
     (SELECT ARRAY(SELECT t
                   FROM (select t.ms ->> 'String' as val, count(t.ms)
                         FROM (Select jsonb_array_elements(document -> 'Acquisition' -> 'MassSpectrometry') as ms
                               from massbank) t
                         where ms ->> 'Subtag' = 'MS_TYPE'
                         GROUP BY t.ms ORDER BY t.ms) t)) as mt,
     (SELECT ARRAY(SELECT t
                   FROM (select t.ms ->> 'String' as val, count(t.ms)
                         FROM (Select jsonb_array_elements(document -> 'Acquisition' -> 'MassSpectrometry') as ms
                               from massbank) t
                         where ms ->> 'Subtag' = 'ION_MODE'
                         GROUP BY t.ms ORDER BY t.ms) t)) as im,
     (SELECT MIN((document -> 'Compound' -> 'mass' ->> 'Value')::float8) as minm,
             MAX((document -> 'Compound' -> 'mass' ->> 'Value')::float8) as maxm
      from massbank) as mass,
     (SELECT MIN(t.mz) as minmz, MAX(t.mz) as maxmz
      from (SELECT jsonb_array_elements(document -> 'Peak' -> 'Peak' -> 'Mz')::float8 as mz FROM massbank) t) as mz,
     (SELECT MIN(t.i) as mini, MAX(t.i) as maxi
      FROM (SELECT jsonb_array_elements(document -> 'Peak' -> 'Peak' -> 'Intensity')::float8 as i
            FROM massbank) t) as i`
	var val MB3Values
	row := p.database.QueryRow(query)
	itjs := make([]uint8, 0)
	mtjs := make([]uint8, 0)
	imjs := make([]uint8, 0)
	err := row.Scan(
		&itjs,
		&mtjs,
		&imjs,
		&val.Mass.Max,
		&val.Mass.Min,
		&val.Peak.Max,
		&val.Peak.Min,
		&val.Intensity.Max,
		&val.Intensity.Min)
	var rit = struct{ Array []MBCountValues }{}
	json.Unmarshal(itjs, &rit)
	val.InstrumentType = append(val.InstrumentType, rit.Array...)
	json.Unmarshal(mtjs, &rit)
	val.MSType = append(val.MSType, rit.Array...)
	json.Unmarshal(imjs, &rit)
	val.IonMode = append(val.IonMode, rit.Array...)
	return val, err
}

// UpdateMetadata see [MB3Database.UpdateMetadata]
func (p *PostgresSQLDB) UpdateMetadata(meta *massbank.MbMetaData) (string, error) {
	if err := p.checkDatabase(); err != nil {
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

// AddRecord see [MB3Database.AddRecord]
func (p *PostgresSQLDB) AddRecord(record *massbank.MassBank2, metaDataId string) error {
	records := []*massbank.MassBank2{record}
	return p.AddRecords(records, metaDataId)
}

// AddRecords see [MB3Database.AddRecords]
func (p *PostgresSQLDB) AddRecords(records []*massbank.MassBank2, metaDataId string) error {
	if err := p.checkDatabase(); err != nil {
		return err
	}
	q := `INSERT INTO massbank(
                     filename,
                     document,
                     metadataid) 
			VALUES ($1,$2,$3);`
	tx, err := p.database.Begin()
	if err != nil {
		return err
	}
	pStmt, err := tx.Prepare(q)
	if err != nil {
		if err2 := tx.Rollback(); err2 != nil {
			return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())

		}
		return err
	}
	mid, err := strconv.ParseInt(metaDataId, 10, 64)
	if err != nil {
		if err2 := tx.Rollback(); err2 != nil {
			return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
		}
		return err
	}
	for _, record := range records {
		js, err := json.Marshal(record)
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}
		_, err = pStmt.Exec(record.Metadata.FileName, js, mid)
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}
	}
	err = tx.Commit()
	return err
}

// UpdateRecord see [MB3Database.UpdateRecord]
func (p *PostgresSQLDB) UpdateRecord(record *massbank.MassBank2, metaDataId string, upsert bool) (uint64, uint64, error) {
	records := []*massbank.MassBank2{record}
	return p.UpdateRecords(records, metaDataId, upsert)
}

// UpdateRecords see [MB3Database.UpdateRecords]
func (p *PostgresSQLDB) UpdateRecords(records []*massbank.MassBank2, metaDataId string, upsert bool) (uint64, uint64, error) {
	var err error
	if err = p.checkDatabase(); err != nil {
		return 0, 0, err
	}
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
			WHERE (document->'Accession') = $4 
			  AND  metadataid= $3 `
	}
	tx, err := p.database.Begin()
	stmt, err := tx.Prepare(q)
	if err != nil {
		return 0, 0, err
	}
	for _, r := range records {
		js, err := json.Marshal(r)
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return 0, 0, errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return uint64(modified), uint64(inserted), err
		}
		var res sql.Result
		if upsert {
			res, err = stmt.Exec(r.Metadata.FileName, js, mid)
		} else {
			acc, _ := json.Marshal(r.Accession)
			res, err = stmt.Exec(r.Metadata.FileName, js, mid, acc)
		}
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return 0, 0, errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
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

func (p *PostgresSQLDB) checkDatabase() error {
	if p.database == nil {
		return errors.New("database not ready")
	}
	return p.database.Ping()
}

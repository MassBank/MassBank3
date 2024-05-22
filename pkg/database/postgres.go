package database

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/Code-Hex/dd"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"github.com/nullism/bqb"
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
	err := p.database.QueryRow("SELECT COUNT(id) FROM  massbank;").Scan(&count)
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
	res := p.database.QueryRow(`SELECT COUNT(id) FROM massbank;`)
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
	q := "DROP TABLE massbank CASCADE;"
	_, err = p.database.Exec(q)
	if err != nil {
		return err
	}
	q = "DROP TABLE metadata CASCADE;"
	_, err = p.database.Exec(q)
	if err != nil {
		return err
	}
	return p.init()
}

// GetRecord see [MB3Database.GetRecord]
func (p *PostgresSQLDB) GetRecord(s *string) (*massbank.MassBank2, error) {
	var result = massbank.MassBank2{}

	var massbankId uint
	var filename string
	var accession string
	var title string
	var comments []string
	var copyright string
	var date time.Time
	var metadataId uint
	var query = "SELECT * FROM massbank WHERE accession = $1;"
	err := p.database.QueryRow(query, *s).Scan(
		&massbankId, 
		&filename,
		&accession,
		&title,
		(*pq.StringArray)(&comments),
		&copyright,
		&date,
		&metadataId,
	); 
	if err != nil {
		return nil, err
	}

	result.RecordTitle = &title
	result.Date = &massbank.RecordDate{Created: date, Updated: date, Modified: date} 
	result.Accession = &accession
	result.Comments = &[]massbank.SubtagProperty{} 
	for _, comment := range comments {
		parts := strings.Split(comment, "---")
		*result.Comments = append(*result.Comments, massbank.SubtagProperty{Subtag: parts[0], Value: parts[1]})
	}	

	// contributors
	var contributor string
	query = "SELECT name FROM contributor WHERE id IN (SELECT contributor_id FROM accession_contributor WHERE massbank_id = $1);"
	err = p.database.QueryRow(query, massbankId).Scan(&contributor); 
	if err == nil {
		result.Contributor = &contributor
	}
	

	// authors
	query = "SELECT name FROM author WHERE id IN (SELECT author_id FROM accession_author WHERE massbank_id = $1);"
	rows, err := p.database.Query(query, massbankId)
    if err == nil {
		defer rows.Close()

		result.Authors = &[]massbank.RecordAuthorName{}
		for rows.Next() {
			var author string
			if err := rows.Scan(&author); err != nil {
				return nil, err
			}
			*result.Authors = append(*result.Authors, massbank.RecordAuthorName{Name: author})
		}
		if err = rows.Err(); err != nil {
			return nil, err
		}
    }
    
	
	// license
	query = "SELECT name FROM license WHERE id IN (SELECT license_id FROM accession_license WHERE massbank_id = $1);"
	var license string
	err = p.database.QueryRow(query, massbankId).Scan(&license)
    if err == nil {
		result.License = &license
    }

	// publication (for now only one publication per record)
	query = "SELECT name FROM publication WHERE id IN (SELECT publication_id FROM accession_publication WHERE massbank_id = $1);"
	var publication string
	err = p.database.QueryRow(query, massbankId).Scan(&publication)
    if err == nil {		
		result.Publication = &publication
    }
	
	// compound
	query = "SELECT inchi, formula, smiles, mass FROM compound WHERE id IN (SELECT compound_id FROM compound_name WHERE massbank_id = $1);"
	var inchi string
	var formula string
	var smiles string
	var mass float64
	err = p.database.QueryRow(query, massbankId).Scan(&inchi, &formula, &smiles, &mass)
	if err == nil {
		result.Compound = massbank.CompoundProperties{
			InChI:   &inchi,
			Formula: &formula,
			Smiles:  &smiles,
			Mass:    &mass,
		}
		// compound names
		result.Compound.Names = &[]string{}
		query = "SELECT name FROM compound_name WHERE compound_id IN (SELECT compound_id FROM compound_name WHERE massbank_id = $1);"
		rows, err = p.database.Query(query, massbankId)
		if err == nil {
			defer rows.Close()

			for rows.Next() {
				var name string
				if err := rows.Scan(&name); err != nil {
					return nil, err
				}
				*result.Compound.Names = append(*result.Compound.Names, name)
			}
			if err = rows.Err(); err != nil {
				return nil, err
			}
		}
		
		// compound classes
		result.Compound.Classes = &[]string{}
		query = "SELECT class FROM compound_class WHERE compound_id IN (SELECT compound_id FROM compound_class WHERE massbank_id = $1);"
		rows, err = p.database.Query(query, massbankId)
		if err == nil {
			defer rows.Close()

			for rows.Next() {
				var class string
				if err := rows.Scan(&class); err != nil {
					return nil, err
				}
				*result.Compound.Classes = append(*result.Compound.Classes, class)
			}
			if err = rows.Err(); err != nil {
				return nil, err
			}
		}
		
		// compound link
		result.Compound.Link = &[]massbank.DatabaseProperty{}
		query = "SELECT database, identifier FROM compound_link WHERE compound_id IN (SELECT compound_id FROM compound_link WHERE massbank_id = $1);"
		rows, err = p.database.Query(query, massbankId)
		if err == nil {
			defer rows.Close()

			for rows.Next() {
				var database string
				var identifier string
				if err := rows.Scan(&database, &identifier); err != nil {
					return nil, err
				}
				*result.Compound.Link = append(*result.Compound.Link, massbank.DatabaseProperty{Database: database, Identifier: identifier})
			}
			if err = rows.Err(); err != nil {
				return nil, err
			}
		}
		
		fmt.Println("compound: ", result.Compound)
	}

	// acquisition
	query = "SELECT instrument, instrument_type FROM acquisition_instrument WHERE id IN (SELECT acquisition_instrument_id FROM accession_acquisition WHERE massbank_id = $1);"
	var instrument string
	var instrumentType string
	err = p.database.QueryRow(query, massbankId).Scan(&instrument, &instrumentType)
	if err == nil {
		result.Acquisition = massbank.AcquisitionProperties{
			Instrument:     &instrument,
			InstrumentType: &instrumentType,
		}
		// acquisition mass spectrometry
		result.Acquisition.MassSpectrometry = &[]massbank.SubtagProperty{}
		query = "SELECT subtag, value FROM acquisition_mass_spectrometry WHERE massbank_id = $1;"
		rows, err = p.database.Query(query, massbankId)
		if err == nil {
			defer rows.Close()

			for rows.Next() {
				var subtag string
				var value string
				if err := rows.Scan(&subtag, &value); err != nil {
					return nil, err
				}
				*result.Acquisition.MassSpectrometry = append(*result.Acquisition.MassSpectrometry, massbank.SubtagProperty{Subtag: subtag, Value: value})
			}
			if err = rows.Err(); err != nil {
				return nil, err
			}			
		}
		// acquisition chromatography
		result.Acquisition.Chromatography = &[]massbank.SubtagProperty{}
		query = "SELECT subtag, value FROM acquisition_chromatography WHERE massbank_id = $1;"
		rows, err = p.database.Query(query, massbankId)
		if err == nil {
			defer rows.Close()

			for rows.Next() {
				var subtag string
				var value string
				if err := rows.Scan(&subtag, &value); err != nil {
					return nil, err
				}
				*result.Acquisition.Chromatography = append(*result.Acquisition.Chromatography, massbank.SubtagProperty{Subtag: subtag, Value: value})
			}
			if err = rows.Err(); err != nil {
				return nil, err
			}
		}
		
		// acquisition general
		result.Acquisition.General = &[]massbank.SubtagProperty{}
		query = "SELECT subtag, value FROM acquisition_general WHERE massbank_id = $1;"
		rows, err = p.database.Query(query, massbankId)
		if err == nil {
			defer rows.Close()

			for rows.Next() {
				var subtag string
				var value string
				if err := rows.Scan(&subtag, &value); err != nil {
					return nil, err
				}
				*result.Acquisition.General = append(*result.Acquisition.General, massbank.SubtagProperty{Subtag: subtag, Value: value})
			}
			if err = rows.Err(); err != nil {
				return nil, err
			}
		}
	}
	
	
	// mass spectrometry
	query = "SELECT subtag, value FROM mass_spectrometry_focused_ion WHERE massbank_id = $1;"
	result.MassSpectrometry = massbank.MassSpecProperties{}
	rows, err = p.database.Query(query, massbankId)
	if err == nil {
		defer rows.Close()

		result.MassSpectrometry.FocusedIon = &[]massbank.SubtagProperty{}
		for rows.Next() {
			var subtag string
			var value string
			if err := rows.Scan(&subtag, &value); err != nil {
				return nil, err
			}

			*result.MassSpectrometry.FocusedIon = append(*result.MassSpectrometry.FocusedIon, massbank.SubtagProperty{Subtag: subtag, Value: value})
		}
		if err = rows.Err(); err != nil {
			return nil, err
		}
	}
	query = "SELECT subtag, value FROM mass_spectrometry_data_processing WHERE massbank_id = $1;"
	rows, err = p.database.Query(query, massbankId)
	if err == nil {
		defer rows.Close()
	
		result.MassSpectrometry.DataProcessing = &[]massbank.SubtagProperty{}	
		for rows.Next() {
			var subtag string
			var value string
			if err := rows.Scan(&subtag, &value); err != nil {
				return nil, err
		}

			*result.MassSpectrometry.DataProcessing = append(*result.MassSpectrometry.DataProcessing, massbank.SubtagProperty{Subtag: subtag, Value: value})
		}
		if err = rows.Err(); err != nil {
			return nil, err
		}
	}	
	
	// peak
	result.Peak = massbank.PeakProperties{}
	var spectrumId uint
	var splash string
	var numPeak uint

	query = "SELECT id, splash, num_peak FROM spectrum WHERE massbank_id = $1;"
	err = p.database.QueryRow(query, massbankId).Scan(&spectrumId, &splash, &numPeak)
	if err == nil {
		result.Peak.Peak = &massbank.PkPeak{}
			
		result.Peak.Splash = &splash
		result.Peak.NumPeak = &numPeak

		query = "SELECT mz, intensity, relative_intensity FROM peak WHERE spectrum_id = $1;"
		rows, err = p.database.Query(query, spectrumId)
		if err == nil {
			defer rows.Close()

			result.Peak.Peak.Mz = []float64{}
			result.Peak.Peak.Intensity = []float64{}
			result.Peak.Peak.Rel = []uint{}
			for rows.Next() {
				var mz float64
				var intensity float64
				var rel uint
				if err := rows.Scan(&mz, &intensity, &rel); err != nil {
					return nil, err
				}

				result.Peak.Peak.Mz = append(result.Peak.Peak.Mz, mz)
				result.Peak.Peak.Intensity = append(result.Peak.Peak.Intensity, intensity)
				result.Peak.Peak.Rel = append(result.Peak.Peak.Rel, rel)
			}
			if err = rows.Err(); err != nil {
				return nil, err
			}
		}		
	}
	

	return &result, err
}

// GetRecords see [MB3Database.GetRecords]
func (p *PostgresSQLDB) GetRecords(filters Filters) (*SearchResult, error) {
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
		where.And("document->'acquisition'->>'instrument_type' IN (?)", *filters.InstrumentType)
	}
	if filters.MsType != nil {
		var msTypes []string
		for _, ms := range *filters.MsType {
			msTypes = append(msTypes, ms.String())
		}
		where.And("EXISTS (SELECT * FROM jsonb_array_elements(document->'acquisition'->'mass_spectrometry') ms WHERE ms->>'subtag' = 'MS_TYPE' AND ms->>'value' IN (?))", msTypes)
	}
	if filters.IonMode != massbank.ANY {
		where.And("EXISTS (SELECT * FROM jsonb_array_elements(document->'acquisition'->'mass_spectrometry') ms WHERE ms->>'subtag' = 'ION_MODE' AND ms->>'value' = ?)", string(filters.IonMode))
	}
	if filters.Mass != nil {
		where.And("(document->'compound'->>'mass')::float BETWEEN ? AND ?", *filters.Mass-*filters.MassEpsilon, *filters.Mass+*filters.MassEpsilon)
	}
	if filters.Splash != "" {
		where.And("document->'peak'->>'splash' = ?", filters.Splash)
	}
	if filters.CompoundName != "" {
		where.And("EXISTS (SELECT * FROM jsonb_array_elements(document->'compound'->'name') name WHERE name::text ILIKE ?)", "%"+filters.CompoundName+"%")
	}
	if filters.Formula != "" {
		where.And("document->'compound'->>'formula' ILIKE ?", "%"+filters.Formula+"%")
	}
	if filters.Contributor != nil {
		where.And("document->>'contributor' IN (?)", *filters.Contributor)
	}
	if filters.InchiKey != "" {
		where.And("jsonb_typeof(document->'compound'->'link') = 'array' AND EXISTS (SELECT * FROM jsonb_array_elements(document->'compound'->'link') link WHERE link->>'database' = 'INCHIKEY' AND link->>'identifier' = ?)", filters.InchiKey)
	}
	if filters.Peaks != nil {
		for _, p := range *filters.Peaks {
			where.And("EXISTS (SELECT * FROM jsonb_array_elements(document->'peak'->'peak'->'mz') mz WHERE mz BETWEEN ? AND ?)", p-*filters.MassEpsilon, p+*filters.MassEpsilon)
		}
	}
	var peakdiffquery = bqb.New("")
	if filters.PeakDifferences != nil {
		innerwhere := bqb.New("WHERE t1.mz > t2.mz")
		diff := bqb.Optional("")
		for _, pd := range *filters.PeakDifferences {
			diff.Or("(t1.mz-t2.mz BETWEEN ? AND ?)", pd-*filters.MassEpsilon, pd+*filters.MassEpsilon)
		}
		innerwhere.And("?", diff)
		peakdiffquery = bqb.New("JOIN (WITH t AS (SELECT mz,id FROM (SELECT jsonb_array_elements(document->'peak'->'peak'->'mz')::float AS mz,jsonb_array_elements(document->'peak'->'peak'->'rel')::int AS rel,id FROM massbank) AS relmz WHERE relmz.rel>=?) SELECT DISTINCT t1.id FROM t AS t1 LEFT JOIN t AS t2 ON t1.id=t2.id ?) AS diff ON massbank.id = diff.id", *filters.IntensityCutoff, innerwhere)

	}
	query := bqb.New("WITH mbdeprecated AS (select count(*) OVER() spectraCount, json_build_object('id', document->>'accession','title', document->>'title')::json spectrum, document->'compound' compound FROM massbank ? ?) SELECT  count(*) OVER() resultCount, (array_agg(DISTINCT spectraCount))[1] spectraCount, compound->>'inchi' inchi, array_to_json(array_agg(spectrum ORDER BY spectrum->>'id')) spectra, array_to_json(array_agg(DISTINCT compound->>'formula')) formula, array_to_json(array_agg(DISTINCT compound->>'mass')) mass, array_to_json(array_agg(DISTINCT compound->'name')) names , array_to_json(array_agg(DISTINCT compound->>'smiles')) smiles FROM mbdeprecated GROUP BY inchi", peakdiffquery, where)
	query.Space("ORDER BY (array_agg(spectrum))[1]->>'title' ASC LIMIT ? OFFSET ?", filters.Limit, filters.Offset)
	sql, params, err := query.ToPgsql()
	rows, err := p.database.Query(sql, params...)
	if err != nil {
		return nil, err
	}
	var searchResult = SearchResult{
		SpectraCount: 0,
		ResultCount:  0,
		Data:         map[string]SearchResultData{},
	}
	for rows.Next() {
		var row = struct {
			inchi   string
			spectra []SpectrumMetaData
			formula []string
			mass    []float64
			names   [][]string
			smiles  []string
		}{}
		var rawBytes = struct {
			spectra []byte
			formula []byte
			mass    []byte
			names   []byte
			smiles  []byte
		}{}

		if err = rows.Scan(&searchResult.ResultCount, &searchResult.SpectraCount, &row.inchi, &rawBytes.spectra, &rawBytes.formula, &rawBytes.mass, &rawBytes.names, &rawBytes.smiles); err != nil {
			return nil, err
		}
		var massStr []string
		json.Unmarshal(rawBytes.spectra, &row.spectra)
		json.Unmarshal(rawBytes.formula, &row.formula)
		json.Unmarshal(rawBytes.mass, &massStr)
		json.Unmarshal(rawBytes.names, &row.names)
		json.Unmarshal(rawBytes.smiles, &row.smiles)
		for _, ms := range massStr {
			m, err := strconv.ParseFloat(ms, 64)
			if err != nil {
				log.Println("Could not convert mass to float: ", ms, err.Error())
			}
			row.mass = append(row.mass, m)

		}
		var namesMap = map[string]bool{}
		for _, nn := range row.names {
			for _, n := range nn {
				namesMap[n] = true
			}
		}
		names := []string{}
		for k := range namesMap {
			names = append(names, k)
		}
		data := SearchResultData{
			Names:   names,
			Formula: row.formula[0],
			Mass:    row.mass[0],
			Smiles:  row.smiles[0],
			Spectra: row.spectra,
		}
		searchResult.Data[row.inchi] = data
	}
	return &searchResult, nil
}

// GetUniqueValues see [MB3Database.GetUniqueValues]
func (p *PostgresSQLDB) GetUniqueValues(filters Filters) (MB3Values, error) {

	fmt.Println("GetUniqueValues -> start")
	var query = `
SELECT to_json(co) AS contributor,
       to_json(it) AS instrument_type,
       to_json(mt) AS ms_type,
       to_json(im) AS ion_mode,
       mass.maxm   AS max_mass,
       mass.minm   AS min_mass,
       mz.maxmz    AS max_mz,
       mz.minmz    AS min_mz,
       i.maxi      AS max_intensity,
       i.mini      AS min_intensity
FROM
    (SELECT ARRAY(SELECT t
                   FROM (SELECT document ->> 'contributor' AS val,
                                count(id)
                         FROM massbank
                         GROUP BY document ->> 'contributor' ORDER BY document ->> 'contributor') t)) AS co,
     (SELECT ARRAY(SELECT t
                   FROM (SELECT document -> 'acquisition' ->> 'instrument_type' AS val,
                                count(id)
                         FROM massbank
                         GROUP BY document -> 'acquisition' ->> 'instrument_type' ORDER BY document -> 'acquisition' ->> 'instrument_type' ) t)) AS it,
     (SELECT ARRAY(SELECT t
                   FROM (SELECT t.ms ->> 'value' AS val, count(t.ms)
                         FROM (SELECT jsonb_array_elements(document -> 'acquisition' -> 'mass_spectrometry') AS ms
                               FROM massbank) t
                         WHERE ms ->> 'subtag' = 'MS_TYPE'
                         GROUP BY t.ms ORDER BY t.ms) t)) AS mt,
     (SELECT ARRAY(SELECT t
                   FROM (SELECT t.ms ->> 'value' AS val, count(t.ms)
                         FROM (SELECT jsonb_array_elements(document -> 'acquisition' -> 'mass_spectrometry') AS ms
                               FROM massbank) t
                         WHERE ms ->> 'subtag' = 'ION_MODE'
                         GROUP BY t.ms ORDER BY t.ms) t)) AS im,
     (SELECT MIN((document -> 'compound' ->> 'mass' )::float8) AS minm,
             MAX((document -> 'compound' ->> 'mass' )::float8) AS maxm
      FROM massbank) AS mass,
     (SELECT MIN(t.mz) AS minmz, MAX(t.mz) AS maxmz
      FROM (SELECT jsonb_array_elements(document -> 'peak' -> 'peak' -> 'mz')::float8 AS mz FROM massbank) t) AS mz,
     (SELECT MIN(t.i) AS mini, MAX(t.i) AS maxi
      FROM (SELECT jsonb_array_elements(document -> 'peak' -> 'peak' -> 'intensity')::float8 AS i
            FROM massbank) t) AS i`
	var val MB3Values
	row := p.database.QueryRow(query)
	fmt.Println("GetUniqueValues -> end")
	cojs := make([]uint8, 0)
	itjs := make([]uint8, 0)
	mtjs := make([]uint8, 0)
	imjs := make([]uint8, 0)
	err := row.Scan(
		&cojs,
		&itjs,
		&mtjs,
		&imjs,
		&val.Mass.Max,
		&val.Mass.Min,
		&val.Peak.Max,
		&val.Peak.Min,
		&val.Intensity.Max,
		&val.Intensity.Min)
	fmt.Println("GetUniqueValues -> end 2")
	var rit = struct{ Array []MBCountValues }{}
	json.Unmarshal(cojs, &rit)
	val.Contributor = append(val.Contributor, rit.Array...)
	json.Unmarshal(itjs, &rit)
	val.InstrumentType = append(val.InstrumentType, rit.Array...)
	json.Unmarshal(mtjs, &rit)
	val.MSType = append(val.MSType, rit.Array...)
	json.Unmarshal(imjs, &rit)
	val.IonMode = append(val.IonMode, rit.Array...)
	fmt.Println("GetUniqueValues -> end 3")
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
	
	mid, err := strconv.ParseInt(metaDataId, 10, 64)
	if err != nil {
		return err
	}
	for _, record := range records {
		// insert into main table (massbank)
		tx, err := p.database.Begin()
		if err != nil {
			return err
		}
		q := `INSERT INTO massbank (
						filename,
						accession,
						title,
						comments,
						copyright,
						date,
						metadata_id) 
				VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`
		var comments = []string{}
		if record.Comments != nil {
			for _, comment := range *record.Comments {
				comments = append(comments, "\"" + strings.ReplaceAll(comment.Subtag, "\"", "'") + "---" + strings.ReplaceAll(comment.Value, "\"", "'") + "\"")
			} 
		}
		var massbankId int
		err = tx.QueryRow(q,
			record.Metadata.FileName, 
			record.Accession, 
			record.RecordTitle, 
			"{" + strings.Join(comments, ",") + "}", 
			record.Copyright, 
			record.Date.Created,
			mid).Scan(&massbankId)		
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}

		// insert into contributor table
		q = `INSERT INTO contributor (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;`
		var contributorId int
		err = tx.QueryRow(q, *record.Contributor).Scan(&contributorId)
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}
		// insert into accession_contributor table	
		q = `INSERT INTO accession_contributor (massbank_id, contributor_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`					
		_, err = tx.Exec(q, massbankId, contributorId)
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}	

		// insert into author table
		if record.Authors != nil {			
			for _, author := range *record.Authors {	
				q = `INSERT INTO author (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id;`
				var authorId int
				err := tx.QueryRow(q, author.Name).Scan(&authorId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
				q = `INSERT INTO accession_author (massbank_id, author_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`								
				_, err = tx.Exec(q, massbankId, authorId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
			}					
		}
		// insert into license tables
		if record.License != nil {
			q = `INSERT INTO license (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;`
			var licenseId int
			err = tx.QueryRow(q, *record.License).Scan(&licenseId)
			if err != nil {
				if err2 := tx.Rollback(); err2 != nil {
					return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
				}
				return err
			}
			q = `INSERT INTO accession_license (massbank_id, license_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`						
			_, err = tx.Exec(q, massbankId, licenseId)
			if err != nil {
				if err2 := tx.Rollback(); err2 != nil {
					return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
				}
				return err
			}	
		}
		// insert into publication table
		if record.Publication != nil {
			q = `INSERT INTO publication (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;`			
			var publicationId int
			err = tx.QueryRow(q, *record.Publication).Scan(&publicationId)
			if err != nil {
				if err2 := tx.Rollback(); err2 != nil {
					return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
				}
				return err
			}
			q = `INSERT INTO accession_publication (massbank_id, publication_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`						
			_, err = tx.Exec(q, massbankId, publicationId)
			if err != nil {
				if err2 := tx.Rollback(); err2 != nil {
					return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
				}
				return err
			}	
		}
		// insert into compound table
		q = `INSERT INTO compound (inchi, formula, smiles, mass) VALUES ($1, $2, $3, $4) ON CONFLICT (inchi, formula, smiles, mass) DO UPDATE SET inchi = EXCLUDED.inchi, formula = EXCLUDED.formula, smiles = EXCLUDED.smiles, mass = EXCLUDED.mass RETURNING id;`
		var compoundId int
		err = tx.QueryRow(q, *record.Compound.InChI, *record.Compound.Formula, *record.Compound.Smiles, *record.Compound.Mass).Scan(&compoundId)
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}
		if(record.Compound.Names != nil) {
			q = `INSERT INTO compound_name (name, compound_id, massbank_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
			for _, name := range *record.Compound.Names {							
				_, err = tx.Exec(q, name, compoundId, massbankId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
			}
		}
		if(record.Compound.Link != nil) {
			q = `INSERT INTO compound_link (database, identifier, compound_id, massbank_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;`
			for _, link := range *record.Compound.Link {												
				_, err = tx.Exec(q, link.Database, link.Identifier, compoundId, massbankId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
			}
		}
		// insert into acquisition table
		q = `INSERT INTO acquisition_instrument (instrument, instrument_type) VALUES ($1, $2) ON CONFLICT (instrument, instrument_type) DO UPDATE SET instrument = EXCLUDED.instrument, instrument_type = EXCLUDED.instrument_type RETURNING id;`
		var acquisitionInstrumentId int
		err = tx.QueryRow(q, *record.Acquisition.Instrument, *record.Acquisition.InstrumentType).Scan(&acquisitionInstrumentId)		
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}
		q = `INSERT INTO accession_acquisition (massbank_id, acquisition_instrument_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`			
		_, err = tx.Exec(q, massbankId, acquisitionInstrumentId)
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}

		if(record.Acquisition.MassSpectrometry != nil) {
			q = `INSERT INTO acquisition_mass_spectrometry (subtag, value, massbank_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
			for _, subProp := range *record.Acquisition.MassSpectrometry {												
				_, err = tx.Exec(q, subProp.Subtag, subProp.Value, massbankId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
			}
		}
		if(record.Acquisition.Chromatography != nil) {
			q = `INSERT INTO acquisition_chromatography (subtag, value, massbank_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
			for _, subProp := range *record.Acquisition.Chromatography {												
				_, err = tx.Exec(q, subProp.Subtag, subProp.Value, massbankId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
			}
		}
		if(record.Acquisition.General != nil) {
			q = `INSERT INTO acquisition_general (subtag, value, massbank_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
			for _, subProp := range *record.Acquisition.General {												
				_, err = tx.Exec(q, subProp.Subtag, subProp.Value, massbankId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
			}
		}

		// insert into mass spectrometry table
		if(record.MassSpectrometry.FocusedIon != nil) {
			q = `INSERT INTO mass_spectrometry_focused_ion (subtag, value, massbank_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
			for _, subProp := range *record.MassSpectrometry.FocusedIon {				
				_, err = tx.Exec(q, subProp.Subtag, subProp.Value, massbankId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
			}
		}
		if(record.MassSpectrometry.DataProcessing != nil) {
			q = `INSERT INTO mass_spectrometry_data_processing(subtag, value, massbank_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
			for _, subProp := range *record.MassSpectrometry.DataProcessing {				
				_, err = tx.Exec(q, subProp.Subtag, subProp.Value, massbankId)
				if err != nil {
					if err2 := tx.Rollback(); err2 != nil {
						return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
					}
					return err
				}
			}
		}

		// insert into peak-related tables
		q = `INSERT INTO spectrum (splash, num_peak, massbank_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id;`		
		var spectrumId int
		err = tx.QueryRow(q, *record.Peak.Splash, *record.Peak.NumPeak, massbankId).Scan(&spectrumId)
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}
		
		q = `INSERT INTO peak (mz, intensity, relative_intensity, spectrum_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;`
		for i, mz := range record.Peak.Peak.Mz {
			_, err = tx.Exec(q, mz, record.Peak.Peak.Intensity[i], record.Peak.Peak.Rel[i], spectrumId)
			if err != nil {
				if err2 := tx.Rollback(); err2 != nil {
					return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
				}
				return err
			}
		}
		if(record.Peak.Annotation != nil && record.Peak.Annotation.Values != nil) {
			q = `INSERT INTO peak_annotation(subtag, value, spectrum_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
			for _, header := range record.Peak.Annotation.Header {
				values := record.Peak.Annotation.Values[header];
				for _, value := range values {
					_, err = tx.Exec(q, header, value, spectrumId)
					if err != nil {
						if err2 := tx.Rollback(); err2 != nil {
							return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
						}
						return err
					}
				}
			}
		}

		err = tx.Commit()
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}	
	}

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
                     metadata_id)
			VALUES ($1,$2,$3)
			ON CONFLICT (accession),metadata_id) DO UPDATE 
				SET filename = $1,
				    document = $2;
		`

	} else {
		q = `
		UPDATE massbank 
			SET filename = $1,
			    document = $2
			WHERE (accession) = $4 
			  AND  metadata_id= $3 `
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
	var query = 
		`
		DROP SCHEMA public CASCADE;
		CREATE SCHEMA public;

		CREATE TABLE IF NOT EXISTS metadata (
			id SERIAL PRIMARY KEY,
			commit char(40),
			timestamp timestamp NOT NULL,
			version varchar(10) NOT NULL,
			UNIQUE (commit, timestamp, version)
		);

		CREATE TABLE IF NOT EXISTS massbank (
			id SERIAL PRIMARY KEY,
			filename TEXT NOT NULL,
			accession VARCHAR(40) NOT NULL UNIQUE,	
			title TEXT,
			comments TEXT[],
			copyright TEXT,
			date timestamp NOT NULL,
			metadata_id INT NOT NULL REFERENCES metadata(id) ON UPDATE CASCADE ON DELETE CASCADE
		);

		-- contributor
		CREATE TABLE IF NOT EXISTS contributor (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			UNIQUE (name)
		);
		CREATE TABLE IF NOT EXISTS accession_contributor (
			massbank_id INT REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			contributor_id INT NOT NULL REFERENCES contributor(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (massbank_id, contributor_id)
		);

		-- author
		CREATE TABLE IF NOT EXISTS author (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS accession_author (
			massbank_id INT REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			author_id INT NOT NULL REFERENCES author(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (massbank_id, author_id)
		);

		-- license
		CREATE TABLE IF NOT EXISTS license (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			UNIQUE (name)
		);
		CREATE TABLE IF NOT EXISTS accession_license (
			massbank_id INT REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			license_id INT NOT NULL REFERENCES license(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (massbank_id, license_id)
		);

		-- publication
		CREATE TABLE IF NOT EXISTS publication (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			UNIQUE (name)
		);
		CREATE TABLE IF NOT EXISTS accession_publication (
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			publication_id INT NOT NULL REFERENCES publication(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (massbank_id, publication_id)
		);

		-- compound
		CREATE TABLE IF NOT EXISTS compound (
			id SERIAL PRIMARY KEY,
			inchi TEXT NOT NULL,
			formula TEXT NOT NULL,
			smiles TEXT NOT NULL,
			mass FLOAT NOT NULL,
			UNIQUE (inchi, formula, smiles, mass)
		);
		CREATE TABLE IF NOT EXISTS compound_name (
			name TEXT NOT NULL,
			compound_id INT NOT NULL REFERENCES compound(id) ON UPDATE CASCADE ON DELETE CASCADE,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (name, compound_id, massbank_id)		
		);
		CREATE TABLE IF NOT EXISTS compound_class (
			class TEXT NOT NULL,
			compound_id INT NOT NULL REFERENCES compound(id) ON UPDATE CASCADE ON DELETE CASCADE,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (class, compound_id, massbank_id)
		);
		CREATE TABLE IF NOT EXISTS compound_link (
			database TEXT NOT NULL,
			identifier TEXT NOT NULL,
			compound_id INT NOT NULL REFERENCES compound(id) ON UPDATE CASCADE ON DELETE CASCADE,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (database, identifier, compound_id, massbank_id)
		);

		-- acquisition
		CREATE TABLE IF NOT EXISTS acquisition_instrument (
			id SERIAL PRIMARY KEY,
			instrument TEXT NOT NULL,
			instrument_type TEXT NOT NULL,
			UNIQUE (instrument, instrument_type)
		);
		CREATE TABLE IF NOT EXISTS accession_acquisition (
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			acquisition_instrument_id INT NOT NULL REFERENCES acquisition_instrument(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE IF NOT EXISTS acquisition_mass_spectrometry (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE IF NOT EXISTS acquisition_chromatography (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE IF NOT EXISTS acquisition_general (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE
		);

		-- mass spectrometry
		CREATE TABLE IF NOT EXISTS mass_spectrometry_focused_ion (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (subtag, value, massbank_id)
		);
		CREATE TABLE IF NOT EXISTS mass_spectrometry_data_processing (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (subtag, value, massbank_id)
		);

		-- spectrum (peak)
		CREATE TABLE IF NOT EXISTS spectrum (
			id SERIAL PRIMARY KEY,
			splash TEXT NOT NULL,
			num_peak INT NOT NULL,			
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE IF NOT EXISTS peak (
			mz FLOAT NOT NULL,
			intensity FLOAT NOT NULL,
			relative_intensity FLOAT NOT NULL,	
			spectrum_id INT NOT NULL REFERENCES spectrum(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE IF NOT EXISTS peak_annotation (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			spectrum_id INT NOT NULL REFERENCES spectrum(id) ON UPDATE CASCADE ON DELETE CASCADE
		);

		

		-- project
		-- CREATE TABLE IF NOT EXISTS project (
		-- 	id SERIAL PRIMARY KEY,
		-- 	name TEXT NOT NULL UNIQUE
		-- );
		-- CREATE TABLE IF NOT EXISTS accession_project (
		-- 	massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
		-- 	project_id INT NOT NULL REFERENCES project(id) ON UPDATE CASCADE ON DELETE CASCADE,
		-- 	UNIQUE (massbank_id, project_id)
		-- );
		
		-- species (sample)

		`;
	
	if _, err = p.database.Exec(query); err != nil {
		return err
	}
	return nil
}

func (p *PostgresSQLDB) checkDatabase() error {
	if p.database == nil {
		return errors.New("database not ready")
	}
	return p.database.Ping()
}

func (p *PostgresSQLDB) GetSmiles(accession *string) (*string, error) {
	var result string
	var b []byte
	if err := p.database.QueryRow("SELECT document->'compound'->>'smiles' FROM massbank WHERE document->>'accession' = $1", *accession).Scan(&b); err != nil {
		return nil, err
	}
	println(dd.Dump(b))
	result = string(b)
	return &result, nil
}

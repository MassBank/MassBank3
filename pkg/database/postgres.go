package database

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/MassBank/MassBank3/pkg/massbank"
	"github.com/lib/pq"
)

type Index struct {
	IndexName string
	TableName string
	Columns   []string
}

func (db *PostgresSQLDB) GetIndexes() []Index {
	var indexes = []Index{}
	indexes = append(indexes, Index{IndexName: "metadata_id_index", TableName: "metadata", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "metadata_commit_index", TableName: "metadata", Columns: []string{"commit"}})
	indexes = append(indexes, Index{IndexName: "metadata_timestamp_index", TableName: "metadata", Columns: []string{"timestamp"}})
	indexes = append(indexes, Index{IndexName: "metadata_version_index", TableName: "metadata", Columns: []string{"version"}})

	indexes = append(indexes, Index{IndexName: "massbank_id_index", TableName: "massbank", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "massbank_accession_index", TableName: "massbank", Columns: []string{"accession"}})
	indexes = append(indexes, Index{IndexName: "massbank_title_index", TableName: "massbank", Columns: []string{"title"}})

	indexes = append(indexes, Index{IndexName: "contributor_id_index", TableName: "contributor", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "contributor_name_index", TableName: "contributor", Columns: []string{"name"}})

	indexes = append(indexes, Index{IndexName: "author_id_index", TableName: "author", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "author_name_index", TableName: "author", Columns: []string{"name"}})

	indexes = append(indexes, Index{IndexName: "accession_author_massbank_id_index", TableName: "accession_author", Columns: []string{"massbank_id"}})
	indexes = append(indexes, Index{IndexName: "accession_author_author_id_index", TableName: "accession_author", Columns: []string{"author_id"}})

	indexes = append(indexes, Index{IndexName: "license_id_index", TableName: "license", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "license_name_index", TableName: "license", Columns: []string{"name"}})

	indexes = append(indexes, Index{IndexName: "publication_id_index", TableName: "publication", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "publication_name_index", TableName: "publication", Columns: []string{"name"}})

	indexes = append(indexes, Index{IndexName: "accession_publication_massbank_id_index", TableName: "accession_publication", Columns: []string{"massbank_id"}})
	indexes = append(indexes, Index{IndexName: "accession_publication_publication_id_index", TableName: "accession_publication", Columns: []string{"publication_id"}})

	indexes = append(indexes, Index{IndexName: "compound_id_index", TableName: "compound", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "compound_inchi_index", TableName: "compound", Columns: []string{"inchi"}})
	indexes = append(indexes, Index{IndexName: "compound_formula_index", TableName: "compound", Columns: []string{"formula"}})
	indexes = append(indexes, Index{IndexName: "compound_smiles_index", TableName: "compound", Columns: []string{"smiles"}})
	indexes = append(indexes, Index{IndexName: "compound_mass_index", TableName: "compound", Columns: []string{"mass"}})

	indexes = append(indexes, Index{IndexName: "compound_name_name_index", TableName: "compound_name", Columns: []string{"name"}})
	indexes = append(indexes, Index{IndexName: "compound_name_compound_id_index", TableName: "compound_name", Columns: []string{"compound_id"}})
	indexes = append(indexes, Index{IndexName: "compound_name_massbank_id_index", TableName: "compound_name", Columns: []string{"massbank_id"}})

	indexes = append(indexes, Index{IndexName: "compound_class_class_index", TableName: "compound_class", Columns: []string{"class"}})
	indexes = append(indexes, Index{IndexName: "compound_class_compound_id_index", TableName: "compound_class", Columns: []string{"compound_id"}})
	indexes = append(indexes, Index{IndexName: "compound_class_massbank_id_index", TableName: "compound_class", Columns: []string{"massbank_id"}})

	indexes = append(indexes, Index{IndexName: "compound_link_database_index", TableName: "compound_link", Columns: []string{"database"}})
	indexes = append(indexes, Index{IndexName: "compound_link_identifier_index", TableName: "compound_link", Columns: []string{"identifier"}})
	indexes = append(indexes, Index{IndexName: "compound_link_compound_id_index", TableName: "compound_link", Columns: []string{"compound_id"}})
	indexes = append(indexes, Index{IndexName: "compound_link_massbank_id_index", TableName: "compound_link", Columns: []string{"massbank_id"}})

	indexes = append(indexes, Index{IndexName: "acquisition_instrument_id_index", TableName: "acquisition_instrument", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "acquisition_instrument_instrument_index", TableName: "acquisition_instrument", Columns: []string{"instrument"}})
	indexes = append(indexes, Index{IndexName: "acquisition_instrument_instrument_type_index", TableName: "acquisition_instrument", Columns: []string{"instrument_type"}})

	indexes = append(indexes, Index{IndexName: "accession_acquisition_massbank_id_index", TableName: "accession_acquisition", Columns: []string{"massbank_id"}})
	indexes = append(indexes, Index{IndexName: "accession_acquisition_acquisition_instrument_id_index", TableName: "accession_acquisition", Columns: []string{"acquisition_instrument_id"}})

	indexes = append(indexes, Index{IndexName: "acquisition_mass_spectrometry_massbank_id_index", TableName: "acquisition_mass_spectrometry", Columns: []string{"massbank_id"}})
	indexes = append(indexes, Index{IndexName: "acquisition_chromatography_massbank_id_index", TableName: "acquisition_chromatography", Columns: []string{"massbank_id"}})
	indexes = append(indexes, Index{IndexName: "acquisition_general_massbank_id_index", TableName: "acquisition_general", Columns: []string{"massbank_id"}})

	indexes = append(indexes, Index{IndexName: "mass_spectrometry_focused_ion_massbank_id_index", TableName: "mass_spectrometry_focused_ion", Columns: []string{"massbank_id"}})
	indexes = append(indexes, Index{IndexName: "mass_spectrometry_data_processing_massbank_id_index", TableName: "mass_spectrometry_data_processing", Columns: []string{"massbank_id"}})

	indexes = append(indexes, Index{IndexName: "spectrum_id_index", TableName: "spectrum", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "spectrum_splash_index", TableName: "spectrum", Columns: []string{"splash"}})
	indexes = append(indexes, Index{IndexName: "spectrum_num_peak_index", TableName: "spectrum", Columns: []string{"num_peak"}})
	indexes = append(indexes, Index{IndexName: "spectrum_massbank_id_index", TableName: "spectrum", Columns: []string{"massbank_id"}})

	indexes = append(indexes, Index{IndexName: "peak_id_index", TableName: "peak", Columns: []string{"id"}})
	indexes = append(indexes, Index{IndexName: "peak_mz_index", TableName: "peak", Columns: []string{"mz"}})
	indexes = append(indexes, Index{IndexName: "peak_intensity_index", TableName: "peak", Columns: []string{"intensity"}})
	indexes = append(indexes, Index{IndexName: "peak_relative_intensity_index", TableName: "peak", Columns: []string{"relative_intensity"}})
	indexes = append(indexes, Index{IndexName: "peak_spectrum_id_index", TableName: "peak", Columns: []string{"spectrum_id"}})

	indexes = append(indexes, Index{IndexName: "peak_annotation_spectrum_id_index", TableName: "peak_annotation", Columns: []string{"spectrum_id"}})

	indexes = append(indexes, Index{IndexName: "browse_options_massbank_id_index", TableName: "browse_options", Columns: []string{"massbank_id"}})
	indexes = append(indexes, Index{IndexName: "browse_options_accession_index", TableName: "browse_options", Columns: []string{"accession"}})
	indexes = append(indexes, Index{IndexName: "browse_options_contributor_index", TableName: "browse_options", Columns: []string{"contributor"}})
	indexes = append(indexes, Index{IndexName: "browse_options_instrument_type_index", TableName: "browse_options", Columns: []string{"instrument_type"}})
	indexes = append(indexes, Index{IndexName: "browse_options_ms_type_index", TableName: "browse_options", Columns: []string{"ms_type"}})
	indexes = append(indexes, Index{IndexName: "browse_options_ion_mode_index", TableName: "browse_options", Columns: []string{"ion_mode"}})
	indexes = append(indexes, Index{IndexName: "browse_options_smiles_index", TableName: "browse_options", Columns: []string{"smiles"}})
	indexes = append(indexes, Index{IndexName: "browse_options_inchi_index", TableName: "browse_options", Columns: []string{"inchi"}})
	indexes = append(indexes, Index{IndexName: "browse_options_inchikey_index", TableName: "browse_options", Columns: []string{"inchikey"}})
	indexes = append(indexes, Index{IndexName: "browse_options_splash_index", TableName: "browse_options", Columns: []string{"splash"}})
	indexes = append(indexes, Index{IndexName: "browse_options_formula_index", TableName: "browse_options", Columns: []string{"formula"}})
	indexes = append(indexes, Index{IndexName: "browse_options_mass_index", TableName: "browse_options", Columns: []string{"mass"}})
	indexes = append(indexes, Index{IndexName: "browse_options_atomcount_index", TableName: "browse_options", Columns: []string{"atomcount"}})

	indexes = append(indexes, Index{IndexName: "peak_differences_spectrum_id_index", TableName: "peak_differences", Columns: []string{"spectrum_id"}})
	indexes = append(indexes, Index{IndexName: "peak_differences_peak_id_index", TableName: "peak_differences", Columns: []string{"peak_id"}})
	indexes = append(indexes, Index{IndexName: "peak_differences_precursor_mass_id_index", TableName: "peak_differences", Columns: []string{"precursor_mass"}})
	indexes = append(indexes, Index{IndexName: "peak_differences_difference_index", TableName: "peak_differences", Columns: []string{"difference"}})
	indexes = append(indexes, Index{IndexName: "peak_differences_rel_intensity_index", TableName: "peak_differences", Columns: []string{"rel_intensity"}})

	indexes = append(indexes, Index{IndexName: "records_massbank_id_index", TableName: "records", Columns: []string{"massbank_id"}})
	indexes = append(indexes, Index{IndexName: "records_accession_index", TableName: "records", Columns: []string{"accession"}})

	return indexes
}

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
	return nil
}

func (p *PostgresSQLDB) Ping() error {
	if err := p.checkDatabase(); err != nil {
		return err
	}
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
	err := p.database.QueryRow("SELECT COUNT(id) FROM massbank;").Scan(&count)
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
	count, err := db.Count()
	if err != nil {
		return false, err
	}
	return count == 0, nil
}

func (p *PostgresSQLDB) GetMetadata() (*massbank.MbMetaData, error) {

	result := &massbank.MbMetaData{}

	// number of unique compounds
	var query = "SELECT commit, timestamp, version FROM metadata;"
	stmt, err := p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	var commit string
	var timestamp string
	var version string
	err = stmt.QueryRow().Scan(
		&commit,
		&timestamp,
		&version,
	)
	stmt.Close()
	if err != nil {
		return nil, err
	}

	// number of unique spectra
	query = "SELECT COUNT(DISTINCT(splash)) FROM spectrum;"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	var spectraCount uint
	err = stmt.QueryRow().Scan(
		&spectraCount,
	)
	stmt.Close()
	if err != nil {
		return nil, err
	}

	// number of unique compounds
	query = "SELECT COUNT(DISTINCT(inchi)) FROM compound WHERE inchi != 'N/A';"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	var compoundCount uint
	err = stmt.QueryRow().Scan(
		&compoundCount,
	)
	stmt.Close()
	if err != nil {
		return nil, err
	}

	result.Version = version
	result.Timestamp = timestamp
	result.GitCommit = commit
	result.SpectraCount = spectraCount
	result.CompoundCount = compoundCount

	// compound classes (free text)
	query = "SELECT class, COUNT(class) as count FROM compound_class GROUP BY class ORDER BY class;"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	rows, err := stmt.Query()
	stmt.Close()
	if err == nil {
		result.CompoundClass = []string{}
		result.CompoundClassCount = []uint{}
		for rows.Next() {
			var class string
			var count uint
			if err := rows.Scan(&class, &count); err != nil {
				return nil, err
			}
			result.CompoundClass = append(result.CompoundClass, class)
			result.CompoundClassCount = append(result.CompoundClassCount, count)
		}
		rows.Close()
	} else {
		if err != sql.ErrNoRows {
			return nil, err
		}
	}

	// compound classes (ClassyFire)
	query = "SELECT identifier, COUNT(identifier) as count FROM compound_link WHERE database = 'ChemOnt' GROUP BY identifier ORDER BY count DESC;"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	rows, err = stmt.Query()
	stmt.Close()
	if err == nil {
		result.CompoundClassChemOnt = []string{}
		result.CompoundClassCountChemOnt = []uint{}
		for rows.Next() {
			var class string
			var count uint
			if err := rows.Scan(&class, &count); err != nil {
				return nil, err
			}
			result.CompoundClassChemOnt = append(result.CompoundClassChemOnt, class)
			result.CompoundClassCountChemOnt = append(result.CompoundClassCountChemOnt, count)
		}
		rows.Close()
	} else {
		if err != sql.ErrNoRows {
			return nil, err
		}
	}

	return result, nil
}

func (p *PostgresSQLDB) GetVersion() (string, error) {
	var version string
	query := "SELECT version();"
	stmt, err := p.database.Prepare(query)
	if err != nil {
		return "", err
	}
	err = stmt.QueryRow().Scan(&version)
	stmt.Close()
	if err != nil {
		return "", err
	}
	return version, nil
}

func (p *PostgresSQLDB) GetRecords(s *[]string) (*[]string, error) {

	var query = "SELECT record_text FROM records WHERE accession = ANY ($1);"
	stmt, err := p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	var recordStrings = []string{}
	rows, err := stmt.Query(pq.Array(s))
	stmt.Close()
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var record string
		if err := rows.Scan(&record); err != nil {
			return nil, err
		}
		recordStrings = append(recordStrings, record)
	}

	return &recordStrings, nil
}

// GetRecord see [MB3Database.GetRecord]
func (p *PostgresSQLDB) GetRecord(s *string) (*massbank.MassBank2, error) {

	var result = massbank.MassBank2{}

	var massbankId uint
	var filename string
	var accession string
	var title string
	var comments []string
	var copyright sql.NullString
	var date time.Time
	var metadataId uint
	var query = "SELECT * FROM massbank WHERE accession = $1;"
	stmt, err := p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	err = stmt.QueryRow(*s).Scan(
		&massbankId,
		&filename,
		&accession,
		&title,
		(*pq.StringArray)(&comments),
		&copyright,
		&date,
		&metadataId,
	)
	stmt.Close()
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
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	err = stmt.QueryRow(massbankId).Scan(&contributor)
	stmt.Close()
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	result.Contributor = &contributor

	// authors
	query = "SELECT name FROM author WHERE id IN (SELECT author_id FROM accession_author WHERE massbank_id = $1);"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	rows, err := stmt.Query(massbankId)
	stmt.Close()
	if err == nil {
		result.Authors = &[]massbank.RecordAuthorName{}
		for rows.Next() {
			var author string
			if err := rows.Scan(&author); err != nil {
				return nil, err
			}
			*result.Authors = append(*result.Authors, massbank.RecordAuthorName{Name: author})
		}
		rows.Close()
	} else {
		if err != sql.ErrNoRows {
			return nil, err
		}
	}

	// license
	query = "SELECT name FROM license WHERE id IN (SELECT license_id FROM accession_license WHERE massbank_id = $1);"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	var license string
	err = stmt.QueryRow(massbankId).Scan(&license)
	stmt.Close()
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	result.License = &license

	// publication (for now only one publication per record)
	query = "SELECT name FROM publication WHERE id IN (SELECT publication_id FROM accession_publication WHERE massbank_id = $1);"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	var publication string
	err = stmt.QueryRow(massbankId).Scan(&publication)
	stmt.Close()
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	result.Publication = &publication

	// compound
	query = "SELECT inchi, formula, smiles, mass FROM compound WHERE id IN (SELECT compound_id FROM compound_name WHERE massbank_id = $1);"
	stmt, err = p.database.Prepare(query)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	var inchi string
	var formula string
	var smiles string
	var mass float64
	err = stmt.QueryRow(massbankId).Scan(&inchi, &formula, &smiles, &mass)
	stmt.Close()
	if err == nil {
		result.Compound = massbank.CompoundProperties{
			InChI:   &inchi,
			Formula: &formula,
			Smiles:  &smiles,
			Mass:    &mass,
		}
		// compound names
		result.Compound.Names = &[]string{}
		query = "SELECT name FROM compound_name WHERE massbank_id = $1;"
		stmt, err = p.database.Prepare(query)
		if err != nil {
			return nil, err
		}
		rows, err = stmt.Query(massbankId)
		stmt.Close()
		if err == nil {
			for rows.Next() {
				var name string
				if err := rows.Scan(&name); err != nil {
					return nil, err
				}
				*result.Compound.Names = append(*result.Compound.Names, name)
			}
			rows.Close()
		} else {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}

		// compound classes
		result.Compound.Classes = &[]string{}
		query = "SELECT class FROM compound_class WHERE massbank_id = $1;"
		stmt, err = p.database.Prepare(query)
		if err != nil {
			return nil, err
		}
		rows, err = stmt.Query(massbankId)
		stmt.Close()
		if err == nil {
			for rows.Next() {
				var class string
				if err := rows.Scan(&class); err != nil {
					return nil, err
				}
				*result.Compound.Classes = append(*result.Compound.Classes, class)
			}
			rows.Close()
		} else {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}

		// compound link
		result.Compound.Link = &[]massbank.DatabaseProperty{}
		query = "SELECT database, identifier FROM compound_link WHERE massbank_id = $1;"
		stmt, err = p.database.Prepare(query)
		if err != nil {
			return nil, err
		}
		rows, err = stmt.Query(massbankId)
		stmt.Close()
		if err == nil {
			for rows.Next() {
				var database string
				var identifier string
				if err := rows.Scan(&database, &identifier); err != nil {
					return nil, err
				}
				*result.Compound.Link = append(*result.Compound.Link, massbank.DatabaseProperty{Database: database, Identifier: identifier})
			}
			rows.Close()
		} else {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}
	} else {
		if err != sql.ErrNoRows {
			return nil, err
		}
	}

	// acquisition
	query = "SELECT instrument, instrument_type FROM acquisition_instrument WHERE id IN (SELECT acquisition_instrument_id FROM accession_acquisition WHERE massbank_id = $1);"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	var instrument string
	var instrumentType string
	err = stmt.QueryRow(massbankId).Scan(&instrument, &instrumentType)
	stmt.Close()
	if err == nil {
		result.Acquisition = massbank.AcquisitionProperties{
			Instrument:     &instrument,
			InstrumentType: &instrumentType,
		}
		// acquisition mass spectrometry
		result.Acquisition.MassSpectrometry = &[]massbank.SubtagProperty{}
		query = "SELECT subtag, value FROM acquisition_mass_spectrometry WHERE massbank_id = $1;"
		stmt, err = p.database.Prepare(query)
		if err != nil {
			return nil, err
		}
		rows, err = stmt.Query(massbankId)
		stmt.Close()
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
			rows.Close()
		} else {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}
		// acquisition chromatography
		result.Acquisition.Chromatography = &[]massbank.SubtagProperty{}
		query = "SELECT subtag, value FROM acquisition_chromatography WHERE massbank_id = $1;"
		stmt, err = p.database.Prepare(query)
		if err != nil {
			return nil, err
		}
		rows, err = stmt.Query(massbankId)
		stmt.Close()
		if err == nil {
			for rows.Next() {
				var subtag string
				var value string
				if err := rows.Scan(&subtag, &value); err != nil {
					return nil, err
				}
				*result.Acquisition.Chromatography = append(*result.Acquisition.Chromatography, massbank.SubtagProperty{Subtag: subtag, Value: value})
			}
			rows.Close()
		} else {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}

		// acquisition general
		result.Acquisition.General = &[]massbank.SubtagProperty{}
		query = "SELECT subtag, value FROM acquisition_general WHERE massbank_id = $1;"
		stmt, err = p.database.Prepare(query)
		if err != nil {
			return nil, err
		}
		rows, err = stmt.Query(massbankId)
		stmt.Close()
		if err == nil {
			for rows.Next() {
				var subtag string
				var value string
				if err := rows.Scan(&subtag, &value); err != nil {
					return nil, err
				}
				*result.Acquisition.General = append(*result.Acquisition.General, massbank.SubtagProperty{Subtag: subtag, Value: value})
			}
			rows.Close()
		} else {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}
	} else {
		if err != sql.ErrNoRows {
			return nil, err
		}
	}

	// mass spectrometry
	query = "SELECT subtag, value FROM mass_spectrometry_focused_ion WHERE massbank_id = $1;"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	result.MassSpectrometry = massbank.MassSpecProperties{}
	rows, err = stmt.Query(massbankId)
	stmt.Close()
	if err == nil {
		result.MassSpectrometry.FocusedIon = &[]massbank.SubtagProperty{}
		for rows.Next() {
			var subtag string
			var value string
			if err := rows.Scan(&subtag, &value); err != nil {
				return nil, err
			}

			*result.MassSpectrometry.FocusedIon = append(*result.MassSpectrometry.FocusedIon, massbank.SubtagProperty{Subtag: subtag, Value: value})
		}
		rows.Close()
	} else {
		if err != sql.ErrNoRows {
			return nil, err
		}
	}
	query = "SELECT subtag, value FROM mass_spectrometry_data_processing WHERE massbank_id = $1;"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	rows, err = stmt.Query(massbankId)
	stmt.Close()
	if err == nil {
		result.MassSpectrometry.DataProcessing = &[]massbank.SubtagProperty{}
		for rows.Next() {
			var subtag string
			var value string
			if err := rows.Scan(&subtag, &value); err != nil {
				return nil, err
			}

			*result.MassSpectrometry.DataProcessing = append(*result.MassSpectrometry.DataProcessing, massbank.SubtagProperty{Subtag: subtag, Value: value})
		}
		rows.Close()
	} else {
		if err != sql.ErrNoRows {
			return nil, err
		}
	}

	// peak
	result.Peak = massbank.PeakProperties{}
	var spectrumId uint
	var splash string
	var numPeak uint

	query = "SELECT id, splash, num_peak FROM spectrum WHERE massbank_id = $1;"
	stmt, err = p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	err = stmt.QueryRow(massbankId).Scan(&spectrumId, &splash, &numPeak)
	stmt.Close()
	if err == nil {
		result.Peak.Peak = &massbank.PkPeak{}

		result.Peak.Splash = &splash
		result.Peak.NumPeak = &numPeak

		query = "SELECT id, mz, intensity, relative_intensity FROM peak WHERE spectrum_id = $1;"
		stmt, err = p.database.Prepare(query)
		if err != nil {
			return nil, err
		}
		rows, err = stmt.Query(spectrumId)
		stmt.Close()
		if err == nil {
			result.Peak.Peak.Id = []int32{}
			result.Peak.Peak.Mz = []float64{}
			result.Peak.Peak.Intensity = []float64{}
			result.Peak.Peak.Rel = []int32{}
			for rows.Next() {
				var id int32
				var mz float64
				var intensity float64
				var rel int32
				if err := rows.Scan(&id, &mz, &intensity, &rel); err != nil {
					return nil, err
				}
				result.Peak.Peak.Id = append(result.Peak.Peak.Id, id)
				result.Peak.Peak.Mz = append(result.Peak.Peak.Mz, mz)
				result.Peak.Peak.Intensity = append(result.Peak.Peak.Intensity, intensity)
				result.Peak.Peak.Rel = append(result.Peak.Peak.Rel, rel)
			}
			rows.Close()
		} else {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}

		query = "SELECT subtag, value FROM peak_annotation WHERE spectrum_id = $1;"
		stmt, err = p.database.Prepare(query)
		if err != nil {
			return nil, err
		}
		rows, err = stmt.Query(spectrumId)
		stmt.Close()
		if err == nil {
			result.Peak.Annotation = &massbank.PkAnnotation{}
			result.Peak.Annotation.Header = []string{}
			result.Peak.Annotation.Values = map[string][]interface{}{}
			for rows.Next() {
				var subtag string
				var value string
				if err := rows.Scan(&subtag, &value); err != nil {
					return nil, err
				}
				if !slices.Contains(result.Peak.Annotation.Header, subtag) {
					result.Peak.Annotation.Header = append(result.Peak.Annotation.Header, subtag)
				}
				if _, ok := result.Peak.Annotation.Values[subtag]; !ok {
					result.Peak.Annotation.Values[subtag] = []interface{}{}
				}
				result.Peak.Annotation.Values[subtag] = append(result.Peak.Annotation.Values[subtag], value)
			}
			rows.Close()
		} else {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}
	} else {
		if err != sql.ErrNoRows {
			return nil, err
		}
	}

	return &result, err
}

// GetSimpleRecord see [MB3Database.GetSimpleRecord]
func (p *PostgresSQLDB) GetSimpleRecord(s *string) (*massbank.MassBank2, error) {
	var result = massbank.MassBank2{}

	var massbankId uint
	var accession string
	var title string
	var smiles string
	var peak_ids_vec []int32
	var mz_vec []float64
	var intensity_vec []float64
	var relative_intensity_vec []int32
	var formula string
	var mass float64
	var atomcount uint
	var query = "SELECT massbank_id, accession, title, smiles, peak_ids_vec, mz_vec, intensity_vec, relative_intensity_vec, formula, mass, atomcount FROM browse_options WHERE accession = $1;"
	stmt, err := p.database.Prepare(query)
	if err != nil {
		return nil, err
	}
	err = stmt.QueryRow(*s).Scan(
		&massbankId,
		&accession,
		&title,
		&smiles,
		(*pq.Int32Array)(&peak_ids_vec),
		(*pq.Float64Array)(&mz_vec),
		(*pq.Float64Array)(&intensity_vec),
		(*pq.Int32Array)(&relative_intensity_vec),
		&formula,
		&mass,
		&atomcount,
	)
	stmt.Close()
	if err != nil {
		return nil, err
	}

	result.RecordTitle = &title
	result.Accession = &accession
	result.Compound = massbank.CompoundProperties{
		Smiles:    &smiles,
		Formula:   &formula,
		AtomCount: &atomcount,
	}

	result.Peak = massbank.PeakProperties{}
	numPeak := uint(len(mz_vec))
	result.Peak.NumPeak = &numPeak
	result.Peak.Peak = &massbank.PkPeak{
		Mz:        mz_vec,
		Intensity: intensity_vec,
		Rel:       relative_intensity_vec,
		Id:        peak_ids_vec,
	}
	result.Compound.Mass = &mass

	return &result, err
}

func (p *PostgresSQLDB) GetAccessionsBySubstructure(substructure string) ([]string, []int32, error) {
	accessions := []string{}
	atomcounts := []int32{}
	query := "SELECT accession, atomcount FROM molecules WHERE molecule @($1, '')::bingo.sub"
	stmt, err := p.database.Prepare(query)
	if err != nil {
		return nil, nil, err
	}
	defer stmt.Close()

	rows, err := stmt.Query(substructure)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var accession string
		var atomcount int32
		if err := rows.Scan(&accession, &atomcount); err != nil {
			return nil, nil, err
		}
		accessions = append(accessions, accession)
		atomcounts = append(atomcounts, atomcount)
	}
	stmt.Close()

	return accessions, atomcounts, nil
}

// GetRecordsBySubstructure see [MB3Database.GetRecordsBySubstructure]
func (p *PostgresSQLDB) GetRecordsBySubstructure(substructure string) (*[]massbank.MassBank2, error) {
	records := []massbank.MassBank2{}
	accessions, _, err := p.GetAccessionsBySubstructure(substructure)
	if err != nil {
		return nil, err
	}
	for _, accession := range accessions {
		record, err := p.GetSimpleRecord(&accession)
		if err != nil {
			return nil, err
		}
		records = append(records, *record)
	}

	return &records, nil
}

// GetSearchResults see [MB3Database.GetSearchResults]
func (p *PostgresSQLDB) GetSearchResults(filters Filters) (*[]string, *[]int32, error) {
	if filters.MassEpsilon == nil {
		filters.MassEpsilon = &DefaultValues.MassEpsilon
	}
	if filters.Intensity == nil {
		filters.Intensity = &DefaultValues.Intensity
	}

	accessions, atomcounts, err := p.GetAccessionsByFilterOptions(filters)
	if err != nil {
		return nil, nil, err
	}

	return &accessions, &atomcounts, nil
}

// BuildSearchOptionsWhere to build the where clause within the browse_options table
func (p *PostgresSQLDB) BuildBrowseOptionsWhere(filters Filters) (string, []string) {
	var query = ""
	addedWhere := false
	addedAnd := false

	parameters := []string{}

	if filters.Contributor != nil {
		var placeholder []string
		for _, contributor := range *filters.Contributor {
			parameters = append(parameters, contributor)
			placeholder = append(placeholder, "$"+strconv.Itoa(len(parameters)))
		}
		query = query + " WHERE contributor IN (" + strings.Join(placeholder, ",") + ")"
		addedWhere = true
	}
	if filters.InstrumentType != nil {
		var placeholder []string
		for _, it := range *filters.InstrumentType {
			parameters = append(parameters, it)
			placeholder = append(placeholder, "$"+strconv.Itoa(len(parameters)))
		}
		subQuery := "instrument_type IN (" + strings.Join(placeholder, ",") + ")"
		if addedWhere {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.MsType != nil {
		var placeholder []string
		for _, ms := range *filters.MsType {
			parameters = append(parameters, ms.String())
			placeholder = append(placeholder, "$"+strconv.Itoa(len(parameters)))
		}
		subQuery := "ms_type IN (" + strings.Join(placeholder, ",") + ")"
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.IonMode != massbank.ANY {
		parameters = append(parameters, string(filters.IonMode))
		subQuery := "ion_mode = $" + strconv.Itoa(len(parameters))
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.Inchi != "" {
		parameters = append(parameters, filters.Inchi)
		subQuery := "inchi = $" + strconv.Itoa(len(parameters))
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.InchiKey != "" {
		parameters = append(parameters, filters.InchiKey)
		subQuery := "LOWER(inchikey) LIKE LOWER(CONCAT($" + strconv.Itoa(len(parameters)) + "::text,'%%'))"
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.Splash != "" {
		parameters = append(parameters, filters.Splash)
		subQuery := "splash = $" + strconv.Itoa(len(parameters))
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.Formula != "" {
		parameters = append(parameters, filters.Formula)
		subQuery := "formula = $" + strconv.Itoa(len(parameters))
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.Mass != nil && filters.MassEpsilon != nil {
		parameters = append(parameters, strconv.FormatFloat(*filters.Mass, 'f', -1, 64))
		parameters = append(parameters, strconv.FormatFloat(*filters.MassEpsilon, 'f', -1, 64))
		subQuery := "ABS(mass - $" + strconv.Itoa(len(parameters)-1) + ") <= $" + strconv.Itoa(len(parameters))
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.CompoundName != "" {
		parameters = append(parameters, filters.CompoundName)
		subQuery := "massbank_id IN (SELECT DISTINCT(massbank_id) FROM compound_name WHERE LOWER(name) LIKE LOWER(CONCAT('%%',$" + strconv.Itoa(len(parameters)) + "::text,'%%')))"
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.CompoundClass != "" {
		parameters = append(parameters, filters.CompoundClass)
		subQuery := "massbank_id IN (SELECT DISTINCT(massbank_id) FROM compound_class WHERE LOWER(class) LIKE LOWER(CONCAT('%%',$" + strconv.Itoa(len(parameters)) + "::text,'%%')) OR massbank_id IN (SELECT DISTINCT(massbank_id) FROM compound_link WHERE database = 'ChemOnt' AND LOWER(identifier) LIKE LOWER(CONCAT('%%',$" + strconv.Itoa(len(parameters)) + "::text,'%%'))))"
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	if filters.Peaks != nil && len(*filters.Peaks) > 0 && filters.MassEpsilon != nil {
		peaksCount := len(*filters.Peaks)
		var from = "FROM "
		var where = "WHERE "
		if peaksCount == 1 {
			parameters = append(parameters, strconv.FormatFloat((*filters.Peaks)[0]-*filters.MassEpsilon, 'f', -1, 64))
			parameters = append(parameters, strconv.FormatFloat((*filters.Peaks)[0]+*filters.MassEpsilon, 'f', -1, 64))
			from = from + "peak AS p1"
			where = where + "p1.mz BETWEEN $" + strconv.Itoa(len(parameters)-1) + " AND $" + strconv.Itoa(len(parameters))
			if filters.Intensity != nil {
				parameters = append(parameters, strconv.FormatInt(*filters.Intensity, 10))
				where = where + " AND p1.relative_intensity >= $" + strconv.Itoa(len(parameters))
			}
		} else {
			for i := 0; i < peaksCount; i++ {
				parameters = append(parameters, strconv.FormatFloat((*filters.Peaks)[i]-*filters.MassEpsilon, 'f', -1, 64))
				parameters = append(parameters, strconv.FormatFloat((*filters.Peaks)[i]+*filters.MassEpsilon, 'f', -1, 64))
				from = from + "peak AS p" + strconv.Itoa(i+1)
				if i < peaksCount-1 {
					from = from + ", "
				}
				if i == 0 {
					where = where + "p1.mz BETWEEN $" + strconv.Itoa(len(parameters)-1) + " AND $" + strconv.Itoa(len(parameters))
				} else {
					where = where + "p" + strconv.Itoa(i+1) + ".spectrum_id=p1.spectrum_id AND p" + strconv.Itoa(i+1) + ".mz BETWEEN $" + strconv.Itoa(len(parameters)-1) + " AND $" + strconv.Itoa(len(parameters))
				}
				if filters.Intensity != nil {
					parameters = append(parameters, strconv.FormatInt(*filters.Intensity, 10))
					where = where + " AND p" + strconv.Itoa(i+1) + ".relative_intensity >= $" + strconv.Itoa(len(parameters))
				}
				if i < peaksCount-1 {
					where = where + " AND "
				}
			}
		}
		subQuery := "massbank_id IN (SELECT massbank_id FROM spectrum WHERE id IN (SELECT DISTINCT(p1.spectrum_id) " + from + " " + where + "))"
		if addedWhere || addedAnd {
			query = query + " AND " + subQuery
			addedAnd = true
		} else {
			query = query + " WHERE " + subQuery
			addedWhere = true
		}
	}

	return query, parameters
}

func (p *PostgresSQLDB) NeutralLossSearch(neutralLoss *[]float64, tolerance *float64, minRelIntensity *int64) ([]string, []int32, map[string][]string, error) {
	var accessions = []string{}
	var atomcounts = []int32{}
	var peakPairs = map[string][]string{}

	if neutralLoss != nil && len(*neutralLoss) > 0 && tolerance != nil {
		neutralLossesCount := len(*neutralLoss)
		parameters := []string{}
		var query string

		var from = "FROM "
		var with = "WITH "
		from = from + "t1"
		for i := 0; i < neutralLossesCount; i++ {
			parameters = append(parameters, strconv.FormatFloat((*neutralLoss)[i]-*tolerance, 'f', -1, 64))
			parameters = append(parameters, strconv.FormatFloat((*neutralLoss)[i]+*tolerance, 'f', -1, 64))
			with = with + "t" + strconv.Itoa(i+1) + " AS (SELECT spectrum_id, array_agg(ARRAY[peak_id, precursor_mass]) AS agg FROM peak_differences WHERE difference BETWEEN $" + strconv.Itoa(len(parameters)-1) + " AND $" + strconv.Itoa(len(parameters))
			if minRelIntensity != nil {
				parameters = append(parameters, strconv.FormatInt(*minRelIntensity, 10))
				with = with + " AND rel_intensity >= $" + strconv.Itoa(len(parameters))
			}
			with = with + " GROUP BY spectrum_id)"
			if i > 0 {
				from = from + " JOIN " + "t" + strconv.Itoa(i+1) + " ON t" + strconv.Itoa(i+1) + ".spectrum_id=t" + strconv.Itoa(i) + ".spectrum_id"
			}
			if i < neutralLossesCount-1 {
				with = with + ", "
			}
		}
		var selectAggregations = "array_to_json(t1.agg"
		for i := 1; i < neutralLossesCount; i++ {
			selectAggregations = selectAggregations + "|| t" + strconv.Itoa(i+1) + ".agg"
		}
		selectAggregations = selectAggregations + ")::json"

		query = with + " SELECT " + selectAggregations + ", browse_options.accession, browse_options.atomcount " + from + " JOIN spectrum ON spectrum.id = t1.spectrum_id JOIN browse_options ON browse_options.massbank_id = spectrum.massbank_id;"

		stmt, err := p.database.Prepare(query)
		if err != nil {
			return nil, nil, nil, err
		}
		defer stmt.Close()

		args := make([]any, len(parameters))
		for i, v := range parameters {
			args[i] = v
		}
		rows, err := stmt.Query(args...)
		if err != nil {
			return nil, nil, nil, err
		}
		defer rows.Close()

		for rows.Next() {
			var peakPairAggregation string
			var accession string
			var atomcount int32
			if err := rows.Scan(&peakPairAggregation, &accession, &atomcount); err != nil {
				return nil, nil, nil, err
			}
			accessions = append(accessions, accession)
			atomcounts = append(atomcounts, atomcount)
			peakPairAggregation = strings.Replace(peakPairAggregation, "[[", "", -1)
			peakPairAggregation = strings.Replace(peakPairAggregation, "]]", "", -1)
			peakPairAggregation = strings.Replace(peakPairAggregation, "],[", ",", -1)
			peakPairAggregation = strings.Replace(peakPairAggregation, "[", "", -1)
			peakPairAggregation = strings.Replace(peakPairAggregation, "]", "", -1)
			split := strings.Split(peakPairAggregation, ",")
			peakPairs[accession] = []string{}
			var pair string
			for i, item := range split {
				if i%2 == 0 {
					pair = item
				} else {
					pair = pair + "_" + item
					peakPairs[accession] = append(peakPairs[accession], pair)
				}
			}
		}
	}

	return accessions, atomcounts, peakPairs, nil
}

func (p *PostgresSQLDB) GetAccessionsByFilterOptions(filters Filters) ([]string, []int32, error) {
	var accessions = []string{}
	var atomcounts = []int32{}
	query := "SELECT accession, atomcount FROM browse_options"
	subQuery, parameters := p.BuildBrowseOptionsWhere(filters)
	query = query + subQuery
	if filters.Mass != nil && filters.MassEpsilon != nil {
		parameters = append(parameters, strconv.FormatFloat(*filters.Mass, 'f', -1, 64))
		query = query + " ORDER BY ABS(mass - $" + strconv.Itoa(len(parameters)) + ");"
	} else {
		query = query + " ORDER BY contributor, accession;"
	}

	fmt.Println("GetAccessionsByFilterOptions -> query: ", query)
	fmt.Println(" -> parameters: ", parameters)

	stmt, err := p.database.Prepare(query)
	if err != nil {
		return nil, nil, err
	}
	defer stmt.Close()

	args := make([]any, len(parameters))
	for i, v := range parameters {
		args[i] = v
	}
	rows, err := stmt.Query(args...)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var accession string
		var atomcount int32
		if err := rows.Scan(&accession, &atomcount); err != nil {
			return nil, nil, err
		}
		accessions = append(accessions, accession)
		atomcounts = append(atomcounts, atomcount)
	}

	return accessions, atomcounts, nil
}

func (p *PostgresSQLDB) GetContributors() ([]string, error) {
	var contributors = []string{}
	query := "SELECT name FROM contributor;"
	rows, err := p.database.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var contributor string
		if err := rows.Scan(&contributor); err != nil {
			return nil, err
		}
		contributors = append(contributors, contributor)
	}

	return contributors, nil
}

func (p *PostgresSQLDB) GetInstrumentTypes() ([]string, error) {
	var instrumentTypes = []string{}
	query := "SELECT DISTINCT(instrument_type) FROM acquisition_instrument ORDER BY instrument_type;"
	rows, err := p.database.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var instrumentType string
		if err := rows.Scan(&instrumentType); err != nil {
			return nil, err
		}
		instrumentTypes = append(instrumentTypes, instrumentType)
	}

	return instrumentTypes, nil
}

type MSTypeAndIonMode struct {
	MSType  []string
	IonMode []string
}

func (p *PostgresSQLDB) GetMsTypeAndIonMode() (*MSTypeAndIonMode, error) {
	var msTypeAndIonMode = MSTypeAndIonMode{}

	query := "SELECT DISTINCT(subtag), value FROM acquisition_mass_spectrometry WHERE subtag = 'MS_TYPE' OR subtag = 'ION_MODE' ORDER BY value;"
	rows, err := p.database.Query(query)
	if err != nil {
		return &MSTypeAndIonMode{}, err
	}
	defer rows.Close()

	for rows.Next() {
		var subtag string
		var value string
		if err := rows.Scan(&subtag, &value); err != nil {
			return &MSTypeAndIonMode{}, err
		}
		if subtag == "MS_TYPE" {
			msTypeAndIonMode.MSType = append(msTypeAndIonMode.MSType, value)
		} else {
			msTypeAndIonMode.IonMode = append(msTypeAndIonMode.IonMode, value)
		}
	}

	return &msTypeAndIonMode, nil
}

// GetUniqueValues see [MB3Database.GetUniqueValues]
func (p *PostgresSQLDB) GetUniqueValues(filters Filters) (MB3Values, error) {
	var val MB3Values = MB3Values{}
	var rows *sql.Rows
	var err error

	var contributors = []MBCountValues{}
	var instrumentTypes = []MBCountValues{}
	var msTypes = []MBCountValues{}
	var ionModes = []MBCountValues{}

	// contributor
	cont, err := p.GetContributors()
	if err != nil {
		return MB3Values{}, err
	}
	for _, c := range cont {
		contributors = append(contributors, MBCountValues{Val: c, Count: 0})
	}

	// intrument type
	it, err := p.GetInstrumentTypes()
	if err != nil {
		return MB3Values{}, err
	}
	for _, i := range it {
		instrumentTypes = append(instrumentTypes, MBCountValues{Val: i, Count: 0})
	}

	// ms type, ion mode
	msTypeAndIonMode, err := p.GetMsTypeAndIonMode()
	if err != nil {
		return MB3Values{}, err
	}
	for _, mt := range msTypeAndIonMode.MSType {
		msTypes = append(msTypes, MBCountValues{Val: mt, Count: 0})
	}
	for _, im := range msTypeAndIonMode.IonMode {
		ionModes = append(ionModes, MBCountValues{Val: im, Count: 0})
	}

	query := "SELECT contributor, instrument_type, ms_type, ion_mode, COUNT(contributor) FROM browse_options"
	subQuery, parameters := p.BuildBrowseOptionsWhere(filters)
	query = query + subQuery
	query = query + " GROUP BY contributor, instrument_type, ms_type, ion_mode;"

	fmt.Println("GetUniqueValues -> query: ", query)
	fmt.Println(" -> parameters: ", parameters)

	stmt, err := p.database.Prepare(query)
	if err != nil {
		return MB3Values{}, err
	}
	defer stmt.Close()

	args := make([]interface{}, len(parameters))
	for i, v := range parameters {
		args[i] = v
	}
	rows, err = stmt.Query(args...)
	if err != nil {
		return MB3Values{}, err
	}
	defer rows.Close()

	for rows.Next() {
		var contributor string
		var instrumentType string
		var msType string
		var ionMode string
		var count int
		if err := rows.Scan(&contributor, &instrumentType, &msType, &ionMode, &count); err != nil {
			return MB3Values{}, err
		}

		for i, contr := range contributors {
			if contributor == contr.Val {
				contributors[i].Count = contributors[i].Count + count
				break
			}
		}
		for i, it := range instrumentTypes {
			if instrumentType == it.Val {
				instrumentTypes[i].Count = instrumentTypes[i].Count + count
				break
			}
		}
		for i, mt := range msTypes {
			if msType == mt.Val {
				msTypes[i].Count = msTypes[i].Count + count
				break
			}
		}
		for i, im := range ionModes {
			if ionMode == im.Val {
				ionModes[i].Count = ionModes[i].Count + count
				break
			}
		}
	}

	val.Contributor = contributors
	val.InstrumentType = instrumentTypes
	val.MSType = msTypes
	val.IonMode = ionModes

	return val, err
}

// UpdateMetadata see [MB3Database.UpdateMetadata]
func (p *PostgresSQLDB) UpdateMetadata(meta *massbank.MbMetaData) (string, error) {
	if err := p.checkDatabase(); err != nil {
		return "", err
	}
	var id = 0
	query := `INSERT INTO metadata(commit,timestamp,version) 
			VALUES  ($1,$2,$3)  
			ON CONFLICT DO NOTHING 
			RETURNING id;`
	stmt, err := p.database.Prepare(query)
	if err != nil {
		return "", err
	}
	defer stmt.Close()

	err = stmt.QueryRow(meta.GitCommit, meta.Timestamp, meta.Version).Scan(&id)
	if err != nil {
		return "", err
	}

	return strconv.Itoa(id), err
}

func (p *PostgresSQLDB) DropIndex(i *Index) string {
	return "DROP INDEX IF EXISTS " + i.IndexName + ";"
}

func (p *PostgresSQLDB) CreateIndex(i *Index) string {
	return "CREATE INDEX " + i.IndexName + " ON " + i.TableName + " (" + strings.Join(i.Columns, ",") + ");"
}

// RemoveIndexes see [MB3Database.RemoveIndexes]
func (p *PostgresSQLDB) RemoveIndexes() error {
	if err := p.checkDatabase(); err != nil {
		return err
	}
	indexes := p.GetIndexes()
	for i := 0; i < len(indexes); i++ {
		query := p.DropIndex(&indexes[i])
		if _, err := p.database.Exec(query); err != nil {
			return err
		}
	}

	// add bingo index on molecules table
	query := "DROP INDEX IF EXISTS bingo_molecules_idx;"
	if _, err := p.database.Exec(query); err != nil {
		return err
	}

	return nil
}

// AddIndexes see [MB3Database.AddIndexes]
func (p *PostgresSQLDB) AddIndexes() error {
	if err := p.checkDatabase(); err != nil {
		return err
	}
	indexes := p.GetIndexes()
	for i := 0; i < len(indexes); i++ {
		query := p.CreateIndex(&indexes[i])
		if _, err := p.database.Exec(query); err != nil {
			return err
		}
	}

	// add bingo index on molecules table
	query := "CREATE INDEX bingo_molecules_idx ON molecules USING bingo_idx (molecule bingo.molecule);"
	if _, err := p.database.Exec(query); err != nil {
		return err
	}

	return nil
}

func getAtomCount(formula string) int {
	var count = 0
	re := regexp.MustCompile(`[A-Z]\d*[a-z]{0,1}\d*`)
	matches := re.FindAllString(formula, -1)

	for _, m := range matches {
		re2 := regexp.MustCompile(`\d*`)
		matches2 := re2.FindAllString(m, -1)
		valueString := matches2[len(matches2)-1]
		var value = 1
		if len(valueString) > 0 {
			i, err := strconv.Atoi(valueString)
			if err != nil {
				panic(err)
			}
			value = i
		}

		count += value
	}

	return count
}

// AddRecord see [MB3Database.AddRecord]
func (p *PostgresSQLDB) AddRecord(record *massbank.MassBank2, metaDataId string, mb3RecordJson string) error {
	if err := p.checkDatabase(); err != nil {
		return err
	}
	mid, err := strconv.ParseInt(metaDataId, 10, 64)
	if err != nil {
		return err
	}

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
			comments = append(comments, "\""+strings.ReplaceAll(comment.Subtag, "\"", "'")+"---"+strings.ReplaceAll(comment.Value, "\"", "'")+"\"")
		}
	}
	var massbankId int
	err = tx.QueryRow(q,
		record.Metadata.FileName,
		record.Accession,
		record.RecordTitle,
		"{"+strings.Join(comments, ",")+"}",
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
	if record.Compound.Names != nil {
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
	if record.Compound.Classes != nil {
		q = `INSERT INTO compound_class (class, compound_id, massbank_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
		for _, c := range *record.Compound.Classes {
			_, err = tx.Exec(q, c, compoundId, massbankId)
			if err != nil {
				if err2 := tx.Rollback(); err2 != nil {
					return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
				}
				return err
			}
		}
	}
	if record.Compound.Link != nil {
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

	if record.Acquisition.MassSpectrometry != nil {
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
	if record.Acquisition.Chromatography != nil {
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
	if record.Acquisition.General != nil {
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
	if record.MassSpectrometry.FocusedIon != nil {
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
	if record.MassSpectrometry.DataProcessing != nil {
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

	q = `INSERT INTO peak (mz, intensity, relative_intensity, spectrum_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING id;`
	insertedPeaks := massbank.PkPeak{
		Id:        []int32{},
		Mz:        []float64{},
		Intensity: []float64{},
		Rel:       []int32{},
	}
	var peakId int

	for i, mz := range record.Peak.Peak.Mz {
		if mz > 0 && record.Peak.Peak.Intensity[i] > 0 {
			err = tx.QueryRow(q, mz, record.Peak.Peak.Intensity[i], record.Peak.Peak.Rel[i], spectrumId).Scan(&peakId)
			if err != nil {
				if err2 := tx.Rollback(); err2 != nil {
					return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
				}
				return err
			}
			insertedPeaks.Id = append(insertedPeaks.Id, int32(peakId))
			insertedPeaks.Mz = append(insertedPeaks.Mz, mz)
			insertedPeaks.Intensity = append(insertedPeaks.Intensity, record.Peak.Peak.Intensity[i])
			insertedPeaks.Rel = append(insertedPeaks.Rel, record.Peak.Peak.Rel[i])
		}
	}
	if record.Peak.Annotation != nil && record.Peak.Annotation.Values != nil {
		q = `INSERT INTO peak_annotation(subtag, value, spectrum_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;`
		for _, header := range record.Peak.Annotation.Header {
			values := record.Peak.Annotation.Values[header]
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

	// insert into browse option table
	inchikey := ""
	if record.Compound.Link != nil {
		for _, link := range *record.Compound.Link {
			if link.Database == "INCHIKEY" {
				inchikey = link.Identifier
				break
			}
		}
	}

	q = `INSERT INTO browse_options (massbank_id, accession, contributor, instrument_type, ms_type, ion_mode, title, smiles, peak_ids_vec, mz_vec, intensity_vec, relative_intensity_vec, inchi, inchikey, splash, formula, mass, atomcount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);`
	var msType string
	var ionMode string
	for _, subProp := range *record.Acquisition.MassSpectrometry {
		if subProp.Subtag == "MS_TYPE" {
			msType = subProp.Value
		} else if subProp.Subtag == "ION_MODE" {
			ionMode = subProp.Value
		}
		if msType != "" && ionMode != "" {
			break
		}
	}

	_, err = tx.Exec(q, massbankId, *record.Accession, *record.Contributor, *record.Acquisition.InstrumentType, msType, ionMode, *record.RecordTitle, *record.Compound.Smiles, pq.Array(insertedPeaks.Id), pq.Array(insertedPeaks.Mz), pq.Array(insertedPeaks.Intensity), pq.Array(insertedPeaks.Rel), *record.Compound.InChI, inchikey, *record.Peak.Splash, *record.Compound.Formula, *record.Compound.Mass, getAtomCount(*record.Compound.Formula))
	if err != nil {
		fmt.Println("Error: ", err)
		if err2 := tx.Rollback(); err2 != nil {
			return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
		}
		return err
	}

	if (msType == "MS2" || msType == "MS3" || msType == "MS4") && *record.Peak.NumPeak > 1 && record.MassSpectrometry.FocusedIon != nil {
		var precursorStr = ""
		for _, subProp := range *record.MassSpectrometry.FocusedIon {
			if subProp.Subtag == "PRECURSOR_M/Z" {
				precursorStr = subProp.Value
				break
			}
		}
		if precursorStr != "" {
			precursorMass, err := strconv.ParseFloat(precursorStr, 64)
			if err == nil {
				var sb strings.Builder
				sb.WriteString("INSERT INTO peak_differences (spectrum_id, peak_id, precursor_mass, difference, rel_intensity) VALUES")
				var diff float64
				var toInsert = false
				for i := 0; i < len(insertedPeaks.Id); i++ {
					if insertedPeaks.Mz[i] >= precursorMass {
						diff = insertedPeaks.Mz[i] - precursorMass
					} else {
						diff = precursorMass - insertedPeaks.Mz[i]
					}
					sb.WriteString(fmt.Sprintf(" (%d, %d, %f, %f, %f)", spectrumId, insertedPeaks.Id[i], precursorMass, diff, float64(insertedPeaks.Rel[i])))
					if i < len(insertedPeaks.Id)-1 {
						sb.WriteString(",")
					}
					toInsert = true
				}
				if toInsert {
					sb.WriteString(";")
					_, err = tx.Exec(sb.String())
					if err != nil {
						if err2 := tx.Rollback(); err2 != nil {
							return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
						}
						return err
					}
				}
			}
		}
	}

	if record.Compound.Smiles != nil && *record.Compound.Smiles != "" {
		q = `INSERT INTO molecules (molecule, accession, atomcount) VALUES ($1, $2, $3);`
		_, err = tx.Exec(q, *record.Compound.Smiles, *record.Accession, getAtomCount(*record.Compound.Formula))
		if err != nil {
			if err2 := tx.Rollback(); err2 != nil {
				return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
			}
			return err
		}
	}

	// insert into records table
	q = `INSERT INTO records (massbank_id, accession, record_text) VALUES ($1, $2, $3);`
	_, err = tx.Exec(q, massbankId, *record.Accession, mb3RecordJson)
	if err != nil {
		if err2 := tx.Rollback(); err2 != nil {
			return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
		}
		return err
	}

	err = tx.Commit()
	if err != nil {
		if err2 := tx.Rollback(); err2 != nil {
			return errors.New("Could not rollback after error: " + err2.Error() + "\n:" + err.Error())
		}
		return err
	}

	return nil
}

// AddRecords see [MB3Database.AddRecords]
func (p *PostgresSQLDB) AddRecords(records []*massbank.MassBank2, metaDataId string, mb3RecordJsons []string) error {
	if len(records) != len(mb3RecordJsons) {
		return errors.New("records and mb3RecordJsons must have the same length")
	}

	start := time.Now()

	for i, record := range records {
		err := p.AddRecord(record, metaDataId, mb3RecordJsons[i])
		if err != nil {
			return err
		}
	}

	elapsed := time.Since(start)
	fmt.Printf("\n -> AddRecord function took %s", elapsed)
	fmt.Println()

	return nil
}

func (p *PostgresSQLDB) Init() error {
	var err error
	var query = `
		DROP TABLE IF EXISTS metadata, massbank, contributor, accession_contributor, author, accession_author, license, accession_license, publication, accession_publication, compound, compound_name, compound_class, compound_link, acquisition_instrument, accession_acquisition, acquisition_mass_spectrometry, acquisition_chromatography, acquisition_general, mass_spectrometry_focused_ion, mass_spectrometry_data_processing, spectrum, peak, peak_annotation, browse_options, peak_differences, records;		

		CREATE TABLE metadata (
			id SERIAL PRIMARY KEY,
			commit char(40),
			timestamp timestamp NOT NULL,
			version varchar(20) NOT NULL,
			UNIQUE (commit, timestamp, version)
		);

		CREATE TABLE massbank (
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
		CREATE TABLE contributor (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			UNIQUE (name)
		);
		CREATE TABLE accession_contributor (
			massbank_id INT REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			contributor_id INT NOT NULL REFERENCES contributor(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (massbank_id, contributor_id)
		);

		-- author
		CREATE TABLE author (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL
		);
		CREATE TABLE accession_author (
			massbank_id INT REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			author_id INT NOT NULL REFERENCES author(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (massbank_id, author_id)
		);

		-- license
		CREATE TABLE license (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			UNIQUE (name)
		);
		CREATE TABLE accession_license (
			massbank_id INT REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			license_id INT NOT NULL REFERENCES license(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (massbank_id, license_id)
		);

		-- publication
		CREATE TABLE publication (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			UNIQUE (name)
		);
		CREATE TABLE accession_publication (
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			publication_id INT NOT NULL REFERENCES publication(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (massbank_id, publication_id)
		);

		-- compound
		CREATE TABLE compound (
			id SERIAL PRIMARY KEY,
			inchi TEXT NOT NULL,
			formula TEXT NOT NULL,
			smiles TEXT NOT NULL,
			mass FLOAT NOT NULL,
			UNIQUE (inchi, formula, smiles, mass)
		);
		CREATE TABLE compound_name (
			name TEXT NOT NULL,
			compound_id INT NOT NULL REFERENCES compound(id) ON UPDATE CASCADE ON DELETE CASCADE,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (name, compound_id, massbank_id)		
		);
		CREATE TABLE compound_class (
			class TEXT NOT NULL,
			compound_id INT NOT NULL REFERENCES compound(id) ON UPDATE CASCADE ON DELETE CASCADE,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (class, compound_id, massbank_id)
		);
		CREATE TABLE compound_link (
			database TEXT NOT NULL,
			identifier TEXT NOT NULL,
			compound_id INT NOT NULL REFERENCES compound(id) ON UPDATE CASCADE ON DELETE CASCADE,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (database, identifier, compound_id, massbank_id)
		);

		-- acquisition
		CREATE TABLE acquisition_instrument (
			id SERIAL PRIMARY KEY,
			instrument TEXT NOT NULL,
			instrument_type TEXT NOT NULL,
			UNIQUE (instrument, instrument_type)
		);
		CREATE TABLE accession_acquisition (
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			acquisition_instrument_id INT NOT NULL REFERENCES acquisition_instrument(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE acquisition_mass_spectrometry (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE acquisition_chromatography (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE acquisition_general (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE
		);

		-- mass spectrometry
		CREATE TABLE mass_spectrometry_focused_ion (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (subtag, value, massbank_id)
		);
		CREATE TABLE mass_spectrometry_data_processing (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			UNIQUE (subtag, value, massbank_id)
		);

		-- spectrum (peak)
		CREATE TABLE spectrum (
			id SERIAL PRIMARY KEY,
			splash TEXT NOT NULL,
			num_peak INT NOT NULL,			
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE peak (
			id SERIAL PRIMARY KEY,
			mz FLOAT NOT NULL,
			intensity FLOAT NOT NULL,
			relative_intensity FLOAT NOT NULL,	
			spectrum_id INT NOT NULL REFERENCES spectrum(id) ON UPDATE CASCADE ON DELETE CASCADE
		);
		CREATE TABLE peak_annotation (
			subtag TEXT NOT NULL,
			value TEXT NOT NULL,
			spectrum_id INT NOT NULL REFERENCES spectrum(id) ON UPDATE CASCADE ON DELETE CASCADE
		);

		

		-- project
		-- CREATE TABLE project (
		-- 	id SERIAL PRIMARY KEY,
		-- 	name TEXT NOT NULL UNIQUE
		-- );
		-- CREATE TABLE accession_project (
		-- 	massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
		-- 	project_id INT NOT NULL REFERENCES project(id) ON UPDATE CASCADE ON DELETE CASCADE,
		-- 	UNIQUE (massbank_id, project_id)
		-- );
		
		-- species (sample)

		CREATE TABLE browse_options (
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			accession VARCHAR(40) NOT NULL REFERENCES massbank(accession) ON UPDATE CASCADE ON DELETE CASCADE,
			contributor TEXT NOT NULL REFERENCES contributor(name) ON UPDATE CASCADE ON DELETE CASCADE,
			instrument_type TEXT NOT NULL,
			ms_type TEXT NOT NULL,
			ion_mode TEXT NOT NULL,
			title TEXT NOT NULL,
			smiles TEXT NOT NULL,
			peak_ids_vec INT[] NOT NULL,
			mz_vec FLOAT[] NOT NULL,
			intensity_vec FLOAT[] NOT NULL,
			relative_intensity_vec INT[] NOT NULL,
			inchi TEXT NOT NULL,
			inchikey TEXT NOT NULL,
			splash TEXT NOT NULL,
			formula TEXT NOT NULL,
			mass FLOAT NOT NULL,
			atomcount INT NOT NULL
		);

		CREATE TABLE peak_differences (
			spectrum_id INT NOT NULL REFERENCES spectrum(id) ON UPDATE CASCADE ON DELETE CASCADE,			
			peak_id INT NOT NULL REFERENCES peak(id) ON UPDATE CASCADE ON DELETE CASCADE,
			precursor_mass FLOAT NOT NULL,
			difference FLOAT NOT NULL,			
			rel_intensity FLOAT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS records (
			id SERIAL NOT NULL PRIMARY KEY,
			massbank_id INT NOT NULL REFERENCES massbank(id) ON UPDATE CASCADE ON DELETE CASCADE,
			accession TEXT NOT NULL,
			record_text TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS molecules (
			id SERIAL NOT NULL PRIMARY KEY,
			molecule TEXT NOT NULL,
			accession TEXT NOT NULL,
			atomcount INT NOT NULL
		);

		TRUNCATE molecules CASCADE;
		`

	if _, err = p.database.Exec(query); err != nil {
		return err
	}
	return nil
}

func (p *PostgresSQLDB) checkDatabase() error {
	if p.database == nil {
		return errors.New("checkDatabase(): database not set")
	}
	return p.database.Ping()
}

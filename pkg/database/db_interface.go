package database

import (
	"log"
	"math"

	"github.com/Code-Hex/dd"

	"github.com/MassBank/MassBank3/pkg/massbank"
)

// Filters is the abstract description of filters used to find MassBank records
// in the database
type Filters struct {
	InstrumentType *[]string
	Splash         string
	MsType         *[]massbank.MsType
	IonMode        massbank.IonMode
	CompoundName   string
	CompoundClass  string
	Mass           *float64
	MassEpsilon    *float64
	Formula        string
	Peaks          *[]float64
	NeutralLoss    *[]float64
	Inchi          string
	InchiKey       string
	Contributor    *[]string
	Intensity      *int64
}

// DatabaseType is an enum containing the database type
type DatabaseType int

// The list of supported databases
const (
	Postgres = 0
)

// DBConfig is the abstract database configuration which should be used when working
// with [MB3Database].
type DBConfig struct {
	Database  DatabaseType
	DbUser    string
	DbPwd     string
	DbHost    string
	DbName    string
	DbPort    uint
	DbConnStr string
}

var DefaultValues = struct {
	MassEpsilon float64
	Intensity   int64
	Limit       int64
}{0.1, 50, math.MaxInt64}

// MBErrorType is an enum for the error types during database operations
type MBErrorType int

// The list of error types
const (
	DatabaseNotReady MBErrorType = iota
	CouldNotReachHost
	InternalError
	NotFoundError
	ConversionError
)

// MBDatabaseError is an error type specific for the database interactions
type MBDatabaseError struct {
	InnerError error  // inner error mostly from the database backend
	Message    string // the error message
}

// Implements the error interface for [MBDatabaseError]
func (err *MBDatabaseError) Error() string {
	var msg = err.Message
	if err != nil && len(err.Message) > 0 && err.InnerError != nil {
		msg += ": "
	}
	if err.InnerError != nil {
		return msg + err.Error()
	}
	return msg
}

type MBCountValues struct {
	Val   string
	Count int
}
type MBMinMaxValues struct {
	Min float64
	Max float64
}

type MB3Values struct {
	Contributor    []MBCountValues
	InstrumentType []MBCountValues
	MSType         []MBCountValues
	IonMode        []MBCountValues
	Intensity      MBMinMaxValues
	Mass           MBMinMaxValues
	Peak           MBMinMaxValues
}

type MB3StoredMetaData struct {
	Version   string
	TimeStamp string
	GitCommit string
}

type MB3MetaData struct {
	StoredMetadata MB3StoredMetaData
	SpectraCount   int
	CompoundCount  int
	IsomerCount    int
}

// MB3Database This is the Interface which has to be implemented for databases using MassBank3
//
// Any database can be used as in the backend as long as it defines the interface.
type MB3Database interface {

	// Connect to the database.
	Connect() error

	// Disconnect from the database.
	Disconnect() error

	Ping() error

	// Count MassBank records in the database.
	Count() (int64, error)

	// Initialises the database.
	Init() error

	// GetRecord gets a single MassBank record by the Accession string.
	// It should return nil and a [NotFoundError] if the record is not in the
	// database.
	GetRecord(*string) (*massbank.MassBank2, error)

	GetRecords(*[]string) (*[]string, error)

	// GetSimpleRecord gets a single simple MassBank record by the Accession string.
	// It should return nil and a [NotFoundError] if the record is not in the
	// database.
	GetSimpleRecord(*string) (*massbank.MassBank2, error)

	// GetSimpleRecords Get an array of MassBank records by filtering
	//
	// Will return an empty list if the filter does not match any records.
	GetSearchResults(filters Filters) (*[]string, *[]int32, error)

	// GetRecordsBySubstructure Get an array of MassBank accessions by filtering by substructure
	//
	// Will return an empty list if the filter does not match any records.
	GetAccessionsBySubstructure(substructure string) ([]string, []int32, error)

	GetAccessionsByFilterOptions(filters Filters) ([]string, []int32, error)

	NeutralLossSearch(neutralLoss *[]float64, tolerance *float64, minRelIntensity *int64) ([]string, []int32, map[string][]string, error)

	// GetRecordsBySubstructure Get an array of MassBank records by filtering by substructure
	//
	// Will return an empty list if the filter does not match any records.
	GetRecordsBySubstructure(substructure string) (*[]massbank.MassBank2, error)

	// GetUniqueValues is used to get the values for filter frontend
	GetUniqueValues(filters Filters) (MB3Values, error)

	GetMetadata() (*massbank.MbMetaData, error)

	// UpdateMetadata updates the metadata describing the MassBank version.
	// Provides the database id of an existing entry if it is already in the
	// database.
	//
	// Returns the id of the database entry as string.
	UpdateMetadata(meta *massbank.MbMetaData) (string, error)

	// RemoveIndexes removes all indexes from the database.
	RemoveIndexes() error

	//AddIndexes adds indexes to the database.
	AddIndexes() error

	// AddRecord adds a new MassBank record to the database. If the Accession
	// id already exists it will return an error.
	//
	// The second parameter is the database id of the version information. You
	// can get it from [UpdateMetadata].
	AddRecord(record *massbank.MassBank2, metaDataId string, mb3RecordJson string) error

	// AddRecords adds a list of MassBank records given as an array to the
	// database. If one of the Accession ids  exists the  function should roll
	// back the transaction and return an error.
	//
	// The second parameter is the database id of the version information. You
	// can get it from [UpdateMetadata].
	AddRecords(records []*massbank.MassBank2, metaDataId string, mb3RecordJsons []string) error
}

var db MB3Database

func InitDb(dbConfig DBConfig) (MB3Database, error) {
	if db == nil {
		var err error
		if dbConfig.Database == Postgres {
			db, err = NewPostgresSQLDb(dbConfig)
			log.Println(dd.Dump(db))
			if err != nil {
				panic(err)
			}
		}
		if err = db.Connect(); err != nil {
			panic(err)
		}
	}
	err := db.Ping()
	if err != nil {
		db = nil
	}
	return db, err
}

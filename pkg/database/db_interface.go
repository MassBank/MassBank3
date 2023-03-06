package database

import "github.com/MassBank/MassBank3/pkg/massbank"

// Filters is the abstract description of filters used to find MassBank reacords
// in the database
type Filters struct {
}

// DatabaseType is an enum containig the database type
type DatabaseType int

// The list of supported databases
const (
	MongoDB  DatabaseType = 0
	Postgres              = 1
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

// MBErrorType is an enum for the error types during database operations
type MBErrorType int

// The list of error types
const (
	DatabbaseNotReady MBErrorType = iota
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
	var msg string = err.Message
	if err != nil && len(err.Message) > 0 && err.InnerError != nil {
		msg += ": "
	}
	if err.InnerError != nil {
		return msg + err.Error()
	}
	return msg
}

// This is the Interface which has to be implemented for databases using MassBank3
//
// Any database can be used as in the backend as long as it defines the interface.
type MB3Database interface {

	// Connect to the database.
	Connect() error

	// Disconnect from the database.
	Disconnect() error

	// Count MassBank records in the database.
	Count() (int64, error)

	// IsEmpty checks if the database is empty and returns true if the database
	// is empty.
	IsEmpty() (bool, error)

	// DropAllRecords drops all MassBank records in the Database.
	DropAllRecords() error

	// GetRecord gets a single MassBank record by the Accession string.
	// It should return nil and a [NotFoundError] if the record is not in the
	// database.
	GetRecord(*string) (*massbank.Massbank, error)

	// GetRecords Get an array of massbank records by filtering
	//   - limit: maximum records to show
	// 	 - offset: first record
	//
	// Will return an empty list if the filter does not match any records.
	GetRecords(filters Filters, limit uint64, offset uint64) ([]*massbank.Massbank, error)

	// UpdateMetadata updates the metadata describing the MassBank version.
	// Provides the database id of an existing entry if it is already in the
	// database.
	//
	// Returns the id of the database entry as string.
	UpdateMetadata(meta *massbank.MbMetaData) (string, error)

	// AddRecord adds a new MassBank record to the database. If the Accession
	// id already exists it will return an error.
	//
	// The second parameter is the database id of the version information. You
	// can get it from [UpdateMetadata].
	AddRecord(record *massbank.Massbank, metaDataId string) error

	// AddRecords adds a list of MassBank records given as an array to the
	// database. If one of the Accession ids  exists the  function should roll
	// back the transaction and return an error.
	//
	// The second parameter is the database id of the version information. You
	// can get it from [UpdateMetadata].
	AddRecords(records []*massbank.Massbank, metaDataId string) error

	// UpdateRecord will replace an existing MassBank record. Depending on the
	// upsert parameter it also inserts the record if it not exists.
	//
	// The second parameter is the database id of the version information. You
	// can get it from [UpdateMetadata].
	//
	// This should return number of  modified and inserted records, but this is
	// not implemented for all databases.
	UpdateRecord(record *massbank.Massbank, metaDataId string, upsert bool) (uint64, uint64, error)

	// UpdateRecords will replace existing MassBank record. Depending on the
	// upsert parameter it also inserts the record if it not exists. This should
	// roll back the whole transaction if the there is an error.
	//
	// The second parameter is the database id of the version information. You
	// can get it from [UpdateMetadata].
	//
	// This should return number of  modified and inserted records, but this is
	// not implemented for all databases.
	UpdateRecords(records []*massbank.Massbank, metaDataId string, upsert bool) (uint64, uint64, error)
}

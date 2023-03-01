package database

import "github.com/MassBank/MassBank3/pkg/massbank"

type Filters struct {
}

type DatabaseType int

const (
	MongoDB  DatabaseType = 0
	Postgres              = 1
)

type DBConfig struct {
	Database  DatabaseType
	DbUser    string
	DbPwd     string
	DbHost    string
	DbName    string
	DbPort    uint
	DbConnStr string
}

type MB3Database interface {
	Connect() error
	Disconnect() error
	Count() (int64, error)
	IsEmpty() (bool, error)
	DropAllRecords() error
	GetRecord(*string) (*massbank.Massbank, error)
	GetRecords(filters Filters, limit uint64, offset uint64) ([]*massbank.Massbank, error)
	UpdateMetadata(meta *massbank.MbMetaData) (string, error)
	AddRecord(record *massbank.Massbank, metaDataId string) error
	AddRecords(records []*massbank.Massbank, metaDataId string) error
	UpdateRecord(record *massbank.Massbank, metaDataId string, upsert bool) (uint64, uint64, error)
	UpdateRecords(records []*massbank.Massbank, metaDataId string, upsert bool) (uint64, uint64, error)
}

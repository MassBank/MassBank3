package database

import "github.com/MassBank/MassBank3/pkg/massbank"

type Filters struct {
}

type DBConfig struct {
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
	GetRecord(*string) (massbank.Massbank, error)
	GetRecords(filters Filters, limit uint64) ([]massbank.Massbank, error)
	AddRecords(records []*massbank.Massbank) error
	UpdateRecords(records []*massbank.Massbank, upsert bool) (uint64, uint64, error)
	AddRecord(record *massbank.Massbank) error
	UpdateRecord(record *massbank.Massbank, upsert bool) (uint64, uint64, error)
	IsEmpty() (bool, error)
}

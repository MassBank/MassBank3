package database

import (
	"database/sql"
	"fmt"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"os"
	"reflect"
	"testing"
)

func TestMain(m *testing.M) {
	code, err := run(m)
	if err != nil {
		fmt.Println(err)
	}
	os.Exit(code)
}

func run(m *testing.M) (code int, err error) {
	return m.Run(), nil
}

func TestNewPostgresSQLDb(t *testing.T) {
	type args struct {
		config DBConfig
	}
	tests := []struct {
		name    string
		args    args
		want    MB3Database
		wantErr bool
	}{
		{
			"Working config",
			args{TestDbConfigs["workingPostgres"]},
			TestDbConfigPostgres["working"],
			false,
		},
		{
			"Working config with connection string",
			args{TestDbConfigs["workingPostgresConnString"]},
			TestDbConfigPostgres["workingConnString"],
			false,
		},
		{
			"Valid wrong config",
			args{TestDbConfigs["wrongPostgres"]},
			TestDbConfigPostgres["wrongHost"],
			false,
		},
		{
			"MongoDb config",
			args{TestDbConfigs["workingMongo"]},
			nil,
			true,
		},
		{
			"Empty config",
			args{TestDbConfigs["emptyPostgres"]},
			nil,
			true,
		},
		{
			"Config with host only",
			args{TestDbConfigs["onlyHostPostgres"]},
			nil,
			true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got, err := NewPostgresSQLDb(tt.args.config); (tt.want != nil && !reflect.DeepEqual(got, tt.want)) || (err != nil) != tt.wantErr {
				t.Errorf("NewPostgresSQLDb() = %v, want %v, error %v, wantErr %v", got, tt.want, err, tt.wantErr)
			}
		})
	}
}

func TestPostgresSQLDB_Connect(t *testing.T) {
	tests := []struct {
		name    string
		db      MB3Database
		wantErr bool
	}{
		{"working",
			TestDbConfigPostgres["working"],
			false,
		},
		{"connString working",
			TestDbConfigPostgres["workingConnString"],
			false,
		},
		{
			"wrongHost",
			TestDbConfigPostgres["wrongHost"],
			true,
		},
		{"workingMongo",
			TestDbConfigPostgres["workingMongo"],
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.Connect(); (err != nil) != tt.wantErr {
				t.Errorf("Connect() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPostgresSQLDB_Disconnect(t *testing.T) {
	tests := []struct {
		name    string
		db      MB3Database
		wantErr bool
	}{
		{"working",
			TestDbConfigPostgres["working"],
			false,
		},
		{"working again",
			TestDbConfigPostgres["working"],
			true,
		},
		{"connString working",
			TestDbConfigPostgres["workingConnString"],
			false,
		},
		{"connString working again",
			TestDbConfigPostgres["workingConnString"],
			true,
		},
		{
			"wrongHost",
			TestDbConfigPostgres["wrongHost"],
			true,
		},
		{"workingMongo",
			TestDbConfigPostgres["workingMongo"],
			false,
		},
		{"workingMongo again",
			TestDbConfigPostgres["workingMongo"],
			true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.Disconnect(); (err != nil) != tt.wantErr {
				t.Errorf("Disconnect() error = %v, wantErr %v, db %v", err, tt.wantErr, tt.db)
			}
		})
	}
}

func TestPostgresSQLDB_AddRecord(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	type args struct {
		record     *massbank.Massbank
		metaDataId string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			if err := p.AddRecord(tt.args.record, tt.args.metaDataId); (err != nil) != tt.wantErr {
				t.Errorf("AddRecord() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPostgresSQLDB_AddRecords(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	type args struct {
		records    []*massbank.Massbank
		metaDataId string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			if err := p.AddRecords(tt.args.records, tt.args.metaDataId); (err != nil) != tt.wantErr {
				t.Errorf("AddRecords() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPostgresSQLDB_CheckDatabase(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			if err := p.CheckDatabase(); (err != nil) != tt.wantErr {
				t.Errorf("CheckDatabase() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPostgresSQLDB_DropAllRecords(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			if err := p.DropAllRecords(); (err != nil) != tt.wantErr {
				t.Errorf("DropAllRecords() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPostgresSQLDB_GetRecord(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	type args struct {
		s *string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    *massbank.Massbank
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			got, err := p.GetRecord(tt.args.s)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetRecord() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetRecord() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPostgresSQLDB_GetRecords(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	type args struct {
		filters Filters
		limit   uint64
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    []*massbank.Massbank
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			got, err := p.GetRecords(tt.args.filters, tt.args.limit)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetRecords() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetRecords() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPostgresSQLDB_IsEmpty(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	tests := []struct {
		name    string
		fields  fields
		want    bool
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			got, err := p.IsEmpty()
			if (err != nil) != tt.wantErr {
				t.Errorf("IsEmpty() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("IsEmpty() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPostgresSQLDB_UpdateMetadata(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	type args struct {
		meta *massbank.MbMetaData
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    string
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			got, err := p.UpdateMetadata(tt.args.meta)
			if (err != nil) != tt.wantErr {
				t.Errorf("UpdateMetadata() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("UpdateMetadata() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPostgresSQLDB_UpdateRecord(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	type args struct {
		record     *massbank.Massbank
		metaDataId string
		upsert     bool
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    uint64
		want1   uint64
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			got, got1, err := p.UpdateRecord(tt.args.record, tt.args.metaDataId, tt.args.upsert)
			if (err != nil) != tt.wantErr {
				t.Errorf("UpdateRecord() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("UpdateRecord() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("UpdateRecord() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func TestPostgresSQLDB_UpdateRecords(t *testing.T) {
	type fields struct {
		user       string
		dbname     string
		password   string
		host       string
		port       uint
		connString string
		database   *sql.DB
	}
	type args struct {
		records    []*massbank.Massbank
		metaDataId string
		upsert     bool
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    uint64
		want1   uint64
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &PostgresSQLDB{
				user:       tt.fields.user,
				dbname:     tt.fields.dbname,
				password:   tt.fields.password,
				host:       tt.fields.host,
				port:       tt.fields.port,
				connString: tt.fields.connString,
				database:   tt.fields.database,
			}
			got, got1, err := p.UpdateRecords(tt.args.records, tt.args.metaDataId, tt.args.upsert)
			if (err != nil) != tt.wantErr {
				t.Errorf("UpdateRecords() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("UpdateRecords() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("UpdateRecords() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

package database

import (
	"os"
	"reflect"
	"testing"
)

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
			"Postgres valid config",
			args{TestDbConfigs["pg valid"]},
			TestDatabases["pg valid"],
			false,
		},
		{
			"Postgres valid config with connection string",
			args{TestDbConfigs["pg valid conn string"]},
			TestDatabases["pg valid conn string"],
			false,
		},
		{
			"Postgres with wrong host",
			args{TestDbConfigs["pg wrong host"]},
			TestDatabases["pg wrong host"],
			false,
		},
		{
			"MongoDb valid config",
			args{TestDbConfigs["mg valid"]},
			nil,
			true,
		},
		{
			"Postgres empty config",
			args{TestDbConfigs["pg empty"]},
			nil,
			true,
		},
		{
			"Postgres config with host only",
			args{TestDbConfigs["pg only host"]},
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

func initPostgresDB() error {
	files := []string{
		"/go/src/test-data/massbank.sql",
		"/go/src/test-data/massbank.sql",
	}
	db, err := NewPostgresSQLDb(TestDbConfigs["pg valid"])
	if err != nil {
		return err
	}
	err = db.Connect()
	if err != nil {
		return err
	}
	db.DropAllRecords()
	for _, f := range files {
		buf, err := os.ReadFile(f)
		if err != nil {
			return err
		}
		sqlStr := string(buf)
		_, err = db.database.Exec(sqlStr)
	}
	return err
}

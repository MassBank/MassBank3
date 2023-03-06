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

func initPostgresTestDB(set DbInitSet) (MB3Database, error) {
	var filenames = []string{"mb_metadata", "massbank"}
	var files = map[string]string{}
	files["mb_metadata"] = test_data_dir + "test-data/metadata.sql"
	switch set {
	case All:
		files["massbank"] = test_data_dir + "test-data/massbank-all.sql"
	case Main:
		files["massbank"] = test_data_dir + "test-data/massbank.sql"
	case Empty:
	}
	db, err := NewPostgresSQLDb(TestDbConfigs["pg valid"])
	if err != nil {
		return nil, err
	}
	err = db.Connect()
	if err != nil {
		return nil, err
	}
	if _, err = db.database.Exec("DELETE FROM massbank"); err != nil {
		return nil, err
	}
	if _, err = db.database.Exec("ALTER SEQUENCE massbank_id_seq RESTART WITH 1"); err != nil {
		return nil, err
	}
	if _, err = db.database.Exec("DELETE FROM metadata"); err != nil {
		return nil, err
	}
	if _, err = db.database.Exec("ALTER SEQUENCE metadata_id_seq RESTART WITH 1"); err != nil {
		return nil, err
	}
	for _, fn := range filenames {
		if f, ok := files[fn]; ok {

			buf, err := os.ReadFile(f)
			if err != nil {
				return nil, err
			}
			sqlStr := string(buf)
			if _, err = db.database.Exec(sqlStr); err != nil {
				return nil, err
			}
		}
	}
	return db, nil
}

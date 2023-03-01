package database

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"os"
	"reflect"
	"testing"
)

func TestNewMongoDB(t *testing.T) {
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
			"Valid config",
			args{TestDbConfigs["mg valid"]},
			TestDatabases["mg valid"],
			false,
		},
		{
			"empty config",
			args{TestDbConfigs["mg empty"]},
			nil,
			true,
		},
		{
			"Valid config with connection string",
			args{TestDbConfigs["mg valid conn string"]},
			TestDatabases["mg valid conn string"],
			false,
		},
		{
			"Config with connection string only",
			args{TestDbConfigs["mg conn string"]},
			nil,
			true,
		},
		{
			"Valid config",
			args{TestDbConfigs["mg wrong host"]},
			TestDatabases["mg wrong host"],
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.want != nil {
				tt.want.(*Mb3MongoDB).Reset()
			}
			got, err := NewMongoDB(tt.args.config)
			if (err != nil) != tt.wantErr {
				t.Errorf("NewMongoDB() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if err == nil && !reflect.DeepEqual(got, tt.want) {
				t.Errorf("NewMongoDB() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func initMongoTestDB(set DbInitSet) (MB3Database, error) {
	var files = map[string]string{"mb_metadata": "/go/src/test-data/mb_metadata.json"}
	switch set {
	case All:
		files["massbank"] = "/go/src/test-data/massbank-all.json"
	case Main:
		files["massbank"] = "/go/src/test-data/massbank.json"
	case Empty:
	}

	db, err := NewMongoDB(TestDbConfigs["mg valid"])
	if err != nil {
		return nil, err
	}
	if err = db.Connect(); err != nil {
		return nil, err
	}
	if err = db.database.Drop(context.Background()); err != nil {
		return nil, err
	}
	for col, file := range files {

		buf, err := os.ReadFile(file)
		if err != nil {
			return nil, err
		}
		jsonStr := string(buf)
		var m []interface{}
		if err := bson.UnmarshalExtJSON([]byte(jsonStr), false, &m); err != nil {
			return nil, err
		}
		if _, err = db.database.Collection(col).InsertMany(context.Background(), m); err != nil {
			return nil, err
		}
	}
	return db, nil
}

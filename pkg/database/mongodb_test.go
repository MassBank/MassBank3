package database

import (
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

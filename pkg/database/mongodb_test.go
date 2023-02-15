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
			"working",
			args{TestDbConfigs["workingMongo"]},
			TestDbConfigPostgres["workingMongo"],
			false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := NewMongoDB(tt.args.config)
			if (err != nil) != tt.wantErr {
				t.Errorf("NewMongoDB() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("NewMongoDB() got = %v, want %v", got, tt.want)
			}
		})
	}
}

package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"os"
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

type testDBinit struct {
	name   string
	initFn func(set DbInitSet) (MB3Database, error)
}

type testDB struct {
	name string
	db   MB3Database
}

func initDBs(set DbInitSet) ([]testDB, error) {
	var testDBs = []testDBinit{
		{"mongodb", initMongoTestDB},
		{"postgres", initPostgresTestDB},
	}
	var result = []testDB{}
	for _, d := range testDBs {
		db, err := d.initFn(set)
		if err != nil {
			return nil, err
		}
		result = append(result, testDB{d.name, db})
	}
	return result, nil
}

func (db testDB) checkCount(t *testing.T, expect int64) {
	if g, err := db.db.Count(); g != expect || err != nil {
		t.Errorf("%s: Count not does not match: expected %d, got %d: %v", db.name, expect, g, err)
	}
}

func TestMB3Database_Connect(t *testing.T) {
	tests := []struct {
		name    string
		db      MB3Database
		wantErr bool
	}{
		{"Postgres valid",
			TestDatabases["pg valid"],
			false,
		},
		{"Postgres with valid connection string",
			TestDatabases["pg valid conn string"],
			false,
		},
		{
			"Postgres with wrong host",
			TestDatabases["pg wrong host"],
			true,
		},
		{"MongoDB valid",
			TestDatabases["mg valid"],
			false,
		},
		{"MongoDB valid with connection string",
			TestDatabases["mg valid conn string"],
			false,
		},
		{"MongoDB with wrong host",
			TestDatabases["mg wrong host"],
			true,
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

func TestMB3Database_Disconnect(t *testing.T) {
	tests := []struct {
		name    string
		db      MB3Database
		wantErr bool
	}{
		{"Postgres valid",
			TestDatabases["pg valid"],
			false,
		},
		{"Postgres valid second time",
			TestDatabases["pg valid"],
			true,
		},
		{"Postgres with valid connection string",
			TestDatabases["pg valid conn string"],
			false,
		},
		{"Postgres with valid connection string second time",
			TestDatabases["pg valid conn string"],
			true,
		},
		{
			"Postgres with wrong host",
			TestDatabases["pg wrong host"],
			true,
		},
		{"MongoDB valid",
			TestDatabases["mg valid"],
			false,
		},
		{"MongoDB valid second time",
			TestDatabases["mg valid"],
			true,
		},
		{"MongoDB with wrong host",
			TestDatabases["mg wrong host"],
			true,
		},
		{"MongoDB with connection string",
			TestDatabases["mg valid conn string"],
			false,
		},
		{"MongoDB with connection string second time",
			TestDatabases["mg valid conn string"],
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

func TestMb3Database_Count(t *testing.T) {
	DBs, err := initDBs(Main)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	for _, db := range DBs {
		if c, err := db.db.Count(); c != 8 || err != nil {
			t.Errorf("%s: Could not count expected 8 got %c: %v", db.name, c, err)
		}
		if c, err := db.db.Count(); c != 8 || err != nil {
			t.Errorf("%s: Could not count second time exptected 8 got %v: %v", db.name, c, err)
		}
	}
}

func TestMB3Database_DropAllRecords(t *testing.T) {
	DBs, err := initDBs(Main)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	for _, db := range DBs {
		db.checkCount(t, 8)
		if err := db.db.DropAllRecords(); err != nil {
			t.Errorf("%s: Could not drop: %v", db.name, err)
		}
		db.checkCount(t, 0)
		if err := db.db.DropAllRecords(); err != nil {
			t.Errorf("%s: Could not drop on empty db: %v", db.name, err)
		}
		db.checkCount(t, 0)
	}
}

func TestMb3MongoDB_IsEmpty(t *testing.T) {
	DBs, err := initDBs(Main)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	for _, db := range DBs {
		if ok, err := db.db.IsEmpty(); ok || err != nil {
			t.Errorf("%s: error on no-nempty database: %v", db.name, err)
		}
		if err := db.db.DropAllRecords(); err != nil {
			t.Errorf("%s: Could not drop on empty db: %v", db.name, err)
		}
		if ok, err := db.db.IsEmpty(); !ok || err != nil {
			t.Errorf("%s: error on nempty database: %v", db.name, err)
		}
	}
}

func TestMB3Database_GetRecord(t *testing.T) {
	type args struct {
		s string
	}
	var records = []string{
		"MSBNK-AAFC-AC000005",
		"MSBNK-Athens_Univ-AU229201",
		"MSBNK-Eawag-EA018353",
		"MSBNK-Eawag_Additional_Specs-ET060401",
		"MSBNK-Fac_Eng_Univ_Tokyo-JP009132",
		"MSBNK-Keio_Univ-KO009105",
		"MSBNK-MSSJ-MSJ00284",
		"MSBNK-RIKEN-PR100978",
		"MSBNK-RIKEN-PR309089",
		"MSBNK-Washington_State_Univ-BML81902",
		"MSBNK-test-TST00001",
		"MSBNK-test-TST00002",
		"MSBNK-test-TST00003",
	}
	DBs, err := initDBs(All)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	for _, db := range DBs {

		type testData struct {
			db      testDB
			name    string
			args    args
			want    massbank.Massbank
			wantErr bool
		}
		var tests = []testData{}
		for _, record := range records {
			var test = testData{
				db,
				db.name + " " + record,
				args{record},
				mbTestRecords[record],
				false,
			}
			tests = append(tests, test)
		}
		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				got, err := tt.db.db.GetRecord(&tt.args.s)
				if (err != nil) != tt.wantErr {
					t.Errorf("%s: GetRecord() error = %v, wantErr %v", tt.db.name, err, tt.wantErr)
					return
				}
				got.Metadata.VersionRef = tt.want.Metadata.VersionRef
				bg, errg := json.Marshal(got)
				bw, errw := json.Marshal(tt.want)
				if string(bg) != string(bw) || errg != nil || errw != nil {
					t.Errorf("\nwant: %v \ngot : %v\n", string(bw), string(bg))
				}
			})
		}
	}
}

func TestMB3Database_GetRecords(t *testing.T) {

}

func TestMB3Database_AddRecord(t *testing.T) {
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

func TestMB3Database_AddRecords(t *testing.T) {
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

func TestMB3Database_UpdateMetadata(t *testing.T) {
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

func TestMB3Database_UpdateRecord(t *testing.T) {
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

func TestMB3Database_UpdateRecords(t *testing.T) {
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

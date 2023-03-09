package database

import (
	"encoding/json"
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

var recordnames = []string{
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

func testRecord(i uint64) *massbank.Massbank {
	var mb = mbTestRecords[recordnames[i]]
	return &mb
}
func testRecords(names []uint64) []*massbank.Massbank {
	var records = []*massbank.Massbank{}
	for _, i := range names {
		var mb = mbTestRecords[recordnames[i]]
		records = append(records, &mb)
	}
	return records
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

func TestMB3Database_GetRecord(t *testing.T) {
	type args struct {
		s string
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
		for _, record := range recordnames {
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
	DBs, err := initDBs(Main)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	type args struct {
		f      Filters
		lim    uint64
		offset uint64
	}
	for _, db := range DBs {

		type testData struct {
			db      testDB
			name    string
			args    args
			want    []*massbank.Massbank
			wantErr bool
		}
		var tests = []testData{
			{
				db,
				db.name + " " + "Get all records",
				args{Filters{}, 0, 0},
				testRecords([]uint64{0, 1, 2, 3, 4, 10, 11, 12}),
				false,
			},
			{
				db,
				db.name + " " + "Get first 3 records",
				args{Filters{}, 3, 0},
				testRecords([]uint64{0, 1, 2}),
				false,
			},
			{
				db,
				db.name + " " + "Get second page with 3 records",
				args{Filters{}, 3, 3},
				testRecords([]uint64{3, 4, 10}),
				false,
			},
			{
				db,
				db.name + " " + "Get all but first  3 records",
				args{Filters{}, 0, 3},
				testRecords([]uint64{3, 4, 10, 11, 12}),
				false,
			},
		}
		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				got, err := tt.db.db.GetRecords(tt.args.f, tt.args.lim, tt.args.offset)
				if (err != nil) != tt.wantErr {
					t.Errorf("%s: GetRecords() error = %v, wantErr %v", tt.db.name, err, tt.wantErr)
					return
				}
				if (tt.args.lim != 0 && len(got) > int(tt.args.lim)) ||
					len(got) != len(tt.want) {
					t.Errorf("Limit was %d, expected %d records, but got %d records", tt.args.lim, len(tt.want), len(got))
				}

				for i := range tt.want {
					got[i].Metadata.VersionRef = tt.want[i].Metadata.VersionRef
					bg, errg := json.Marshal(got[i])
					bw, errw := json.Marshal(tt.want[i])
					if string(bg) != string(bw) || errg != nil || errw != nil {
						t.Errorf("\nwant: %v \ngot : %v\n", string(bw), string(bg))
					}
				}

			})
		}

	}
}

func TestMB3Database_GetUniqueValues(t *testing.T) {
	DBs, err := initDBs(All)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	for _, db := range DBs {
		type testData struct {
			db      testDB
			name    string
			want    MB3Values
			wantErr bool
		}

		var tests = []testData{
			{
				db:      db,
				name:    db.name + " Test valid data",
				want:    UniqueValueTestData["all"],
				wantErr: false,
			},
		}
		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				got, err := tt.db.db.GetUniqueValues(Filters{})
				if (err != nil) != tt.wantErr {
					t.Errorf("%s: GetUniqueValues() error = %v, wantErr %v", tt.db.name, err, tt.wantErr)
					return
				}

				if !reflect.DeepEqual(got, tt.want) {
					t.Errorf("GetUniqueValues(): got %v, want %v", got, tt.want)
				}
			})
		}
	}

}

func TestMB3Database_AddRecord(t *testing.T) {
	DBs, err := initDBs(Empty)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	type args struct {
		record     massbank.Massbank
		metaDataId string
	}
	type testData struct {
		name    string
		args    args
		wantErr bool
	}
	for _, db := range DBs {
		db.checkCount(t, 0)
		var tests = []testData{}
		for key, record := range mbTestRecords {
			var versionId string
			if db.name == "mongodb" {
				versionId = "63fcbaf4b9e0e5714f9d623b"
			} else {
				versionId = "1"
			}
			data := testData{
				name:    db.name + "-" + key,
				args:    args{record, versionId},
				wantErr: false,
			}
			tests = append(tests, data)
		}
		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				if err := db.db.AddRecord(&tt.args.record, tt.args.metaDataId); (err != nil) != tt.wantErr {
					t.Errorf("AddRecord() error = %v, wantErr %v", err, tt.wantErr)
				}
			})
		}
		db.checkCount(t, int64(len(recordnames)))
	}
}

func TestMB3Database_AddRecords(t *testing.T) {
	DBs, err := initDBs(Empty)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	type args struct {
		records    []uint64
		metaDataId string
	}
	type testData struct {
		name      string
		args      args
		wantErr   bool
		wantCount uint64
	}
	for _, db := range DBs {
		var versionId string
		if db.name == "mongodb" {
			versionId = "63fcbaf4b9e0e5714f9d623b"
		} else {
			versionId = "1"
		}
		var tests = []testData{
			{
				db.name + "-" + "Insert first 5",
				args{[]uint64{0, 1, 2, 3, 4}, versionId},
				false,
				5,
			},
			{
				db.name + "-" + "Insert second 5",
				args{[]uint64{5, 6, 7, 8, 9}, versionId},
				false,
				10,
			},
		}

		db.checkCount(t, 0)
		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				var records []*massbank.Massbank
				for _, i := range tt.args.records {
					var mb = mbTestRecords[recordnames[i]]
					records = append(records, &mb)
				}
				if err := db.db.AddRecords(records, tt.args.metaDataId); (err != nil) != tt.wantErr {
					t.Errorf("AddRecords() error = %v, wantErr %v", err, tt.wantErr)
				}
				db.checkCount(t, int64(tt.wantCount))
			})
		}
	}
}

func TestMB3Database_UpdateMetadata(t *testing.T) {
	DBs, err := initDBs(Main)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	type args struct {
		metaData massbank.MbMetaData
	}
	type testData struct {
		name    string
		args    args
		wantErr bool
		oldId   bool
	}
	for _, db := range DBs {
		var tests = []testData{
			{
				db.name + " insert existing",
				args{metaData: massbank.MbMetaData{
					Commit:    "1e112e6777e453f54d8e3b3f6cac0f193d53fa38",
					Version:   "2022.12",
					Timestamp: "2023-02-02T13:35:54+01:00",
				}},
				false,
				true,
			},
			{
				db.name + " insert new",
				args{metaData: massbank.MbMetaData{
					Commit:    "1e112e6777e412344d8e3b3f6cac0f193d53fa38",
					Version:   "2023.1",
					Timestamp: "2023-03-02T18:35:54+01:00",
				}},
				false,
				false,
			},
		}
		var versionId string
		if db.name == "mongodb" {
			versionId = "63f746d01247aa361673cb67"
		} else {
			versionId = "1"
		}
		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				gotId, err := db.db.UpdateMetadata(&tt.args.metaData)
				if (err != nil) != tt.wantErr {
					t.Errorf("UpdateMetadata() error = %v, wantErr %v", err, tt.wantErr)
				}
				if (tt.oldId && gotId != versionId) || (!tt.oldId && gotId == versionId) {
					t.Errorf("UpdateMetadata() got wrong id: %v", gotId)

				}
			})

		}
	}

}

func TestMB3Database_UpdateRecord(t *testing.T) {
	DBs, err := initDBs(Main)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	type args struct {
		record     *massbank.Massbank
		metaDataId string
		upsert     bool
	}
	type testData struct {
		name      string
		args      args
		wantErr   bool
		wantCount uint64
	}
	for _, db := range DBs {
		db.checkCount(t, 8)
		var versionId string
		if db.name == "mongodb" {
			versionId = "63fcbaf4b9e0e5714f9d623b"
		} else {
			versionId = "1"
		}
		var tests = []testData{
			{
				"Update first",
				args{testRecord(0), versionId, false},
				false,
				8,
			},
			{
				"Update second",
				args{testRecord(1), versionId, true},
				false,
				8,
			},
			{
				"Try Insert with upsert",
				args{testRecord(5), versionId, false},
				false,
				8,
			},
			{
				"Try Insert with upsert",
				args{testRecord(5), versionId, true},
				false,
				9,
			},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				if _, _, err := db.db.UpdateRecord(tt.args.record, tt.args.metaDataId, tt.args.upsert); (err != nil) != tt.wantErr {
					t.Errorf("AddRecord() error = %v, wantErr %v", err, tt.wantErr)
				}
			})
			db.checkCount(t, int64(tt.wantCount))

		}
	}
}

func TestMB3Database_UpdateRecords(t *testing.T) {
	DBs, err := initDBs(Main)
	if err != nil {
		t.Fatal("Could not init Databases: ", err.Error())
	}
	type args struct {
		records    []*massbank.Massbank
		metaDataId string
		upsert     bool
	}
	type testData struct {
		name      string
		args      args
		wantErr   bool
		wantCount uint64
	}
	for _, db := range DBs {
		var versionId string
		if db.name == "mongodb" {
			versionId = "63fcbaf4b9e0e5714f9d623b"
		} else {
			versionId = "1"
		}
		var tests = []testData{
			{
				db.name + "-" + "Update first 5",
				args{testRecords([]uint64{0, 1, 2, 3, 4}), versionId, false},
				false,
				8,
			},
			{
				db.name + "-" + "Try insert 3 w/o upsert",
				args{testRecords([]uint64{5, 6, 7}), versionId, false},
				false,
				8,
			},
			{
				db.name + "-" + "Insert 3 with upsert",
				args{testRecords([]uint64{5, 6, 7}), versionId, true},
				false,
				11,
			},
			{
				db.name + "-" + "Insert/Update second 5 with upsert",
				args{testRecords([]uint64{5, 6, 7, 8, 9}), versionId, true},
				false,
				13,
			},
		}

		db.checkCount(t, 8)
		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				var records []*massbank.Massbank
				for _, r := range tt.args.records {
					r.Comments = append(r.Comments, &massbank.RecordComment{SubtagProperty: massbank.SubtagProperty{StringProperty: massbank.StringProperty{String: "new comment"}}})
					records = append(records, r)
				}
				_, _, err := db.db.UpdateRecords(records, tt.args.metaDataId, tt.args.upsert)
				if (err != nil) != tt.wantErr {
					t.Errorf("UpdateRecords() error = %v, wantErr %v", err, tt.wantErr)
				}
				db.checkCount(t, int64(tt.wantCount))
			})
		}
	}
}

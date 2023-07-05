// Code generated by MockGen. DO NOT EDIT.
// Source: pkg/database/db_interface.go

// Package mock_database is a generated GoMock package.
package mock_database

import (
	reflect "reflect"

	database "github.com/MassBank/MassBank3/pkg/database"
	massbank "github.com/MassBank/MassBank3/pkg/massbank"
	gomock "github.com/golang/mock/gomock"
)

// MockMB3Database is a mock of MB3Database interface.
type MockMB3Database struct {
	ctrl     *gomock.Controller
	recorder *MockMB3DatabaseMockRecorder
}

// MockMB3DatabaseMockRecorder is the mock recorder for MockMB3Database.
type MockMB3DatabaseMockRecorder struct {
	mock *MockMB3Database
}

// NewMockMB3Database creates a new mock instance.
func NewMockMB3Database(ctrl *gomock.Controller) *MockMB3Database {
	mock := &MockMB3Database{ctrl: ctrl}
	mock.recorder = &MockMB3DatabaseMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockMB3Database) EXPECT() *MockMB3DatabaseMockRecorder {
	return m.recorder
}

// AddRecord mocks base method.
func (m *MockMB3Database) AddRecord(record *massbank.MassBank2, metaDataId string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AddRecord", record, metaDataId)
	ret0, _ := ret[0].(error)
	return ret0
}

// AddRecord indicates an expected call of AddRecord.
func (mr *MockMB3DatabaseMockRecorder) AddRecord(record, metaDataId interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AddRecord", reflect.TypeOf((*MockMB3Database)(nil).AddRecord), record, metaDataId)
}

// AddRecords mocks base method.
func (m *MockMB3Database) AddRecords(records []*massbank.MassBank2, metaDataId string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AddRecords", records, metaDataId)
	ret0, _ := ret[0].(error)
	return ret0
}

// AddRecords indicates an expected call of AddRecords.
func (mr *MockMB3DatabaseMockRecorder) AddRecords(records, metaDataId interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AddRecords", reflect.TypeOf((*MockMB3Database)(nil).AddRecords), records, metaDataId)
}

// Connect mocks base method.
func (m *MockMB3Database) Connect() error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Connect")
	ret0, _ := ret[0].(error)
	return ret0
}

// Connect indicates an expected call of Connect.
func (mr *MockMB3DatabaseMockRecorder) Connect() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Connect", reflect.TypeOf((*MockMB3Database)(nil).Connect))
}

// Count mocks base method.
func (m *MockMB3Database) Count() (int64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Count")
	ret0, _ := ret[0].(int64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Count indicates an expected call of Count.
func (mr *MockMB3DatabaseMockRecorder) Count() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Count", reflect.TypeOf((*MockMB3Database)(nil).Count))
}

// Disconnect mocks base method.
func (m *MockMB3Database) Disconnect() error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Disconnect")
	ret0, _ := ret[0].(error)
	return ret0
}

// Disconnect indicates an expected call of Disconnect.
func (mr *MockMB3DatabaseMockRecorder) Disconnect() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Disconnect", reflect.TypeOf((*MockMB3Database)(nil).Disconnect))
}

// DropAllRecords mocks base method.
func (m *MockMB3Database) DropAllRecords() error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DropAllRecords")
	ret0, _ := ret[0].(error)
	return ret0
}

// DropAllRecords indicates an expected call of DropAllRecords.
func (mr *MockMB3DatabaseMockRecorder) DropAllRecords() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DropAllRecords", reflect.TypeOf((*MockMB3Database)(nil).DropAllRecords))
}

// GetMetaData mocks base method.
func (m *MockMB3Database) GetMetaData() (*database.MB3MetaData, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetMetaData")
	ret0, _ := ret[0].(*database.MB3MetaData)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetMetaData indicates an expected call of GetMetaData.
func (mr *MockMB3DatabaseMockRecorder) GetMetaData() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetMetaData", reflect.TypeOf((*MockMB3Database)(nil).GetMetaData))
}

// GetRecord mocks base method.
func (m *MockMB3Database) GetRecord(arg0 *string) (*massbank.MassBank2, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetRecord", arg0)
	ret0, _ := ret[0].(*massbank.MassBank2)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetRecord indicates an expected call of GetRecord.
func (mr *MockMB3DatabaseMockRecorder) GetRecord(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetRecord", reflect.TypeOf((*MockMB3Database)(nil).GetRecord), arg0)
}

// GetRecords mocks base method.
func (m *MockMB3Database) GetRecords(filters database.Filters) (*database.SearchResult, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetRecords", filters)
	ret0, _ := ret[0].(*database.SearchResult)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetRecords indicates an expected call of GetRecords.
func (mr *MockMB3DatabaseMockRecorder) GetRecords(filters interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetRecords", reflect.TypeOf((*MockMB3Database)(nil).GetRecords), filters)
}

// GetSmiles mocks base method.
func (m *MockMB3Database) GetSmiles(accession *string) (*string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetSmiles", accession)
	ret0, _ := ret[0].(*string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetSmiles indicates an expected call of GetSmiles.
func (mr *MockMB3DatabaseMockRecorder) GetSmiles(accession interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetSmiles", reflect.TypeOf((*MockMB3Database)(nil).GetSmiles), accession)
}

// GetSpectra mocks base method.
func (m *MockMB3Database) GetSpectra(filters database.Filters) (map[string]massbank.MsSpectrum, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetSpectra", filters)
	ret0, _ := ret[0].(map[string]massbank.MsSpectrum)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetSpectra indicates an expected call of GetSpectra.
func (mr *MockMB3DatabaseMockRecorder) GetSpectra(filters interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetSpectra", reflect.TypeOf((*MockMB3Database)(nil).GetSpectra), filters)
}

// GetUniqueValues mocks base method.
func (m *MockMB3Database) GetUniqueValues(filters database.Filters) (database.MB3Values, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUniqueValues", filters)
	ret0, _ := ret[0].(database.MB3Values)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUniqueValues indicates an expected call of GetUniqueValues.
func (mr *MockMB3DatabaseMockRecorder) GetUniqueValues(filters interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUniqueValues", reflect.TypeOf((*MockMB3Database)(nil).GetUniqueValues), filters)
}

// Ping mocks base method.
func (m *MockMB3Database) Ping() error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Ping")
	ret0, _ := ret[0].(error)
	return ret0
}

// Ping indicates an expected call of Ping.
func (mr *MockMB3DatabaseMockRecorder) Ping() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Ping", reflect.TypeOf((*MockMB3Database)(nil).Ping))
}

// UpdateMetadata mocks base method.
func (m *MockMB3Database) UpdateMetadata(meta *massbank.MbMetaData) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateMetadata", meta)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateMetadata indicates an expected call of UpdateMetadata.
func (mr *MockMB3DatabaseMockRecorder) UpdateMetadata(meta interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateMetadata", reflect.TypeOf((*MockMB3Database)(nil).UpdateMetadata), meta)
}

// UpdateRecord mocks base method.
func (m *MockMB3Database) UpdateRecord(record *massbank.MassBank2, metaDataId string, upsert bool) (uint64, uint64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateRecord", record, metaDataId, upsert)
	ret0, _ := ret[0].(uint64)
	ret1, _ := ret[1].(uint64)
	ret2, _ := ret[2].(error)
	return ret0, ret1, ret2
}

// UpdateRecord indicates an expected call of UpdateRecord.
func (mr *MockMB3DatabaseMockRecorder) UpdateRecord(record, metaDataId, upsert interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateRecord", reflect.TypeOf((*MockMB3Database)(nil).UpdateRecord), record, metaDataId, upsert)
}

// UpdateRecords mocks base method.
func (m *MockMB3Database) UpdateRecords(records []*massbank.MassBank2, metaDataId string, upsert bool) (uint64, uint64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateRecords", records, metaDataId, upsert)
	ret0, _ := ret[0].(uint64)
	ret1, _ := ret[1].(uint64)
	ret2, _ := ret[2].(error)
	return ret0, ret1, ret2
}

// UpdateRecords indicates an expected call of UpdateRecords.
func (mr *MockMB3DatabaseMockRecorder) UpdateRecords(records, metaDataId, upsert interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateRecords", reflect.TypeOf((*MockMB3Database)(nil).UpdateRecords), records, metaDataId, upsert)
}

package database

import (
	"errors"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/net/context"
	"log"
	"strconv"
)

const (
	MB_COLLECTION      = "massbank"
	MB_META_COLLECTION = "mb_metadata"
)

type Mb3MongoDB struct {
	user     string
	pwd      string
	host     string
	dbname   string
	port     uint16
	database *mongo.Database
	dirty    bool
}

func (db *Mb3MongoDB) UpdateMetadata(meta *massbank.MbMetaData) (string, error) {
	if db.database == nil {
		return "", errors.New("database not ready")
	}
	var res bson.M
	err := db.database.Collection(MB_META_COLLECTION).FindOne(context.Background(), bson.D{{"commit", meta.Commit}, {"timestamp", meta.Timestamp}}, options.FindOne().SetProjection(bson.D{{"_id", 1}})).Decode(&res)
	if err != nil {
		iRes, err := db.database.Collection(MB_META_COLLECTION).InsertOne(context.Background(), meta)
		if err != nil {
			return "", err
		}
		return iRes.InsertedID.(primitive.ObjectID).Hex(), nil

	}
	return res["_id"].(primitive.ObjectID).Hex(), nil
}

func (db *Mb3MongoDB) IsEmpty() (bool, error) {
	if db.database == nil {
		return true, errors.New("database not ready")
	}
	count, err := db.database.Collection(MB_COLLECTION).CountDocuments(context.Background(), bson.D{})
	if count < 1 || err != nil {
		return true, err
	}
	return false, nil
}

func (db *Mb3MongoDB) GetRecord(s *string) (*massbank.Massbank, error) {
	//TODO implement me
	panic("implement me")
}

func (db *Mb3MongoDB) GetRecords(filters Filters, limit uint64) ([]*massbank.Massbank, error) {
	//TODO implement me
	panic("implement me")
}

func (db *Mb3MongoDB) AddRecords(records []*massbank.Massbank, metadataId string) error {
	if db.database == nil {
		return errors.New("database not ready")
	}
	var recordsI = make([]interface{}, len(records))
	for i, record := range records {
		record.Metadata.VersionRef = massbank.MbReference(metadataId)
		recordsI[i] = record
	}
	_, err := db.database.Collection(MB_COLLECTION).InsertMany(context.Background(), recordsI)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (db *Mb3MongoDB) UpdateRecords(records []*massbank.Massbank, metadataId string, upsert bool) (uint64, uint64, error) {
	if db.database == nil {
		return 0, 0, errors.New("database not ready")
	}
	var upserted uint64 = 0
	var modified uint64 = 0
	for _, record := range records {
		u, m, err := db.UpdateRecord(record, metadataId, upsert)
		if err != nil {
			log.Println(err)
		}
		upserted += u
		modified += m
	}
	return upserted, modified, nil
}

func (db *Mb3MongoDB) AddRecord(record *massbank.Massbank, metadataId string) error {
	if db.database == nil {
		return errors.New("database not ready")
	}
	record.Metadata.VersionRef = massbank.MbReference(metadataId)
	_, err := db.database.Collection(MB_COLLECTION).InsertOne(context.Background(), *record)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (db *Mb3MongoDB) UpdateRecord(record *massbank.Massbank, metadataId string, upsert bool) (uint64, uint64, error) {
	if db.database == nil {
		return 0, 0, errors.New("database not ready")
	}
	record.Metadata.VersionRef = massbank.MbReference(metadataId)
	opt := options.ReplaceOptions{}
	res, err := db.database.Collection(MB_COLLECTION).ReplaceOne(context.Background(), bson.D{{"accession", record.Accession.String}}, record, opt.SetUpsert(upsert))
	if err != nil {
		log.Println(err)
		return 0, 0, err
	}
	return uint64(res.ModifiedCount), uint64(res.UpsertedCount), nil
}

func NewMongoDB(config DBConfig) (*Mb3MongoDB, error) {
	return &Mb3MongoDB{
		user:     config.DbUser,
		pwd:      config.DbPwd,
		host:     config.DbHost,
		dbname:   config.DbName,
		port:     uint16(config.DbPort),
		database: nil,
		dirty:    true,
	}, nil
}

func (db *Mb3MongoDB) SetUser(user string) *Mb3MongoDB {
	db.dirty = db.dirty || user != db.user
	db.user = user
	return db
}

func (db *Mb3MongoDB) SetPassword(password string) *Mb3MongoDB {
	db.dirty = db.dirty || password != db.pwd
	db.pwd = password
	return db
}

func (db *Mb3MongoDB) SetHost(host string) *Mb3MongoDB {
	db.dirty = db.dirty || host != db.host
	db.host = host
	return db
}

func (db *Mb3MongoDB) SetDbName(dbname string) *Mb3MongoDB {
	db.dirty = db.dirty || dbname == db.dbname
	db.dbname = dbname
	return db
}

func (db *Mb3MongoDB) SetPort(port uint16) *Mb3MongoDB {
	db.dirty = db.dirty || port == db.port
	db.port = port
	return db
}

func (db *Mb3MongoDB) Connect() error {
	ctx := context.TODO()
	if db.dirty && db.database != nil {
		err := db.database.Client().Disconnect(ctx)
		if err != nil {
			println("Database connection probably not closed: " + err.Error())
		}
		db.database = nil
	}
	if db.database == nil {
		clOptions := options.Client().SetAuth(options.Credential{
			AuthMechanism:           "SCRAM-SHA-256",
			AuthMechanismProperties: nil,
			AuthSource:              "admin",
			Username:                db.user,
			Password:                db.pwd,
			PasswordSet:             true,
		}).SetAppName("Massbank3API").SetHosts([]string{db.host + ":" + strconv.FormatInt(int64(db.port), 10)})
		dbclient, err := mongo.Connect(ctx, clOptions)
		mongoDb := dbclient.Database(db.dbname)
		if err != nil {
			return err
		}
		db.database = mongoDb
		db.dirty = false
	}
	err := db.init()
	if err != nil {
		return err
	}
	return db.database.Client().Ping(ctx, nil)
}

func (db *Mb3MongoDB) init() error {
	opt := options.IndexOptions{}
	_, err := db.database.Collection(MB_COLLECTION).Indexes().CreateOne(context.Background(),
		mongo.IndexModel{bson.D{{"accession", 1}},
			opt.SetName("accession_1").SetUnique(true)})
	indeces := []string{"compound.names", "compound.mass", "compound.formula", "acquisition.instrumenttype", "acquisition.massspectrometry.ION_MODE", "acquisition.massspectrometry.MS_TYPE"}
	for _, index := range indeces {
		db.database.Collection(MB_COLLECTION).Indexes().CreateOne(context.Background(), mongo.IndexModel{bson.D{{index, 1}}, &options.IndexOptions{}})

	}
	opt = options.IndexOptions{}
	db.database.Collection(MB_META_COLLECTION).Indexes().CreateOne(context.Background(), mongo.IndexModel{bson.D{{"version", 1}, {"commit", 1}, {"timestamp", 1}}, opt.SetUnique(true)})
	return err
}

func (db *Mb3MongoDB) Disconnect() error {
	return db.database.Client().Disconnect(context.TODO())
}

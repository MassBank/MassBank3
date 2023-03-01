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
	"reflect"
	"strconv"
	"time"
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
	connStr  string
	database *mongo.Database
	dirty    bool
}

func (db *Mb3MongoDB) Count() (int64, error) {
	return db.database.Collection(MB_COLLECTION).EstimatedDocumentCount(context.Background())
}

func (db *Mb3MongoDB) Reset() {
	db.database = nil
	db.dirty = true
}

func (db *Mb3MongoDB) DropAllRecords() error {
	if err := db.database.Drop(context.Background()); err != nil {
		return err
	}
	return db.init()
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
	var bsonResult bson.M
	err := db.database.Collection(MB_COLLECTION).FindOne(context.Background(), bson.D{{"accession", s}}).Decode(&bsonResult)
	if err != nil {
		return nil, err
	}
	mb, err := ummarshal2Massbank(err, &bsonResult)
	if err != nil {
		return nil, err
	}

	return mb, err
}

func ummarshal2Massbank(err error, value *bson.M) (*massbank.Massbank, error) {
	var mb massbank.Massbank
	b, err := bson.Marshal(value)
	if err != nil {
		return nil, err
	}
	if err = bson.Unmarshal(b, &mb); err != nil {
		return nil, err
	}

	if mb.Deprecated != nil && reflect.DeepEqual(*mb.Deprecated, massbank.RecordDeprecated{}) {
		mb.Deprecated = nil
	}
	if mb.Project != nil && reflect.DeepEqual(*mb.Project, massbank.RecordProject{}) {
		mb.Project = nil
	}
	if mb.Peak.Annotation != nil && reflect.DeepEqual(*mb.Peak.Annotation, massbank.PkAnnotation{}) {
		mb.Peak.Annotation = nil
	}
	if mb.Species.Name.String == "" {
		mb.Species.Name = nil
	}
	if mb.Species.Lineage.Value == nil {
		mb.Species.Lineage = nil
	}
	if mb.Publication.String == "" {
		mb.Publication = nil
	}
	if mb.Copyright.String == "" {
		mb.Copyright = nil
	}
	return &mb, err
}

func (db *Mb3MongoDB) GetRecords(filters Filters, limit uint64, offset uint64) ([]*massbank.Massbank, error) {
	if db.database == nil {
		return nil, errors.New("database not ready")
	}
	cur, err := db.database.Collection("massbank").Find(context.Background(), bson.D{}, options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)))
	if err != nil {
		return nil, err
	}
	var bsonResult []bson.M
	if err := cur.All(context.Background(), &bsonResult); err != nil {
		return nil, err
	}
	var mbResult = []*massbank.Massbank{}
	for _, val := range bsonResult {
		mb, err := ummarshal2Massbank(err, &val)
		if err != nil {
			return nil, err
		}
		mbResult = append(mbResult, mb)
	}
	return mbResult, nil
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
	if config.Database != MongoDB {
		return nil, errors.New("database type must be Postgres")
	}
	if len(config.DbName) < 1 ||
		len(config.DbConnStr) < 1 &&
			(len(config.DbHost) < 1 ||
				config.DbPort == 0 ||
				config.DbPort > uint(^uint16(0))) {
		return nil, errors.New("database name, host and port not in config, but DbConnStr is also empty")
	}
	if len(config.DbConnStr) > 0 {
		log.Print("Using connection string for database connection, ignoring other values")
	}
	return &Mb3MongoDB{
		user:     config.DbUser,
		pwd:      config.DbPwd,
		host:     config.DbHost,
		dbname:   config.DbName,
		port:     uint16(config.DbPort),
		connStr:  config.DbConnStr,
		database: nil,
		dirty:    true,
	}, nil
}

func (db *Mb3MongoDB) Connect() error {
	timeout, _ := time.ParseDuration("200ms")
	ctx := context.Background()
	if db.dirty && db.database != nil {
		err := db.database.Client().Disconnect(ctx)
		if err != nil {
			log.Println("Database connection probably not closed: " + err.Error())
		}
		db.database = nil
	}
	if db.database == nil {
		var err error
		var dbclient *mongo.Client
		if len(db.connStr) > 0 {
			if dbclient, err = mongo.Connect(ctx, options.Client().ApplyURI(db.connStr).SetConnectTimeout(timeout)); err != nil {
				return err
			}
		} else {

			clOptions := options.Client().SetAuth(options.Credential{
				AuthMechanism:           "SCRAM-SHA-256",
				AuthMechanismProperties: nil,
				AuthSource:              "admin",
				Username:                db.user,
				Password:                db.pwd,
				PasswordSet:             true,
			}).SetAppName("Massbank3API").SetHosts([]string{db.host + ":" + strconv.FormatInt(int64(db.port), 10)}).SetConnectTimeout(timeout).SetTLSConfig(nil)
			if dbclient, err = mongo.Connect(ctx, clOptions); err != nil {
				return err
			}
		}
		mongoDb := dbclient.Database(db.dbname)
		if err != nil {
			return err
		}
		db.database = mongoDb
		db.dirty = false
	}
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	if err := db.database.Client().Ping(ctx, nil); err != nil {
		db.database = nil
		return err
	}
	return db.init()
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
	if db.database == nil {
		return errors.New("Database not connected")
	}
	err := db.database.Client().Disconnect(context.TODO())
	db.database = nil
	return err
}

package database

import (
	"context"
	"errors"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	bson2 "gopkg.in/mgo.v2/bson"

	"log"
	"reflect"
	"strconv"
	"time"
)

// Mb3MongoDB represents a mongodb connection and should implement [MB3Database]
type Mb3MongoDB struct {
	user     string          // user name for database
	pwd      string          // password for database
	host     string          // host name of database connection
	dbname   string          // database name
	port     uint16          // port number
	connStr  string          // connection string for a mongodb database
	database *mongo.Database // handle to the database
	dirty    bool            // if true, the database connection was changed and the database will reconnect.
}

func (db *Mb3MongoDB) GetUniqueValues(filters Filters) (MB3Values, error) {
	var query = `
[
    { "$facet": {
        "InstrumentType": [
            {
                "$group": {
                    "_id": "$acquisition.instrumenttype",
                    "Count": {"$sum": 1}
                },
            },
            {
                "$project": {
                    "_id": 0,
                    "Val": "$_id",
                    "Count": 1
                }
            },
			{
				"$sort": {
					"Val": 1
				}
            }
        ],
        "IonMode": [
            {
                "$unwind": "$acquisition.massspectrometry"
            },
            {
                "$redact": {
                    "$cond": {
                        "if": {"$eq": ["$acquisition.massspectrometry.key", "ION_MODE"]},
                        "then": "$$KEEP",
                        "else": "$$PRUNE"
                    }
                }
            },
            {
                "$group": {
                    "_id": "$acquisition.massspectrometry.value",
                    "Count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "Val": "$_id",
                    "Count": 1
                }
            },
			{
				"$sort": {
					"Val": 1
				}
            }
        ],
        "MSType": [
            {
                "$unwind": "$acquisition.massspectrometry"
            },
            {
                "$redact": {
                    "$cond": {
                        "if": {"$eq": ["$acquisition.massspectrometry.key", "MS_TYPE"]},
                        "then": "$$KEEP",
                        "else": "$$PRUNE"
                    }
                }
            },
            {
                "$group": {
                    "_id": "$acquisition.massspectrometry.value",
                    "Count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "Val": "$_id",
                    "Count": 1
                }
            },
			{
				"$sort": {
					"Val": 1
				}
            }
        ]    ,

        "Intensity": [
            { "$unwind": "$peak.peak.intensity"},
    {
        "$group": {
            "_id": null,
            "Max": {"$max": "$peak.peak.intensity"},
            "Min": {"$min": "$peak.peak.intensity"}

        }
    },
            {
                "$project": {"_id":0}
            }
        ],
            "Peak": [
                { "$unwind": "$peak.peak.mz"},
                {
                    "$group": {
                        "_id": null,
                        "Max": {"$max": "$peak.peak.mz"},
                        "Min": {"$min": "$peak.peak.mz"}

                    }
                },
                            {
                "$project": {"_id":0}
            }
            ],
            "Mass": [
                {
                    "$group": {
                        "_id": null,
                        "Min": {"$max": "$compound.mass"},
                        "Max": {"$min": "$compound.mass"}

                    }
                },
                {
                    "$project": {"_id":0}
                }
            ]
        }
    }
    ]`
	var result MB3Values
	var bdoc interface{}
	if err := bson2.UnmarshalJSON([]byte(query), &bdoc); err != nil {
		return result, err
	}
	cur, err := db.database.Collection(mbCollection).Aggregate(context.Background(), bdoc)
	if err != nil {
		return result, err
	}
	var temp = make([]bson.D, 0)
	if err = cur.All(context.Background(), &temp); err != nil {
		return result, err
	}
	doc, err := bson.Marshal(temp[0])
	if err != nil {
		return result, err
	}
	type MB3ValuesTemp struct {
		InstrumentType []MBCountValues
		MSType         []MBCountValues
		IonMode        []MBCountValues
		Intensity      []MBMinMaxValues
		Mass           []MBMinMaxValues
		Peak           []MBMinMaxValues
	}
	var tempV MB3ValuesTemp
	err = bson.Unmarshal(doc, &tempV)
	result = MB3Values{
		InstrumentType: tempV.InstrumentType,
		MSType:         tempV.MSType,
		IonMode:        tempV.IonMode,
		Intensity:      tempV.Intensity[0],
		Mass:           tempV.Mass[0],
		Peak:           tempV.Peak[0],
	}
	return result, err
}

// collection names
const (
	mbCollection        = "massbank"
	mbMetaCollection    = "mb_metadata"
	MongoConnectTimeout = "200ms"
)

// NewMongoDB creates a mongodb database handle implementing [MB3Database] from the configuration.
// It does test the connection or connect to the database. This should be done by [Connect()].
//
// Returns an error if the connection data is not valid.
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
		log.Println("Using connection string for database connection, ignoring other values")
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

// Connect see [MB3Database.Connect]
func (db *Mb3MongoDB) Connect() error {
	timeout, _ := time.ParseDuration(MongoConnectTimeout)
	ctx := context.Background()
	if db.dirty && db.database != nil {
		err := db.database.Client().Disconnect(ctx)
		if err != nil {
			return err
		}
		db.database = nil
	}
	if db.database == nil {
		var err error
		var dbClient *mongo.Client
		if len(db.connStr) > 0 {
			if dbClient, err = mongo.Connect(ctx, options.Client().ApplyURI(db.connStr).SetConnectTimeout(timeout)); err != nil {
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
			}).SetAppName("MassBank3API").SetHosts([]string{db.host + ":" + strconv.FormatInt(int64(db.port), 10)}).SetConnectTimeout(timeout).SetTLSConfig(nil)
			if dbClient, err = mongo.Connect(ctx, clOptions); err != nil {
				return err
			}
		}
		mongoDb := dbClient.Database(db.dbname)
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

// Disconnect see [MB3Database.Disconnect]
func (db *Mb3MongoDB) Disconnect() error {
	if db.database == nil {
		return errors.New("database not connected")
	}
	err := db.database.Client().Disconnect(context.Background())
	db.database = nil
	return err
}

// Count see [MB3Database.Count]
func (db *Mb3MongoDB) Count() (int64, error) {
	return db.database.Collection(mbCollection).EstimatedDocumentCount(context.Background())
}

// DropAllRecords see [MB3Database.DropAllRecords]
func (db *Mb3MongoDB) DropAllRecords() error {
	if err := db.database.Drop(context.Background()); err != nil {
		return err
	}
	return db.init()
}

// GetRecord see [MB3Database.GetRecord]
func (db *Mb3MongoDB) GetRecord(s *string) (*massbank.Massbank, error) {
	var bsonResult bson.M
	err := db.database.Collection(mbCollection).FindOne(context.Background(), bson.D{{"accession", s}}).Decode(&bsonResult)
	if err != nil {
		return nil, err
	}
	mb, err := unmarshal2Massbank(err, &bsonResult)
	if err != nil {
		return nil, err
	}
	return mb, err
}

// GetRecords see [MB3Database.GetRecords]
func (db *Mb3MongoDB) GetRecords(
	filters Filters,
	limit uint64,
	offset uint64,
) ([]*massbank.Massbank, error) {
	if db.database == nil {
		return nil, errors.New("database not ready")
	}
	cur, err := db.database.Collection(mbCollection).Find(context.Background(), bson.D{}, options.Find().SetLimit(int64(limit)).SetSkip(int64(offset)))
	if err != nil {
		return nil, err
	}
	var bsonResult []bson.M
	if err := cur.All(context.Background(), &bsonResult); err != nil {
		return nil, err
	}
	var mbResult = []*massbank.Massbank{}
	for _, val := range bsonResult {
		mb, err := unmarshal2Massbank(err, &val)
		if err != nil {
			return nil, err
		}
		mbResult = append(mbResult, mb)
	}
	return mbResult, nil
}

// UpdateMetadata see [MB3Database.UpdateMetadata]
func (db *Mb3MongoDB) UpdateMetadata(meta *massbank.MbMetaData) (string, error) {
	if db.database == nil {
		return "", errors.New("database not ready")
	}
	var res bson.M
	err := db.database.Collection(mbMetaCollection).FindOne(context.Background(), bson.D{{"commit", meta.Commit}, {"timestamp", meta.Timestamp}}, options.FindOne().SetProjection(bson.D{{"_id", 1}})).Decode(&res)
	if err != nil {
		iRes, err := db.database.Collection(mbMetaCollection).InsertOne(context.Background(), meta)
		if err != nil {
			return "", err
		}
		return iRes.InsertedID.(primitive.ObjectID).Hex(), nil

	}
	return res["_id"].(primitive.ObjectID).Hex(), nil
}

// AddRecord see [MB3Database.AddRecord]
func (db *Mb3MongoDB) AddRecord(record *massbank.Massbank, metadataId string) error {
	if db.database == nil {
		return errors.New("database not ready")
	}
	record.Metadata.VersionRef = massbank.MbReference(metadataId)
	_, err := db.database.Collection(mbCollection).InsertOne(context.Background(), *record)
	if err != nil {
		return err
	}
	return nil
}

// AddRecords see [MB3Database.AddRecords]
func (db *Mb3MongoDB) AddRecords(records []*massbank.Massbank, metadataId string) error {
	if db.database == nil {
		return errors.New("database not ready")
	}
	var recordsI = make([]interface{}, len(records))
	for i, record := range records {
		record.Metadata.VersionRef = massbank.MbReference(metadataId)
		recordsI[i] = record
	}
	_, err := db.database.Collection(mbCollection).InsertMany(context.Background(), recordsI)
	if err != nil {
		return err
	}
	return nil
}

// UpdateRecord see [MB3Database.UpdateRecord]
func (db *Mb3MongoDB) UpdateRecord(
	record *massbank.Massbank,
	metadataId string,
	upsert bool,
) (uint64, uint64, error) {
	if db.database == nil {
		return 0, 0, errors.New("database not ready")
	}
	record.Metadata.VersionRef = massbank.MbReference(metadataId)
	opt := options.ReplaceOptions{}
	res, err := db.database.Collection(mbCollection).ReplaceOne(context.Background(), bson.D{{"accession", record.Accession.String}}, record, opt.SetUpsert(upsert))
	if err != nil {
		return 0, 0, err
	}
	return uint64(res.ModifiedCount), uint64(res.UpsertedCount), nil
}

// UpdateRecords see [MB3Database.UpdateRecords]
func (db *Mb3MongoDB) UpdateRecords(
	records []*massbank.Massbank,
	metadataId string,
	upsert bool,
) (uint64, uint64, error) {
	if db.database == nil {
		return 0, 0, errors.New("database not ready")
	}
	var upserted uint64 = 0
	var modified uint64 = 0
	for _, record := range records {
		u, m, err := db.UpdateRecord(record, metadataId, upsert)
		if err != nil {
			return 0, 0, err
		}
		upserted += u
		modified += m
	}
	return upserted, modified, nil
}

func (db *Mb3MongoDB) reset() {
	db.database = nil
	db.dirty = true
}

func (db *Mb3MongoDB) init() error {
	opt := options.IndexOptions{}
	_, err := db.database.Collection(mbCollection).Indexes().CreateOne(context.Background(),
		mongo.IndexModel{Keys: bson.D{{"accession", 1}},
			Options: opt.SetName("accession_1").SetUnique(true)})
	indices := []string{
		"compound.names",
		"compound.mass",
		"compound.formula",
		"acquisition.instrumenttype",
		"acquisition.massspectrometry.ION_MODE",
		"acquisition.massspectrometry.MS_TYPE",
	}
	for _, index := range indices {
		if _, err := db.database.Collection(mbCollection).Indexes().CreateOne(
			context.Background(),
			mongo.IndexModel{Keys: bson.D{{
				index,
				1,
			}},
				Options: &options.IndexOptions{}},
		); err != nil {
			return err
		}
	}
	opt = options.IndexOptions{}
	if _, err := db.database.Collection(mbMetaCollection).Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys: bson.D{{
				"version",
				1,
			}, {
				"commit",
				1,
			}, {
				"timestamp",
				1,
			}},
			Options: opt.SetUnique(true),
		},
	); err != nil {
		return err
	}
	return err
}

func unmarshal2Massbank(err error, value *bson.M) (*massbank.Massbank, error) {
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

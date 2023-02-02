package database

import (
	"github.com/MassBank/MassBank3/pkg/massbank"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/net/context"
	"strconv"
)

const connectionURIDefault = "mongodb://massbank3:massbank3password@localhost:27017"

type Mb3MongoDB struct {
	user     string
	pwd      string
	host     string
	dbname   string
	port     uint16
	database *mongo.Database
	dirty    bool
}

func (db *Mb3MongoDB) GetRecord(s *string) (massbank.Massbank, error) {
	//TODO implement me
	panic("implement me")
}

func (db *Mb3MongoDB) GetRecords(filters Filters, limit uint64) ([]massbank.Massbank, error) {
	//TODO implement me
	panic("implement me")
}

func (db *Mb3MongoDB) AddRecords(records []massbank.Massbank) error {
	//TODO implement me
	panic("implement me")
}

func (db *Mb3MongoDB) UpdateRecords(records []massbank.Massbank, add bool) (uint64, error) {
	//TODO implement me
	panic("implement me")
}

func (db *Mb3MongoDB) AddRecord(record massbank.Massbank) error {
	//TODO implement me
	panic("implement me")
}

func (db *Mb3MongoDB) UpdateRecord(record massbank.Massbank, add bool) error {
	//TODO implement me
	panic("implement me")
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
	return db.database.Client().Ping(ctx, nil)
}

func (db *Mb3MongoDB) Disconnect() error {
	return db.database.Client().Disconnect(context.TODO())
}

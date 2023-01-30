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

func (self *Mb3MongoDB) GetRecord(s *string) (massbank.Massbank, error) {
	//TODO implement me
	panic("implement me")
}

func (self *Mb3MongoDB) GetRecords(filters Filters, limit uint64) ([]massbank.Massbank, error) {
	//TODO implement me
	panic("implement me")
}

func (self *Mb3MongoDB) AddRecords(records []massbank.Massbank) error {
	//TODO implement me
	panic("implement me")
}

func (self *Mb3MongoDB) UpdateRecords(records []massbank.Massbank, add bool) (uint64, error) {
	//TODO implement me
	panic("implement me")
}

func (self *Mb3MongoDB) AddRecord(record massbank.Massbank) error {
	//TODO implement me
	panic("implement me")
}

func (self *Mb3MongoDB) UpdateRecord(record massbank.Massbank, add bool) error {
	//TODO implement me
	panic("implement me")
}

func NewMongoDB() (*Mb3MongoDB, error) {
	return &Mb3MongoDB{
		user:     "massbank3",
		pwd:      "massbank3password",
		host:     "localhost",
		dbname:   "massbank3",
		port:     27017,
		database: nil,
		dirty:    true,
	}, nil

}

func (self *Mb3MongoDB) SetUser(user string) *Mb3MongoDB {
	self.dirty = self.dirty || user != self.user
	self.user = user
	return self
}

func (self *Mb3MongoDB) SetPassword(password string) *Mb3MongoDB {
	self.dirty = self.dirty || password != self.pwd
	self.pwd = password
	return self
}

func (self *Mb3MongoDB) SetHost(host string) *Mb3MongoDB {
	self.dirty = self.dirty || host != self.host
	self.host = host
	return self
}

func (self *Mb3MongoDB) SetDbName(dbname string) *Mb3MongoDB {
	self.dirty = self.dirty || dbname == self.dbname
	self.dbname = dbname
	return self
}

func (self *Mb3MongoDB) SetPort(port uint16) *Mb3MongoDB {
	self.dirty = self.dirty || port == self.port
	self.port = port
	return self
}

func (self *Mb3MongoDB) Connect() error {
	ctx := context.TODO()
	if self.dirty && self.database != nil {
		self.database.Client().Disconnect(ctx)
		self.database = nil
	}
	if self.database == nil {
		clOptions := options.Client().SetAuth(options.Credential{
			AuthMechanism:           "SCRAM-SHA-256",
			AuthMechanismProperties: nil,
			AuthSource:              "admin",
			Username:                self.user,
			Password:                self.pwd,
			PasswordSet:             true,
		}).SetAppName("Massbank3API").SetHosts([]string{self.host + ":" + strconv.FormatInt(int64(self.port), 10)})
		dbclient, err := mongo.Connect(ctx, clOptions)
		db := dbclient.Database(self.dbname)
		if err != nil {
			return err
		}
		self.database = db
		self.dirty = false
	}
	return self.database.Client().Ping(ctx, nil)
}

func (self *Mb3MongoDB) Disconnect() error {
	return self.database.Client().Disconnect(context.TODO())
}

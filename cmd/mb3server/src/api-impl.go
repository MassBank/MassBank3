package mb3server

import (
	"github.com/MassBank/MassBank3/pkg/database"
	"github.com/MassBank/MassBank3/pkg/massbank"
	"log"
	"os"
)

var db database.MB3Database = nil

func initDB() error {
	if db == nil {
		var mongo_uri = os.Getenv("MONGO_URI")
		var mongo_name = os.Getenv("MONGO_DB_NAME")
		log.Println("MongoDB URI: ", mongo_uri)
		log.Println("Database_Name", mongo_name)
		var err error = nil
		var config = database.DBConfig{
			Database:  database.MongoDB,
			DbUser:    "",
			DbPwd:     "",
			DbHost:    "",
			DbName:    os.Getenv("MONGO_DB_NAME"),
			DbPort:    0,
			DbConnStr: os.Getenv("MONGO_URI"),
		}

		db, err = database.NewMongoDB(config)
		if err != nil {
			return err
		}
		err = db.Connect()
		if err != nil {
			return err
		}
	}
	err := db.Ping()
	if err != nil {
		db = nil
	}
	return err

}

func GetBrowseOptions() (*BrowseOptions, error) {
	if err := initDB(); err != nil {
		return nil, err
	}
	vals, err := db.GetUniqueValues(database.Filters{})
	if err != nil {
		return nil, err
	}
	var result = BrowseOptions{}
	result.Metadata = Metadata{
		Version:       "",
		Timestamp:     "",
		GitCommit:     "",
		SpectraCount:  0,
		CompoundCount: 0,
		IsomerCount:   0,
		ResultCount:   0,
		Page:          0,
		Limit:         0,
	}
	for _, val := range vals.IonMode {
		result.IonMode = append(result.IonMode, StringCountInner{
			Value: val.Val,
			Count: int32(val.Count),
		})
	}
	for _, val := range vals.MSType {
		result.MsType = append(result.MsType, StringCountInner{
			Value: val.Val,
			Count: int32(val.Count),
		})
	}
	for _, val := range vals.InstrumentType {
		result.InstrumentType = append(result.InstrumentType, StringCountInner{
			Value: val.Val,
			Count: int32(val.Count),
		})
	}
	for _, val := range vals.Contributor {
		result.Contributor = append(result.Contributor, StringCountInner{
			Value: val.Val,
			Count: int32(val.Count),
		})
	}

	return &result, nil
}

func GetRecords(limit int32, page int32, contributor string, instrumentType []string, msType []string, ionMode string) (*SearchResult, error) {
	if limit <= 0 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}

	msTypeLokal := &[]massbank.MsType{}
	for _, t := range msType {
		switch t {
		case "MS":
			*msTypeLokal = append(*msTypeLokal, massbank.MS)
		case "MS2":
			*msTypeLokal = append(*msTypeLokal, massbank.MS2)
		case "MS3":
			*msTypeLokal = append(*msTypeLokal, massbank.MS3)
		case "MS4":
			*msTypeLokal = append(*msTypeLokal, massbank.MS4)
		}
	}

	if len(*msTypeLokal) == 0 {
		msTypeLokal = nil
	}

	var ionModeLokal massbank.IonMode = massbank.ANY
	switch ionMode {
	case "POSITIVE":
		ionModeLokal = massbank.POSITIVE
	case "NEGATIVE":
		ionModeLokal = massbank.NEGATIVE
	}
	log.Println(ionModeLokal)
	it := &instrumentType
	if len(*it) == 0 || (len(*it) == 1 && (*it)[0] == "") {
		it = nil
	}

	var offset = (page - 1) * limit
	if err := initDB(); err != nil {
		return nil, err
	}

	var filters = database.Filters{
		InstrumentType:  it,
		Splash:          "",
		MsType:          msTypeLokal,
		IonMode:         ionModeLokal,
		CompoundName:    "",
		Mass:            nil,
		MassEpsilon:     nil,
		Formula:         "",
		Peaks:           nil,
		PeakDifferences: nil,
		InchiKey:        "",
		Contributor:     contributor,
		IntensityCutoff: nil,
		Limit:           int64(limit),
		Offset:          int64(offset),
	}
	records, count, err := db.GetRecords(filters)
	if err != nil {
		return nil, err
	}
	var result = SearchResult{}
	for _, record := range records {
		var val = SearchResultDataInner{
			Data:    map[string]interface{}{},
			Name:    record.Compound.Names[0].String,
			Formula: record.Compound.Formula.String,
			Mass:    record.Compound.Mass.Value,
			Smiles:  record.Compound.Smiles.String,
			Spectra: []SearchResultDataInnerSpectraInner{{record.RecordTitle.String, record.Accession.String}},
		}
		result.Data = append(result.Data, val)
	}
	result.Metadata.ResultCount = int32(count)
	return &result, nil
}

func GetRecord(accession string) (*MbRecord, error) {
	if err := initDB(); err != nil {
		return nil, err
	}
	record, err := db.GetRecord(&accession)
	if err != nil {
		return nil, err
	}
	result := MbRecord{
		Accession:  record.Accession.String,
		Deprecated: MbRecordDeprecated{},
		Title:      record.RecordTitle.String,
		Date: MbRecordDate{
			Updated:  record.Date.Updated.String(),
			Created:  record.Date.Created.String(),
			Modified: record.Date.Modified.String(),
		},
		Authors:     nil,
		License:     record.License.String,
		Copyright:   "",
		Publication: "",
		Project:     "",
		Comments:    nil,
		Compound: MbRecordCompound{
			Names:     nil,
			Classes:   nil,
			Formula:   record.Compound.Formula.String,
			CdkDepict: nil,
			Mass:      record.Compound.Mass.Value,
			Smiles:    record.Compound.Smiles.String,
			Inchi:     record.Compound.Inchi.String,
			Link:      nil,
		},
		Species: MbRecordSpecies{
			Name:    "",
			Lineage: nil,
			Link:    nil,
			Sample:  nil,
		},
		Acquisition: MbRecordAcquisition{
			Instrument:     record.Acquisition.Instrument.String,
			InstrumentType: record.Acquisition.InstrumentType.String,
			MassSpectrometry: AcMassSpec{
				MsType:  "",
				IonMode: "",
				Subtags: nil,
			},
			Chromatography: nil,
			General:        nil,
			IonMobility:    nil,
		},
		MassSpectrometry: MbRecordMassSpectrometry{
			FocusedIon:     nil,
			DataProcessing: nil,
		},
		Peak: MbRecordPeak{
			Splash: record.Peak.Splash.String,
			Annotation: MbRecordPeakAnnotation{
				Header: nil,
				Values: nil,
			},
			NumPeak: int32(record.Peak.NumPeak.Value),
			Peak: MbRecordPeakPeak{
				Header: nil,
				Values: nil,
			},
		},
	}
	for _, author := range record.Authors.Value {
		result.Authors = append(result.Authors, AuthorsInner{
			Name:        author.Name,
			MarcRelator: author.MarcRelator,
		})
	}
	return &result, nil

}

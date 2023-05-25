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
		var mongoUri = os.Getenv("MONGO_URI")
		var mongoName = os.Getenv("MONGO_DB_NAME")
		log.Println("MongoDB URI: ", mongoUri)
		log.Println("Database_Name", mongoName)
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

func GetBrowseOptions(instrumentTyoe []string, msType []string, ionMode string, contributor []string) (*BrowseOptions, error) {
	if err := initDB(); err != nil {
		return nil, err
	}
	it := &instrumentTyoe
	if len(*it) == 0 || (len(*it) == 1 && (*it)[0] == "") {
		it = nil
	}
	co := &contributor
	if len(*co) == 0 || (len(*co) == 1 && (*co)[0] == "") {
		co = nil
	}
	filters := database.Filters{
		InstrumentType:    it,
		Splash:            "",
		MsType:            getMsTypes(msType),
		IonMode:           getIonMode(ionMode),
		CompoundName:      "",
		Mass:              nil,
		MassEpsilon:       nil,
		Formula:           "",
		Peaks:             nil,
		PeakDifferences:   nil,
		InchiKey:          "",
		Contributor:       co,
		IntensityCutoff:   nil,
		Limit:             0,
		Offset:            0,
		IncludeDeprecated: false,
	}
	vals, err := db.GetUniqueValues(filters)
	if err != nil {
		return nil, err
	}
	var result = BrowseOptions{}
	metadata, err := db.GetMetaData()
	println(metadata)
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

func GetRecords(limit int32, page int32, contributor []string, instrumentType []string, msType []string, ionMode string) (*SearchResult, error) {
	if limit <= 0 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}

	it := &instrumentType
	if len(*it) == 0 || (len(*it) == 1 && (*it)[0] == "") {
		it = nil
	}
	co := &contributor
	if len(*co) == 0 || (len(*co) == 1 && (*co)[0] == "") {
		co = nil
	}

	var offset = (page - 1) * limit
	if err := initDB(); err != nil {
		return nil, err
	}

	var filters = database.Filters{
		InstrumentType:    it,
		Splash:            "",
		MsType:            getMsTypes(msType),
		IonMode:           getIonMode(ionMode),
		CompoundName:      "",
		Mass:              nil,
		MassEpsilon:       nil,
		Formula:           "",
		Peaks:             nil,
		PeakDifferences:   nil,
		InchiKey:          "",
		Contributor:       co,
		IntensityCutoff:   nil,
		Limit:             int64(limit),
		Offset:            int64(offset),
		IncludeDeprecated: false,
	}
	records, count, err := db.GetRecords(filters)
	if err != nil {
		return nil, err
	}
	var result = SearchResult{}
	for _, record := range records {
		var val = SearchResultDataInner{
			Data:    map[string]interface{}{},
			Name:    (*record.Compound.Names)[0],
			Formula: *record.Compound.Formula,
			Mass:    *record.Compound.Mass,
			Smiles:  *record.Compound.Smiles,
			Spectra: []SearchResultDataInnerSpectraInner{{*record.RecordTitle, *record.Accession}},
		}
		result.Data = append(result.Data, val)
	}
	result.Metadata.ResultCount = int32(count)
	return &result, nil
}

func getIonMode(ionMode string) massbank.IonMode {
	switch ionMode {
	case "POSITIVE":
		return massbank.POSITIVE
	case "NEGATIVE":
		return massbank.NEGATIVE
	}
	return massbank.ANY
}

func getMsTypes(msType []string) *[]massbank.MsType {
	result := &[]massbank.MsType{}
	for _, t := range msType {
		switch t {
		case "MS":
			*result = append(*result, massbank.MS)
		case "MS2":
			*result = append(*result, massbank.MS2)
		case "MS3":
			*result = append(*result, massbank.MS3)
		case "MS4":
			*result = append(*result, massbank.MS4)
		}
	}

	if len(*result) == 0 {
		result = nil
	}
	return result
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
		Accession:  *record.Accession,
		Deprecated: MbRecordDeprecated{},
		Title:      *record.RecordTitle,
		Date: MbRecordDate{
			Updated:  record.Date.Updated.String(),
			Created:  record.Date.Created.String(),
			Modified: record.Date.Modified.String(),
		},
		Authors:     nil,
		License:     *record.License,
		Copyright:   "",
		Publication: "",
		Project:     "",
		Comments:    nil,
		Compound: MbRecordCompound{
			Names:     nil,
			Classes:   nil,
			Formula:   *record.Compound.Formula,
			CdkDepict: nil,
			Mass:      *record.Compound.Mass,
			Smiles:    *record.Compound.Smiles,
			Inchi:     *record.Compound.InChI,
			Link:      nil,
		},
		Species: MbRecordSpecies{
			Name:    "",
			Lineage: nil,
			Link:    nil,
			Sample:  nil,
		},
		Acquisition: MbRecordAcquisition{
			Instrument:     *record.Acquisition.Instrument,
			InstrumentType: *record.Acquisition.InstrumentType,
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
			Splash: *record.Peak.Splash,
			Annotation: MbRecordPeakAnnotation{
				Header: nil,
				Values: nil,
			},
			NumPeak: int32(*record.Peak.NumPeak),
			Peak: MbRecordPeakPeak{
				Header: nil,
				Values: nil,
			},
		},
	}
	for _, author := range *record.Authors {
		result.Authors = append(result.Authors, AuthorsInner{
			Name:        author.Name,
			MarcRelator: author.MarcRelator,
		})
	}
	return &result, nil

}

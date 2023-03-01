package database

import (
	"github.com/MassBank/MassBank3/pkg/massbank"
	"time"
)

var TestDbConfigs = map[string]DBConfig{
	"pg valid": {
		Database:  Postgres,
		DbUser:    "mbtestuser",
		DbPwd:     "mbtestpwd",
		DbHost:    "testpostgres",
		DbName:    "mbtestdb",
		DbPort:    5432,
		DbConnStr: "",
	},
	"pg wrong host": {
		Database:  Postgres,
		DbUser:    "mbtestuser",
		DbPwd:     "mbtestpwd",
		DbHost:    "wronghost",
		DbName:    "mbtestdb",
		DbPort:    5432,
		DbConnStr: "",
	},
	"pg valid conn string": {
		Database:  Postgres,
		DbUser:    "",
		DbPwd:     "",
		DbHost:    "",
		DbName:    "",
		DbPort:    0,
		DbConnStr: "host=testpostgres port=5432 user=mbtestuser password=mbtestpwd dbname=mbtestdb sslmode=disable",
	},
	"pg empty": {
		Database: Postgres,
	},
	"pg only host": {
		Database: Postgres,
		DbHost:   "wronghost",
	},
	"mg valid": {
		Database:  MongoDB,
		DbUser:    "mbtestuser",
		DbPwd:     "mbtestpwd",
		DbHost:    "testmongo",
		DbName:    "mbtestdb",
		DbPort:    27017,
		DbConnStr: "",
	},
	"mg empty": {
		Database: MongoDB,
	},
	"mg wrong host": {
		Database:  MongoDB,
		DbUser:    "mbtestuser",
		DbPwd:     "mbtestpwd",
		DbHost:    "wronghost",
		DbName:    "mbtestdb",
		DbPort:    27017,
		DbConnStr: "",
	},
	"mg valid conn string": {
		Database:  MongoDB,
		DbConnStr: "mongodb://mbtestuser:mbtestpwd@testmongo:27017",
		DbName:    "mbtestdb",
	},
	"mg conn string ": {
		Database:  MongoDB,
		DbConnStr: "mongodb://mbtestuser:mbtestpwd@testmongo:27017",
	},
}

type DbInitSet int

const (
	All DbInitSet = iota
	Main
)

var TestDatabases = map[string]MB3Database{
	"pg valid": &PostgresSQLDB{
		user:       "mbtestuser",
		dbname:     "mbtestdb",
		password:   "mbtestpwd",
		host:       "testpostgres",
		port:       5432,
		connString: "host=testpostgres port=5432 user=mbtestuser password=mbtestpwd dbname=mbtestdb sslmode=disable",
		database:   nil,
	},
	"pg wrong host": &PostgresSQLDB{
		user:       "mbtestuser",
		dbname:     "mbtestdb",
		password:   "mbtestpwd",
		host:       "wronghost",
		port:       5432,
		connString: "host=wronghost port=5432 user=mbtestuser password=mbtestpwd dbname=mbtestdb sslmode=disable",
		database:   nil,
	},
	"pg valid conn string": &PostgresSQLDB{
		user:       "",
		dbname:     "",
		password:   "",
		host:       "",
		port:       0,
		connString: "host=testpostgres port=5432 user=mbtestuser password=mbtestpwd dbname=mbtestdb sslmode=disable",
		database:   nil,
	},
	"mg valid": &Mb3MongoDB{
		user:     "mbtestuser",
		pwd:      "mbtestpwd",
		host:     "testmongo",
		dbname:   "mbtestdb",
		port:     27017,
		database: nil,
		dirty:    true,
	},
	"mg wrong host": &Mb3MongoDB{
		user:     "mbtestuser",
		pwd:      "mbtestpwd",
		host:     "wronghost",
		dbname:   "mbtestdb",
		port:     27017,
		database: nil,
		dirty:    true,
	},
	"mg valid conn string": &Mb3MongoDB{
		connStr: "mongodb://mbtestuser:mbtestpwd@testmongo:27017",
		dbname:  "mbtestdb",
	},
}

func parseTimeWoErr(timeStr string) time.Time {
	t, _ := time.Parse(time.RFC3339, timeStr)
	return t
}

var mbTestRecords = map[string]massbank.Massbank{
	"MSBNK-AAFC-AC000005": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/AAFC/MSBNK-AAFC-AC000005.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-AAFC-AC000005",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "Mellein; LC-ESI-ITFT; MS2; CE: 50; R=17500; [M+H]+",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2017-07-07T00:00:00Z"),
			Created:         parseTimeWoErr("2017-07-07T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Justin B. Renaud",
					MarcRelator: "",
				},
				{
					Name:        " Mark W. Sumarah",
					MarcRelator: "",
				},
				{
					Name:        " Agriculture and Agri-Food Canada",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "Copyright (C) 2017",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "Renaud, J. B.; Sumarah, M. W. Data Independent Acquisition-Digital Archiving Mass Spectrometry: Application to Single Kernel Mycotoxin Analysis of Fusarium Graminearum Infected Maize. Analytical and Bioanalytical Chemistry 2016, 408 (12), 3083–91. DOI:10.1007/s00216-016-9391-5",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "isolated standard",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "CONFIDENCE",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "Mellein",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "Ochracin",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "8-hydroxy-3-methyl-3,4-dihydroisochromen-1-one",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"Natural Product",
					"Fungal metabolite",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C10H10O3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           178.062990,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "CC1CC2=C(C(=CC=C2)O)C(=O)O1",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "KWILGNNWGSNMPA-UHFFFAOYSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "17397-85-2",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:28516",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "26529",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KNAPSACK",
						Identifier:      "C00000550",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "COMPTOX",
						Identifier:      "DTXSID60891794",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    ([]*massbank.SpLink)(nil),
			Sample:  ([]*massbank.SampleInformation)(nil),
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "Q-Exactive Orbitrap Thermo Scientific",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-ITFT",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "3.9 kV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION_VOLTAGE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "HCD",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "50(NCE)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "17500",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RESOLUTION",
					},
				},
			},
			Chromatography: []*massbank.AcChromatography{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Agilent RRHD Eclipse 50 x 2 mm, 1.8 uM",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "100:0 at 0 min, 100:0 at 0.5 min, 0:100 at 3.5 min, 0:100 at 5.5 min, 100:0 at 7 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "0.3 mL min-1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "3.44",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "1094",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "NAPS_RTI",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A H2O 0.1% FA",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "B ACN 0.1% FA",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
			},
			General: ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "133.0643",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "179.0697",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M+H]+",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: []*massbank.MsDataProcessing{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Proteowizard",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DEPROFILE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "based on Fragment ion formula determination",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "CUTOFF 0.05 Base Peak",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "INTENSITY",
					},
				},
			},
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-01q9-0900000000-f556e9b53553d12b44b5",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"tentative_formula",
					"mass_error(ppm)",
				},
				Values: map[string][]interface{}{
					"m/z": {
						105.069800,
						115.054000,
						133.064300,
						151.074700,
						161.058900,
						179.069600,
					},
					"mass_error(ppm)": {
						-0.840000,
						-2.050000,
						-3.740000,
						-4.370000,
						-5.020000,
						-3.740000,
					},
					"tentative_formula": {
						"C8H9+",
						"C9H7+",
						"C9H9O1+",
						"C9H11O2+",
						"C10H9O2+",
						"C10H11O3+",
					},
				},
			},
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           6,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					105.0698,
					115.054,
					133.0643,
					151.0747,
					161.0589,
					179.0696,
				},
				Intensity: []float64{
					1513707.125,
					134276.65625,
					3576966.75,
					143513.875,
					2536772.25,
					204606.65625,
				},
				Rel: []uint{
					422,
					36,
					999,
					39,
					708,
					56,
				},
			},
		},
	},
	"MSBNK-Athens_Univ-AU229201": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/Athens_Univ/MSBNK-Athens_Univ-AU229201.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-Athens_Univ-AU229201",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "2-Amino-3,8-dimethylimidazo-[4,5-f]quinoxaline (MeIQx); LC-ESI-QTOF; MS2; CE: 10 eV; R=35000; [M+H]+",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2019-04-05T00:00:00Z"),
			Created:         parseTimeWoErr("2019-04-05T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Nikiforos Alygizakis",
					MarcRelator: "",
				},
				{
					Name:        " Katerina Galani",
					MarcRelator: "",
				},
				{
					Name:        " Nikolaos Thomaidis",
					MarcRelator: "",
				},
				{
					Name:        " University of Athens",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "Copyright (C) 2019 Department of Chemistry, University of Athens",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: nil,
		Project:     nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "standard compound",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "CONFIDENCE",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "2292",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "INTERNAL_ID",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "2-Amino-3,8-dimethylimidazo-[4,5-f]quinoxaline (MeIQx)",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "MeIQx",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "3,8-dimethylimidazo[4,5-f]quinoxalin-2-amine",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"N/A",
					"Environmental Standard",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C11H11N5",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           213.1014454,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "CN1C(N)=NC2=C1C=CC1=NC=C(C)N=C21",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C11H11N5/c1-6-5-13-7-3-4-8-10(9(7)14-6)15-11(12)16(8)2/h3-5H,1-2H3,(H2,12,15)",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "77500-04-0",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEBI",
						Identifier:      "76604",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KEGG",
						Identifier:      "C19255",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:62275",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "DVCCCQNKIYNAKB-UHFFFAOYSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "56076",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "COMPTOX",
						Identifier:      "DTXSID1020801",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    nil,
			Sample:  nil,
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "Bruker maXis Impact",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-QTOF",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "CID",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "10 eV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "35000",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RESOLUTION",
					},
				},
			},
			Chromatography: []*massbank.AcChromatography{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Acclaim RSLC C18 2.2um, 2.1x100mm, Thermo",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "99/1 at 0-1 min, 61/39 at 3 min, 0.1/99.9 at 14-16 min, 99/1 at 16.1-20 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "200 uL/min at 0-3 min, 400 uL/min at 14 min, 480 uL/min at 16-19 min, 200 uL/min at 19.1-20 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "4.075 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A 90:10 water:methanol with 0.01% formic acid and 5mM ammonium formate",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "B methanol with 0.01% formic acid and 5mM ammonium formate",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
			},
			General: ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "214.1081",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "214.1087",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M+H]+",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: []*massbank.MsDataProcessing{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "identity on assigned fragments and MS1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "RMassBank 2.10.0",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "WHOLE",
					},
				},
			},
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-03di-0090000000-4ca5f2773c0d659574ef",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"tentative_formula",
					"formula_count",
					"mass",
					"error(ppm)",
				},
				Values: map[string][]interface{}{
					"error(ppm)": {
						-1.22,
						-7.78,
						-13.6,
					},
					"formula_count": {
						1,
						1,
						1,
					},
					"m/z": {
						214.1085,
						215.111,
						216.113,
					},
					"mass": {
						214.1087,
						215.1126,
						216.116,
					},
					"tentative_formula": {
						"C11H12N5+",
						"C10[13]CH12N5+",
						"C9[13]C2H12N5+",
					},
				},
			},
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           3,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					214.1085,
					215.111,
					216.113,
				},
				Intensity: []float64{
					2303864,
					289484,
					16528,
				},
				Rel: []uint{
					999,
					125,
					7,
				},
			},
		},
	},
	"MSBNK-Eawag-EA018353": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/Eawag/MSBNK-Eawag-EA018353.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-Eawag-EA018353",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "Sulfadimethoxine; LC-ESI-ITFT; MS2; CE: 30%; R=7500; [M-H]-",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2014-01-14T00:00:00Z"),
			Created:         parseTimeWoErr("2014-01-14T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Stravs M",
					MarcRelator: "",
				},
				{
					Name:        " Schymanski E",
					MarcRelator: "",
				},
				{
					Name:        " Singer H",
					MarcRelator: "",
				},
				{
					Name:        " Department of Environmental Chemistry",
					MarcRelator: "",
				},
				{
					Name:        " Eawag",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "Copyright (C) 2012 Eawag, Duebendorf, Switzerland",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: nil,
		Project:     nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "standard compound",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "CONFIDENCE",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "EAWAG_UCHEM_ID 183",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "Sulfadimethoxine",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "4-amino-N-(2,6-dimethoxy-4-pyrimidinyl)benzenesulfonamide",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"N/A",
					"Environmental Standard",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C12H14N4O4S",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           310.0736,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "c1(NS(c2ccc(N)cc2)(=O)=O)cc(nc(n1)OC)OC",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C12H14N4O4S/c1-19-11-7-10(14-12(15-11)20-2)16-21(17,18)9-5-3-8(13)4-6-9/h3-7H,13H2,1-2H3,(H,14,15,16)",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "122-11-2",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEBI",
						Identifier:      "32161",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KEGG",
						Identifier:      "D01142",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:5323",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "ZZORFUFYDOWNEF-UHFFFAOYSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "5132",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "COMPTOX",
						Identifier:      "DTXSID1023607",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    nil,
			Sample:  nil,
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "LTQ Orbitrap XL Thermo Scientific",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-ITFT",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "HCD",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "30 % (nominal)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "7500",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RESOLUTION",
					},
				},
			},
			Chromatography: []*massbank.AcChromatography{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "XBridge C18 3.5um, 2.1x50mm, Waters",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "90/10 at 0 min, 50/50 at 4 min, 5/95 at 17 min, 5/95 at 25 min, 90/10 at 25.1 min, 90/10 at 30 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "200 ul/min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "5.7 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A water with 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "B methanol with 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
			},
			General: ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "309.0653",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "309.0663",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M-H]-",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: []*massbank.MsDataProcessing{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Spline",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DEPROFILE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "loess on assigned fragments and MS1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Peaks with additional N2/O included",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "REANALYZE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "RMassBank 1.3.1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "WHOLE",
					},
				},
			},
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-0a4i-0009000000-ccda245feefab7d2bd86",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"tentative_formula",
					"formula_count",
					"mass",
					"error(ppm)",
				},
				Values: map[string][]interface{}{
					"error(ppm)": {
						3.3,
						0.09,
						-2.23,
						-0.94,
					},
					"formula_count": {
						2,
						1,
						1,
						1,
					},
					"m/z": {
						174.0679,
						195.0234,
						230.0804,
						309.066,
					},
					"mass": {
						174.0673,
						195.0234,
						230.0809,
						309.0663,
					},
					"tentative_formula": {
						"C9H8N3O-",
						"C8H7N2O2S-",
						"C11H10N4O2-",
						"C12H13N4O4S-",
					},
				},
			},
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           4,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					174.0679,
					195.0234,
					230.0804,
					309.0660,
				},
				Intensity: []float64{
					3134.2,
					4236.3,
					10982,
					805229.1,
				},
				Rel: []uint{
					3,
					5,
					13,
					999,
				},
			},
		},
	},
	"MSBNK-Eawag_Additional_Specs-ET060401": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/Eawag_Additional_Specs/MSBNK-Eawag_Additional_Specs-ET060401.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-Eawag_Additional_Specs-ET060401",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "FEN_246.1101_16.1; LC-ESI-QFT; MS2; CE: 15; R=17500; [M+H]+",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2016-03-17T00:00:00Z"),
			Created:         parseTimeWoErr("2015-09-25T00:00:00Z"),
			Modified:        parseTimeWoErr("2016-02-03T00:00:00Z"),
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "R. Gulde",
					MarcRelator: "",
				},
				{
					Name:        " E. Schymanski",
					MarcRelator: "",
				},
				{
					Name:        " K. Fenner",
					MarcRelator: "",
				},
				{
					Name:        " Department of Environmental Chemistry",
					MarcRelator: "",
				},
				{
					Name:        " Eawag",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "Copyright (C) 2016 Eawag, Duebendorf, Switzerland",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "Gulde, R.; Meier, U.; Schymanski, E. L.; Kohler, H.-P. E.; Helbling, D. E.; Derrer, S.; Rentsch, D.; Fenner, K. Systematic Exploration of Biotransformation Reactions of Amine-Containing Micropollutants in Activated Sludge. Environmental Science \u0026 Technology 2016, 50 (6), 2908–20. DOI:10.1021/acs.est.5b05186",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "Tentative identification: most likely structure (Level 3)",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "CONFIDENCE",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "604",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "INTERNAL_ID",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "FEN_246.1101_16.1",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "N-desethyl-N-acetylfeniramine",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "N-[1-[3-(trifluoromethyl)phenyl]propan-2-yl]acetamide",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"N/A",
					"Environmental Transformation Products",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C12H14F3NO",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           245.102700,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "CC(CC1=CC(=CC=C1)C(F)(F)F)NC(C)=O",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C12H14F3NO/c1-8(16-9(2)17)6-10-4-3-5-11(7-10)12(13,14)15/h3-5,7-8H,6H2,1-2H3,(H,16,17)",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "40552-64-5",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:38514",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "ZVKARXLKNIBGIR-UHFFFAOYSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "35298",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "COMPTOX",
						Identifier:      "DTXSID30891589",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    nil,
			Sample:  nil,
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "Q Exactive Plus Orbitrap Thermo Scientific",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-QFT",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "HCD",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "15 (nominal)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "17500",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RESOLUTION",
					},
				},
			},
			Chromatography: []*massbank.AcChromatography{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Atlantis T3 3um, 3.0x150mm, Waters with guard column",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "95/5 at 0 min, 5/95 at 15 min, 5/95 at 20 min, 95/5 at 20.1 min, 95/5 at 25 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "300 uL/min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "15.8 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A water with 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "B methanol with 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
			},
			General: ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "65.0597",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "246.11",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M+H]+",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: []*massbank.MsDataProcessing{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "loess on assigned fragments and MS1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Peaks with additional N2/O included",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "REANALYZE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "RMassBank 1.99.7",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "WHOLE",
					},
				},
			},
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-052s-1940000000-a515d02f980838cad28d",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"tentative_formula",
					"formula_count",
					"mass",
					"error(ppm)",
				},
				Values: map[string][]interface{}{
					"error(ppm)": {
						0.830000,
						0.070000,
						-4.770000,
						-2.400000,
						-2.010000,
						0.180000,
						0.740000,
						0.750000,
					},
					"formula_count": {
						1,
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					},
					"m/z": {
						60.0444,
						60.0808,
						123.1162,
						141.0006,
						158.0272,
						159.0416,
						187.073,
						246.1102,
					},
					"mass": {
						60.0444,
						60.0808,
						123.1168,
						141.0009,
						158.0275,
						159.0416,
						187.0729,
						246.11,
					},
					"tentative_formula": {
						"C2H6NO+",
						"C3H10N+",
						"C9H15+",
						"C9FN+",
						"C9H3FN2+",
						"C8H6F3+",
						"C10H10F3+",
						"C12H15F3NO+",
					},
				},
			},
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           9,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					60.0444,
					60.0808,
					123.1162,
					141.0006,
					158.0272,
					159.0416,
					187.073,
					214.0897,
					246.1102,
				},
				Intensity: []float64{
					17595.5,
					1571.7,
					990.3,
					4683.9,
					14370,
					43520.4,
					97124.8,
					13043.94434,
					75456.7,
				},
				Rel: []uint{
					180,
					16,
					10,
					48,
					147,
					447,
					999,
					134,
					776,
				},
			},
		},
	},
	"MSBNK-Fac_Eng_Univ_Tokyo-JP009132": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/Fac_Eng_Univ_Tokyo/MSBNK-Fac_Eng_Univ_Tokyo-JP009132.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-Fac_Eng_Univ_Tokyo-JP009132",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "METHYL PHENYL SULFIDE; EI-B; MS",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2016-01-19T00:00:00Z"),
			Created:         parseTimeWoErr("2008-10-21T00:00:00Z"),
			Modified:        parseTimeWoErr("2011-05-06T00:00:00Z"),
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "SODA AROMATIC CO.",
					MarcRelator: "",
				},
				{
					Name:        " LTD.",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-NC-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright:   nil,
		Publication: nil,
		Project:     nil,
		Comments:    ([]*massbank.RecordComment)(nil),
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "METHYL PHENYL SULFIDE",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"N/A",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C7H8S",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           124.034670,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "CSc(c1)cccc1",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C7H8S/c1-8-7-5-3-2-4-6-7/h2-6H,1H3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "HNKJADCVZUBCPG-UHFFFAOYSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "COMPTOX",
						Identifier:      "DTXSID8059217",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    nil,
			Sample:  nil,
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "HITACHI M-80B",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "EI-B",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "70 eV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION_ENERGY",
					},
				},
			},
			Chromatography: ([]*massbank.AcChromatography)(nil),
			General:        ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M]+*",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_TYPE",
					},
				},
			},
			DataProcessing: ([]*massbank.MsDataProcessing)(nil),
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-0fk9-9500000000-e5cde2928e0b7e33c1cc",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: nil,
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           43,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					15.000000,
					26.000000,
					27.000000,
					37.000000,
					38.000000,
					39.000000,
					45.000000,
					46.000000,
					47.000000,
					49.000000,
					50.000000,
					51.000000,
					52.000000,
					57.000000,
					58.000000,
					61.000000,
					62.000000,
					63.000000,
					65.000000,
					66.000000,
					69.000000,
					70.000000,
					71.000000,
					73.000000,
					74.000000,
					75.000000,
					76.000000,
					77.000000,
					78.000000,
					79.000000,
					81.000000,
					82.000000,
					83.000000,
					91.000000,
					92.000000,
					108.000000,
					109.000000,
					110.000000,
					111.000000,
					123.000000,
					124.000000,
					125.000000,
					126.000000,
				},
				Intensity: []float64{
					5.68, 1.26, 3.11, 1.85, 4.41, 19.29, 28.64, 7.9, 5.09, 1.39, 18.14, 34.82, 3.18, 2.3, 2.04, 1.25, 6.11, 6.12, 22.52, 1.38, 14.67, 1.15, 1.48, 1.16, 6.23, 2.84, 1.81, 12.7, 42.96, 6.05, 2.1, 5.12, 1.61, 31.68, 2.02, 5.64, 46.38, 3.12, 1.97, 8.22, 99.99, 8.31, 4.82,
				},
				Rel: []uint{
					57,
					13,
					31,
					19,
					44,
					193,
					286,
					79,
					51,
					14,
					181,
					348,
					32,
					23,
					20,
					13,
					61,
					61,
					225,
					14,
					147,
					12,
					15,
					12,
					62,
					28,
					18,
					127,
					430,
					61,
					21,
					51,
					16,
					317,
					20,
					56,
					464,
					31,
					20,
					82,
					999,
					83,
					48,
				},
			},
		},
	},
	"MSBNK-Keio_Univ-KO009105": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/Keio_Univ/MSBNK-Keio_Univ-KO009105.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-Keio_Univ-KO009105",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "Desthiobiotin; LC-ESI-IT; MS4; m/z: 215/197/179; [M+H]+",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2012-10-22T00:00:00Z"),
			Created:         parseTimeWoErr("2008-05-12T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Ojima Y",
					MarcRelator: "",
				},
				{
					Name:        " Kakazu Y",
					MarcRelator: "",
				},
				{
					Name:        " Horai H",
					MarcRelator: "",
				},
				{
					Name:        " Soga T",
					MarcRelator: "",
				},
				{
					Name:        " Institute for Advanced Biosciences",
					MarcRelator: "",
				},
				{
					Name:        " Keio Univ.",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-NC-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright:   nil,
		Publication: nil,
		Project:     nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "KEIO_ID D075",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "[MS3] KO009104",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "Desthiobiotin",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "Dethiobiotin",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"N/A",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C10H18N2O3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           214.131740,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "OC(=O)CCCCCC(N1)C(C)NC(=O)1",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C10H18N2O3/c1-7-8(12-10(15)11-7)5-3-2-4-6-9(13)14/h7-8H,2-6H2,1H3,(H,13,14)(H2,11,12,15)/t7-,8+/m0/s1",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "533-48-2",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEBI",
						Identifier:      "16691",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KEGG",
						Identifier:      "C01909",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "NIKKAJI",
						Identifier:      "J9.406D",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "SID:5017",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "AUTOLBMXDDTRRT-JGVFFNPUSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "COMPTOX",
						Identifier:      "DTXSID50876136",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    ([]*massbank.SpLink)(nil),
			Sample:  ([]*massbank.SampleInformation)(nil),
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "LC/MSD Trap XCT, Agilent Technologies",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-IT",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS4",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "0.70/0.70/0.60",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
			},
			Chromatography: ([]*massbank.AcChromatography)(nil),
			General:        ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "215/197/179",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M+H]+",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: []*massbank.MsDataProcessing{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "LC/MSD Trap Control and Data Analysis",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "WHOLE",
					},
				},
			},
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-000j-5900000000-8ad8423e2b359b500863",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: nil,
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           33,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					56.2,
					58.2,
					67.2,
					68.2,
					70.2,
					76.7,
					79.2,
					80.0,
					81.1,
					82.0,
					85.0,
					91.1,
					93.1,
					94.0,
					95.1,
					96.1,
					99.1,
					108.1,
					109.1,
					110.1,
					111.0,
					113.1,
					119.1,
					123.1,
					125.1,
					134.1,
					136.1,
					137.1,
					151.1,
					162.0,
					179.1,
					180.1,
					197.2,
				},
				Intensity: []float64{
					7.30,
					8.10,
					66.36,
					1.80,
					6.70,
					4.90,
					14.00,
					2.60,
					64.28,
					18.49,
					3.00,
					10.00,
					49.50,
					6.69,
					28.99,
					10.20,
					342.46,
					6.60,
					33.39,
					12.19,
					41.20,
					17.90,
					180.85,
					11.40,
					12.89,
					52.21,
					498.25,
					13.29,
					142.24,
					3.90,
					39.87,
					54.97,
					2.20,
				},
				Rel: []uint{
					15,
					16,
					133,
					4,
					13,
					10,
					28,
					5,
					129,
					37,
					6,
					20,
					99,
					13,
					58,
					20,
					687,
					13,
					67,
					24,
					83,
					36,
					363,
					23,
					26,
					105,
					999,
					27,
					285,
					8,
					80,
					110,
					4,
				},
			},
		},
	},
	"MSBNK-MSSJ-MSJ00284": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/MSSJ/MSBNK-MSSJ-MSJ00284.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-MSSJ-MSJ00284",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "Pentoxazone; ESI-QTOF; MS2; NEGATIVE; [M-H]-; CID; 60 V",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2020-03-18T00:00:00Z"),
			Created:         parseTimeWoErr("2020-03-18T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Atsushi Yamamoto",
					MarcRelator: "",
				},
				{
					Name:        " Faculty of Environmental Studies",
					MarcRelator: "",
				},
				{
					Name:        " Tottori University of Environmental Studies",
					MarcRelator: "",
				},
				{
					Name:        " 1-1",
					MarcRelator: "",
				},
				{
					Name:        " Wakabadai-kita",
					MarcRelator: "",
				},
				{
					Name:        " Tottori City",
					MarcRelator: "",
				},
				{
					Name:        " Tottori 689-1111",
					MarcRelator: "",
				},
				{
					Name:        " Japan.",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "Atsushi Yamamoto, Faculty of Environmental Studies, Tottori University of Environmental Studies, 1-1, Wakabadai-kita, Tottori City, Tottori 689-1111, Japan.",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: nil,
		Project:     nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "The sample was injected by direct infusion.",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "This record was created by the financial support of MEXT/JSPS KAKENHI Grant Number 19HP8024 to the Mass Spectrometry Society of Japan.",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "Pentoxazone",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"Non-natural product",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C17H17ClFNO4",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           353.083000,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "CC(=C1C(=O)N(C(=O)O1)c2cc(c(cc2F)Cl)OC3CCCC3)C",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C17H17ClFNO4/c1-9(2)15-16(21)20(17(22)24-15)13-8-14(11(18)7-12(13)19)23-10-5-3-4-6-10/h7-8,10H,3-6H2,1-2H3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "110956-75-7",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "9888955",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "JZPKLLLUDLHCEL-UHFFFAOYSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:11714234",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    ([]*massbank.SpLink)(nil),
			Sample:  ([]*massbank.SampleInformation)(nil),
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "X500R QTOF (AB Sciex LLC, USA)",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "ESI-QTOF",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "60 V",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "CID",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
			},
			Chromatography: ([]*massbank.AcChromatography)(nil),
			General:        ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "352.0757",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M-H]-",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: ([]*massbank.MsDataProcessing)(nil),
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-0006-9400000000-6b99aa683e8584601a75",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: nil,
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           9,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					31.9901,
					34.9691,
					41.0392,
					69.0342,
					97.0289,
					131.001,
					149.9992,
					166.9774,
					185.9761,
				},
				Intensity: []float64{
					0.02542,
					0.02094,
					0.26061,
					0.01645,
					0.02531,
					0.03766,
					0.04276,
					0.04392,
					0.03962,
				},
				Rel: []uint{
					97,
					80,
					999,
					63,
					97,
					144,
					164,
					168,
					152,
				},
			},
		},
	},
	"MSBNK-RIKEN-PR100978": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/RIKEN/MSBNK-RIKEN-PR100978.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-RIKEN-PR100978",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "Quercetin-3-Glucuronide; LC-ESI-QTOF; MS2; CE:Ramp 5-60 V; [M-H]-",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2016-01-19T00:00:00Z"),
			Created:         parseTimeWoErr("2010-06-21T00:00:00Z"),
			Modified:        parseTimeWoErr("2011-05-06T00:00:00Z"),
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Matsuda F",
					MarcRelator: "",
				},
				{
					Name:        " Suzuki M",
					MarcRelator: "",
				},
				{
					Name:        " Sawada Y",
					MarcRelator: "",
				},
				{
					Name:        " Plant Science Center",
					MarcRelator: "",
				},
				{
					Name:        " RIKEN.",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright:   nil,
		Publication: nil,
		Project:     nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "Acquisition and generation of the data is financially supported in part by CREST/JST.",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "Quercetin-3-Glucuronide",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "Quer-3-GlcA",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "Miquelianin",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "Querciturone",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"Flavonoid",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C21H18O13",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           478.074740,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "OC(=O)C(O1)C(O)C(O)C(O)C1OC(C(=O)3)=C(Oc(c4)c(c(O)cc(O)4)3)c(c2)cc(O)c(O)c2",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C21H18O13/c22-7-4-10(25)12-11(5-7)32-17(6-1-2-8(23)9(24)3-6)18(13(12)26)33-21-16(29)14(27)15(28)19(34-21)20(30)31/h1-5,14-16,19,21-25,27-29H,(H,30,31)/t14-,15-,16+,19-,21+/m0/s1",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "22688-79-5",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "4438874",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KNAPSACK",
						Identifier:      "C00005376",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:5274585",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "DUBCCGAQYVUYEU-ZUGPOPFOSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "COMPTOX",
						Identifier:      "DTXSID70945358",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    ([]*massbank.SpLink)(nil),
			Sample:  ([]*massbank.SampleInformation)(nil),
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "UPLC Q-Tof Premier, Waters",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-QTOF",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Ramp 5-60 V",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Continuum",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DATAFORMAT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "600.0 L/Hr",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DESOLVATION_GAS_FLOW",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "400 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DESOLVATION_TEMPERATURE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "LOW-ENERGY CID",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "120 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOURCE_TEMPERATURE",
					},
				},
			},
			Chromatography: []*massbank.AcChromatography{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "3.0 kV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "CAPILLARY_VOLTAGE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "23.0 V",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SAMPLING_CONE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A CH3CN(0.1%HCOOH)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "B H2O(0.1%HCOOH)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
			},
			General: ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "477.06692",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M-H]-",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: ([]*massbank.MsDataProcessing)(nil),
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-0udi-0609400000-9fd50528da25d66adfc7",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: nil,
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           11,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					107.0143,
					109.0299,
					121.0298,
					151.0035,
					163.0036,
					178.9989,
					255.0311,
					301.0353,
					302.0432,
					477.0669,
					478.0759,
				},
				Intensity: []float64{
					370.8,
					267.7,
					395.4,
					1650,
					295.2,
					793.8,
					333.3,
					4687,
					386,
					2215,
					237.5,
				},
				Rel: []uint{
					79,
					57,
					84,
					352,
					63,
					169,
					71,
					999,
					82,
					472,
					51,
				},
			},
		},
	},
	"MSBNK-RIKEN-PR309089": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/RIKEN/MSBNK-RIKEN-PR309089.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-RIKEN-PR309089",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "FA 18:2+1O; LC-ESI-QTOF; MS2",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2019-03-28T00:00:00Z"),
			Created:         parseTimeWoErr("2019-03-28T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Tetsuya Mori",
					MarcRelator: "",
				},
				{
					Name:        " Center for Sustainable Resource Science",
					MarcRelator: "",
				},
				{
					Name:        " RIKEN",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-NC-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: nil,
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "Tsugawa H., Nakabayashi R., Mori T., Yamada Y., Takahashi M., Rai A., Sugiyama R., Yamamoto H., Nakaya T., Yamazaki M., Kooke R., Bac-Molenaar JA., Oztolan-Erol N., Keurentjes JJB., Arita M., Saito K. (2019) \"A cheminformatics approach to characterize metabolomes in stable-isotope-labeled organisms\" Nature Methods 16(4):295-298. [doi:10.1038/s41592-019-0358-2]",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "Annotation level-3",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "FA 18:2+1O",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"Oxidized fatty acids",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C18H32O3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           296.451000,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "O=C(O)CCCCCCCC=CC=CC(O)CCCCC",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C18H32O3/c1-2-3-11-14-17(19)15-12-9-7-5-4-6-8-10-13-16-18(20)21/h7,9,12,15,17,19H,2-6,8,10-11,13-14,16H2,1H3,(H,20,21)",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "HNICUWMFWZBIFP-UHFFFAOYSA-N",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    ([]*massbank.SpLink)(nil),
			Sample:  ([]*massbank.SampleInformation)(nil),
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "LC, Waters Acquity UPLC System; MS, Waters Xevo G2 Q-Tof",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-QTOF",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "6V",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "800/h",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DESOLVATION_GAS_FLOW",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "450 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DESOLVATION_TEMPERATURE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
			},
			Chromatography: []*massbank.AcChromatography{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "+3.00 kV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "CAPILLARY_VOLTAGE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Acquity bridged ethyl hybrid C18 (1.7 um, 2.1 mm * 100 mm, Waters)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "40 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_TEMPERATURE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A/B = (99.5%/0.5% at 0 min, 99.5%/0.5% at 0.1 min, 20%/80% at 10 min, 0.5%/99.5% at 10.1 min, 0.5%/99.5% at 12.0 min, 99.5%/0.5% at 12.1 min, 99.5%/0.5% at 15.0 min)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "0.3 ml/min at 0 min, 0.3 ml/min at 10 min, 0.4 ml/min at 10.1 min, 0.4 ml/min at 14.4 min, 0.3 ml/min at 14.5 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "9.57",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A water including 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "B acetonitrile including 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
			},
			General: ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M-H]-",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "295.2272",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
			},
			DataProcessing: ([]*massbank.MsDataProcessing)(nil),
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-0002-0090000000-3b4035f10b24d4c3f5a0",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: nil,
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           11,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					57.08413,
					113.09826,
					172.09279,
					177.12296,
					195.13672,
					196.14641,
					197.18631,
					223.43452,
					233.15977,
					277.21619,
					295.22772,
				},
				Intensity: []float64{
					18.0,
					20.0,
					24.0,
					20.0,
					59.0,
					20.0,
					20.0,
					29.0,
					19.0,
					272.0,
					1553.0,
				},
				Rel: []uint{
					12,
					13,
					15,
					13,
					38,
					13,
					13,
					19,
					12,
					175,
					999,
				},
			},
		},
	},
	"MSBNK-Washington_State_Univ-BML81902": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank-data/Washington_State_Univ/MSBNK-Washington_State_Univ-BML81902.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-Washington_State_Univ-BML81902",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "Parthenolide; LC-APCI-QTOF; MS; POSITIVE",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2016-01-19T00:00:00Z"),
			Created:         parseTimeWoErr("2012-10-26T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Cuthbertson DJ",
					MarcRelator: "",
				},
				{
					Name:        " Johnson SR",
					MarcRelator: "",
				},
				{
					Name:        " Lange BM",
					MarcRelator: "",
				},
				{
					Name:        " Institute of Biological Chemistry",
					MarcRelator: "",
				},
				{
					Name:        " Washington State University",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright:   nil,
		Publication: nil,
		Project:     nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "relative retention time with respect to 9-anthracene Carboxylic Acid is 1.002",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "Parthenolide",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"N/A",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C15H20O3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           248.141245,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "C/C/1=C\\CC[C@@]2([C@@H](O2)[C@@H]3[C@@H](CC1)C(=C)C(=O)O3)C",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C15H20O3/c1-9-5-4-8-15(3)13(18-15)12-11(7-6-9)10(2)14(16)17-12/h5,11-13H,2,4,6-8H2,1,3H3/b9-5+/t11-,12-,13-,15+/m0/s1",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "20554-84-1",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "4554343",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:6473881",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "KTEXNACQROZXEV-SLXBATTESA-N",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    ([]*massbank.SpLink)(nil),
			Sample:  ([]*massbank.SampleInformation)(nil),
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "Agilent 1200 RRLC; Agilent 6520 QTOF",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-APCI-QTOF",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "m/z 100-1000",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SCANNING",
					},
				},
			},
			Chromatography: []*massbank.AcChromatography{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Agilent C8 Cartridge Column 2.1X30mm 3.5 micron (guard); Agilent SB-Aq 2.1x50mm 1.8 micron (analytical)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "60 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_TEMPERATURE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "linear from 98A/2B at 0 min to 2A/98B at 13 min, hold 6 min at 2A/98B, reequilibration 98A/2B (5 min)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "0.6 ml/min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "7.394",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A water with 0.2% acetic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "B methanol with 0.2% acetic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
			},
			General: ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon:     ([]*massbank.MsFocusedIon)(nil),
			DataProcessing: ([]*massbank.MsDataProcessing)(nil),
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-0002-0090000000-b81b1903703b01f61d7d",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: nil,
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           1,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					249.1484765,
				},
				Intensity: []float64{
					310073.000000,
				},
				Rel: []uint{
					999,
				},
			},
		},
	},
	"MSBNK-test-TST00001": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank3/test-data/MSBNK-test-TST00001.txt",
			VersionRef: "63f50065841fc1dec65402fe",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-test-TST00001",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "Fiscalin C; LC-ESI-ITFT; MS2; CE: 30; R=17500; [M+H]+",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2017-07-07T00:00:00Z"),
			Created:         parseTimeWoErr("2017-07-07T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Megan J. Kelman",
					MarcRelator: "",
				},
				{
					Name:        " Justin B. Renaud",
					MarcRelator: "",
				},
				{
					Name:        " Mark W. Sumarah",
					MarcRelator: "",
				},
				{
					Name:        " Agriculture and Agri-Food Canada",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright:   nil,
		Publication: nil,
		Project:     nil,
		Comments:    ([]*massbank.RecordComment)(nil),
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "Fiscalin C",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"Natural Product",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C27H29N5O4",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           487.221940,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "CC(C)[C@H]1C2=NC3=CC=CC=C3C(=O)N2[C@@H](C(=O)N1)C[C@@]4([C@@H]5NC(C(=O)N5C6=CC=CC=C64)(C)C)O",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C27H29N5O4/c1-14(2)20-21-28-17-11-7-5-9-15(17)23(34)31(21)19(22(33)29-20)13-27(36)16-10-6-8-12-18(16)32-24(27)30-26(3,4)25(32)35/h5-12,14,19-20,24,30,36H,13H2,1-4H3,(H,29,33)/t19-,20+,24-,27-/m1/s1",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: ([]*massbank.ChLink)(nil),
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    ([]*massbank.SpLink)(nil),
			Sample:  ([]*massbank.SampleInformation)(nil),
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "Q-Exactive Orbitrap Thermo Scientific",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-ITFT",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
			},
			Chromatography: ([]*massbank.AcChromatography)(nil),
			General:        ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon:     ([]*massbank.MsFocusedIon)(nil),
			DataProcessing: ([]*massbank.MsDataProcessing)(nil),
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-03di-0290000000-8035e4fe85235c78b955",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: nil,
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           3,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					185.1073,
					213.1022,
					258.1237,
				},
				Intensity: []float64{
					73653728.0,
					235010720.0,
					52446636.0,
				},
				Rel: []uint{
					312,
					999,
					222,
				},
			},
		},
	},
	"MSBNK-test-TST00002": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank3/test-data/MSBNK-test-TST00002.txt",
			VersionRef: "63f50065841fc1dec65402fe",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-test-TST00002",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: nil,
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "Disialoganglioside GD1a; MALDI-TOF; MS; Pos",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2016-01-19T00:00:00Z"),
			Created:         parseTimeWoErr("2009-11-24T00:00:00Z"),
			Modified:        parseTimeWoErr("2011-05-11T00:00:00Z"),
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Wada Y",
					MarcRelator: "",
				},
				{
					Name:        " Osaka Medical Center for Maternal and Child Health",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "Copyright (C) 2019 just a test",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "Beisken S et al (2014) Scientific Data, 1:140029, DOI:10.1038/sdata.2014.29. http://www.ebi.ac.uk/metabolights/MTBLS38",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "my test project",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "[Chemical] The ceramide part has 38 carbons and 1 double bond (38:1), but its structure cannot be decided.  The displaying structure is GD1a d18:1-20:0.",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "Profile spectrum of this record is given as a JPEG file.",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "MCH00001.jpg",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "[Profile]",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "Disialoganglioside GD1a",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				{
					StringProperty: massbank.StringProperty{
						String:          "another name",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"Natural Product, Glycolipid",
					"Ceramide",
					"Ganglioside",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C86H152N4O39",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           1865.003370,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "CCCCCCCCCCCCCCCCCCCC(=O)N[C@@H](CO[C@H]1[C@@H]([C@H]([C@@H]([C@H](O1)CO)O[C@H]2[C@@H]([C@H]([C@H]([C@H](O2)CO)O[C@H]3[C@@H]([C@H]([C@H]([C@H](O3)CO)O)O[C@H]4[C@@H]([C@H]([C@H]([C@H](O4)CO)O)O[C@@]5(C[C@@H]([C@H]([C@@H](O5)C([C@@H](CO)O)O)NC(=O)C)O)C(=O)O)O)NC(=O)C)O[C@@]6(C[C@@H]([C@H]([C@@H](O6)C([C@@H](CO)O)O)NC(=O)C)O)C(=O)O)O)O)O)[C@@H](/C=C/CCCCCCCCCCCCC)O",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C86H152N4O39/c1-6-8-10-12-14-16-18-20-21-22-23-25-27-29-31-33-35-37-60(105)90-50(51(100)36-34-32-30-28-26-24-19-17-15-13-11-9-7-2)46-118-80-69(111)68(110)72(58(44-95)121-80)123-82-71(113)78(129-86(84(116)117)39-53(102)62(88-48(4)98)76(127-86)65(107)55(104)41-92)73(59(45-96)122-82)124-79-63(89-49(5)99)74(66(108)56(42-93)119-79)125-81-70(112)77(67(109)57(43-94)120-81)128-85(83(114)115)38-52(101)61(87-47(3)97)75(126-85)64(106)54(103)40-91/h34,36,50-59,61-82,91-96,100-104,106-113H,6-33,35,37-46H2,1-5H3,(H,87,97)(H,88,98)(H,89,99)(H,90,105)(H,114,115)(H,116,117)/b36-34+/t50-,51+,52-,53-,54+,55+,56+,57+,58+,59+,61+,62+,63+,64?,65?,66-,67-,68+,69+,70+,71+,72+,73-,74+,75+,76+,77-,78+,79-,80+,81-,82-,85-,86-/m0/s1",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "UPMLUBZFFWELOX-IOFMCULOSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:137628549",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "Bos taurus",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.SpLineageElement{
					{
						StringProperty: massbank.StringProperty{
							String:          "cellular organisms",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Eukaryota",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Fungi/Metazoa group",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Metazoa",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Eumetazoa",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Bilateria",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Coelomata",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Deuterostomia",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Chordata",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Craniata",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Vertebrata",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Gnathostomata",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Teleostomi",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Euteleostomi",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Sarcopterygii",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Tetrapoda",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Amniota",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Mammalia",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Theria",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Eutheria",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Laurasiatheria",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Cetartiodactyla",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Ruminantia",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Pecora",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Bovidae",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Bovinae",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
					{
						StringProperty: massbank.StringProperty{
							String:          "Bos",
							DefaultProperty: massbank.DefaultProperty{},
						},
					},
				},
			},
			Link: []*massbank.SpLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "NCBI-TAXONOMY",
						Identifier:      "9913",
					},
				},
			},
			Sample: []*massbank.SampleInformation{
				{
					StringProperty: massbank.StringProperty{
						String:          "brain",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "Voyager DE-PRO, Applied Biosystems",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "MALDI-TOF",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "UV 337 nm nitrogen lazer, 20 Hz, 10 nsec",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "LASER",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "DHB",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MATRIX",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "500 pmol",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SAMPLE_DRIPPING",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[MS, MS:1003294, electron activated dissociation, ]",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "15 eV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "KINETIC_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "6500 nA",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ELECTRON_CURRENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "65 ms",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "REACTION_TIME",
					},
				},
			},
			Chromatography: []*massbank.AcChromatography{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Acclaim RSLC C18 2.2um, 2.1x100mm, Thermo",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "99/1 at 0-1 min, 61/39 at 3 min, 0.1/99.9 at 14-16 min, 99/1 at 16.1-20 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "200 uL/min at 0-3 min, 400 uL/min at 14 min, 480 uL/min at 16-19 min, 200 uL/min at 19.1-20 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "5.680 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A 90:10 water:methanol with 0.01% formic acid and 5mM ammonium formate",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "B methanol with 0.01% formic acid and 5mM ammonium formate",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
			},
			General: ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "324.2092",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "324.207",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M+H]+",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: []*massbank.MsDataProcessing{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "identity on assigned fragments and MS1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "RMassBank 1.99.10",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "WHOLE",
					},
				},
			},
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-03dr-0000010098-a1f70871442a6d6662d3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"ion",
				},
				Values: map[string][]interface{}{
					"ion": {
						"[LH-2NeuAc+Na]+",
						"[M-2NeuAc+Na]+",
						"[M-NeuAc+Na]+",
						"[LH+Na]+",
						"[LH+K]+",
						"[LH-H+2Na]+",
						"[M+Na]+",
						"[LH-H+K+Na]+",
						"[M+K]+",
						"[M-H+2Na]+",
						"[LH-2H+K+2Na]+",
						"[M-H+K+Na]+",
						"[M-2H+3Na]+",
						"[M-2H+K+2Na]+",
					},
					"m/z": {
						1278.120000,
						1306.210000,
						1597.120000,
						1860.160000,
						1876.140000,
						1882.180000,
						1888.200000,
						1898.150000,
						1904.190000,
						1910.210000,
						1920.180000,
						1926.200000,
						1932.220000,
						1948.240000,
					},
				},
			},
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           84,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					1278.12, 1279.11, 1279.18, 1306.21, 1309.13, 1366.03, 1375.23, 1527.60, 1569.08, 1591.14, 1595.21, 1597.12, 1598.11, 1599.07, 1620.30, 1620.80, 1621.18, 1843.21, 1860.16, 1861.17, 1862.18, 1863.19, 1864.22, 1866.26, 1867.23, 1871.18, 1876.14, 1877.14, 1878.13, 1879.19, 1882.18, 1883.18, 1884.18, 1885.20, 1886.19, 1888.20, 1889.21, 1890.21, 1891.22, 1892.24, 1893.23, 1894.24, 1895.21, 1897.14, 1898.15, 1899.16, 1900.17, 1902.16, 1903.20, 1904.19, 1905.20, 1906.20, 1907.23, 1908.19, 1910.21, 1911.21, 1912.21, 1913.22, 1914.21, 1915.20, 1920.18, 1921.21, 1922.19, 1926.20, 1927.19, 1928.20, 1929.21, 1930.20, 1931.32, 1932.22, 1933.23, 1934.23, 1935.22, 1943.20, 1948.24, 1949.22, 1950.22, 1960.26, 1965.23, 1971.32, 2064.29, 2091.32, 2092.30, 2136.33,
				},
				Intensity: []float64{
					205.000000,
					177.000000,
					186.000000,
					242.000000,
					168.000000,
					162.000000,
					291.000000,
					181.000000,
					187.000000,
					198.000000,
					177.000000,
					261.000000,
					228.000000,
					185.000000,
					272.000000,
					266.000000,
					367.000000,
					198.000000,
					905.000000,
					822.000000,
					531.000000,
					284.000000,
					219.000000,
					183.000000,
					162.000000,
					168.000000,
					297.000000,
					280.000000,
					192.000000,
					165.000000,
					497.000000,
					545.000000,
					349.000000,
					242.000000,
					181.000000,
					1311.000000,
					1127.000000,
					844.000000,
					413.000000,
					240.000000,
					185.000000,
					175.000000,
					146.000000,
					165.000000,
					320.000000,
					260.000000,
					218.000000,
					191.000000,
					188.000000,
					574.000000,
					509.000000,
					383.000000,
					222.000000,
					186.000000,
					795.000000,
					674.000000,
					478.000000,
					264.000000,
					194.000000,
					187.000000,
					284.000000,
					215.000000,
					179.000000,
					368.000000,
					363.000000,
					254.000000,
					207.000000,
					187.000000,
					170.000000,
					532.000000,
					495.000000,
					352.000000,
					261.000000,
					194.000000,
					274.000000,
					255.000000,
					226.000000,
					151.000000,
					185.000000,
					168.000000,
					176.000000,
					180.000000,
					206.000000,
					162.000000,
				},
				Rel: []uint{
					156,
					135,
					142,
					184,
					128,
					123,
					222,
					138,
					142,
					151,
					135,
					199,
					174,
					141,
					207,
					203,
					280,
					151,
					690,
					626,
					405,
					216,
					167,
					139,
					123,
					128,
					226,
					213,
					146,
					126,
					379,
					415,
					266,
					184,
					138,
					999,
					859,
					643,
					315,
					183,
					141,
					133,
					111,
					126,
					244,
					198,
					166,
					146,
					143,
					437,
					388,
					292,
					169,
					142,
					606,
					514,
					364,
					201,
					148,
					142,
					216,
					164,
					136,
					280,
					277,
					194,
					158,
					142,
					130,
					405,
					377,
					268,
					199,
					148,
					209,
					194,
					172,
					115,
					141,
					128,
					134,
					137,
					157,
					123,
				},
			},
		},
	},
	"MSBNK-test-TST00003": {
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/MassBank3/test-data/MSBNK-test-TST00003.txt",
			VersionRef: "63f50065841fc1dec65402fe",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "MSBNK-test-TST00003",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date:            parseTimeWoErr("2019-11-25T00:00:00Z"),
			Reason:          "Wrong MS measurement assigned",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "11-HDoHE; LC-ESI-QTOF; MS2; CE: 20.0; R=N/A; [M-H]-",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated:         parseTimeWoErr("2018-11-21T00:00:00Z"),
			Created:         parseTimeWoErr("2018-11-21T00:00:00Z"),
			Modified:        time.Time{},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			Value: []massbank.RecordAuthorName{
				{
					Name:        "Nils Hoffmann",
					MarcRelator: "",
				},
				{
					Name:        " Dominik Kopczynski",
					MarcRelator: "",
				},
				{
					Name:        " Bing Peng",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "CC BY-SA",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "Copyright (C) 2019, Leibniz Institut fuer Analytische Wissenschaften - ISAS - e.V., Dortmund, Germany",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: nil,
		Project:     nil,
		Comments: []*massbank.RecordComment{
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "standard compound",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "CONFIDENCE",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "NATIVE_RUN_ID QExHF03_NM_0001275.mzML",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
			{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "PROCESSING averaging of repeated ion fragments at 20.0 eV within 5 ppm window [MS, MS:1000575, mean of spectra, ]",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
		},
		Compound: struct {
			Names     []*massbank.ChName          "mb2:\"CH$NAME\" json:\"name\""
			Classes   *massbank.ChCompoundClasses "mb2:\"CH$COMPOUND_CLASS\" json:\"classes\""
			Formula   *massbank.ChFormula         "mb2:\"CH$FORMULA\" json:\"formula\""
			CdkDepict []*massbank.CdkDepict       "mb2:\"CH$CDK_DEPICT\" json:\"cdk-depict\""
			Mass      *massbank.ChMass            "mb2:\"CH$EXACT_MASS\" json:\"mass\""
			Smiles    *massbank.ChSmiles          "mb2:\"CH$SMILES\" json:\"smiles\""
			Inchi     *massbank.ChInchi           "mb2:\"CH$IUPAC\" json:\"inchi\""
			Link      []*massbank.ChLink          "mb2:\"CH$LINK\" optional:\"true\" json:\"link\""
		}{
			Names: []*massbank.ChName{
				{
					StringProperty: massbank.StringProperty{
						String:          "11-HDoHE",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				Value: []massbank.ChCompoundClass{
					"Natural Product",
					"Lipid Standard",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "C22H32O3",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           344.235140,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "CC\\C=C/C\\C=C/C\\C=C/CC(O)\\C=C\\C=C/C\\C=C/CCC(O)=O",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "InChI=1S/C22H32O3/c1-2-3-4-5-6-7-9-12-15-18-21(23)19-16-13-10-8-11-14-17-20-22(24)25/h3-4,6-7,10-16,19,21,23H,2,5,8-9,17-18,20H2,1H3,(H,24,25)/b4-3-,7-6-,13-10-,14-11-,15-12-,19-16+",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEBI",
						Identifier:      "CHEBI:72794",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "LIPIDMAPS",
						Identifier:      "LMFA04000028",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "LTERDCBCHFKFRI-BGKMTWLOSA-N",
					},
				},
				{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:11631564",
					},
				},
			},
		},
		Species: struct {
			Name    *massbank.SpName              "mb2:\"SP$SCIENTIFIC_NAME\" optional:\"true\""
			Lineage *massbank.SpLineage           "mb2:\"SP$LINEAGE\" optional:\"true\""
			Link    []*massbank.SpLink            "mb2:\"SP$LINK\" optional:\"true\""
			Sample  []*massbank.SampleInformation "mb2:\"SP$SAMPLE\" optional:\"true\""
		}{
			Name:    nil,
			Lineage: nil,
			Link:    ([]*massbank.SpLink)(nil),
			Sample:  ([]*massbank.SampleInformation)(nil),
		},
		Acquisition: struct {
			Instrument       *massbank.AcInstrument         "mb2:\"AC$INSTRUMENT\""
			InstrumentType   *massbank.AcInstrumentType     "mb2:\"AC$INSTRUMENT_TYPE\""
			MassSpectrometry []*massbank.AcMassSpectrometry "mb2:\"AC$MASS_SPECTROMETRY\" optional:\"true\""
			Chromatography   []*massbank.AcChromatography   "mb2:\"AC$CHROMATOGRAPHY\" optional:\"true\""
			General          []*massbank.AcGeneral          "mb2:\"AC$GENERAL\" optional:\"true\""
		}{
			Instrument: &massbank.AcInstrument{
				StringProperty: massbank.StringProperty{
					String:          "Q-Exactive HF, Thermo Scientific [MS:1002523]",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "LC-ESI-QTOF",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "HCD",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "20.0 eV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "N/A",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RESOLUTION",
					},
				},
			},
			Chromatography: ([]*massbank.AcChromatography)(nil),
			General:        ([]*massbank.AcGeneral)(nil),
		},
		MassSpectrometry: struct {
			FocusedIon     []*massbank.MsFocusedIon     "mb2:\"MS$FOCUSED_ION\" optional:\"true\""
			DataProcessing []*massbank.MsDataProcessing "mb2:\"MS$DATA_PROCESSING\" optional:\"true\""
		}{
			FocusedIon: []*massbank.MsFocusedIon{
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "343.2279",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "343.2279",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M-H]-",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
			},
			DataProcessing: ([]*massbank.MsDataProcessing)(nil),
		},
		Peak: struct {
			Splash     *massbank.PkSplash     "mb2:\"PK$SPLASH\""
			Annotation *massbank.PkAnnotation "mb2:\"PK$ANNOTATION\" optional:\"true\""
			NumPeak    *massbank.PkNumPeak    "mb2:\"PK$NUM_PEAK\""
			Peak       *massbank.PkPeak       "mb2:\"PK$PEAK\""
		}{
			Splash: &massbank.PkSplash{
				StringProperty: massbank.StringProperty{
					String:          "splash10-00dl-0914000000-bad728fe323f6890656d",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"annotation",
					"exact_mass",
					"error(ppm)",
				},
				Values: map[string][]interface{}{
					"annotation": {
						59.013, 95.050, 121.102, 149.133, 165.092, 194.095, 281.227, 299.238, 325.217, "precursor",
					},
					"error(ppm)": {
						2.913263365927882, 0.40954364535633475, 0.29031912309532387, 1.1221931248150303, 0.7078231920609128, 0.7437838072718687, -0.1356156911126373, 0.1124819597449277, -0.2673869905083813, -1.1896746249719279,
					},
					"exact_mass": {
						59.0133, 95.0502, 121.1022, 149.1333, 165.0919, 194.0946, 281.2273, 299.2378, 325.2171, 343.227868554909,
					},
					"m/z": {
						59.013471921284996, 95.0502389272054, 121.1022351582845, 149.13346735636392, 165.09201685587564, 194.09474436442056, 281.22726186116535, 299.2378336588542, 325.2170130411784, 343.22746022542316,
					},
				},
			},
			NumPeak: &massbank.PkNumPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Value:           10,
			},
			Peak: &massbank.PkPeak{
				DefaultProperty: massbank.DefaultProperty{},
				Header: []string{
					"m/z",
					"int.",
					"rel.int.",
				},
				Mz: []float64{
					59.013471921284996, 95.0502389272054, 121.1022351582845, 149.13346735636392, 165.09201685587564, 194.09474436442056, 281.22726186116535, 299.2378336588542, 325.2170130411784, 343.22746022542316,
				},
				Intensity: []float64{
					47825.663583333335, 123675.15916666668, 2119825.3000000003, 538442.9091666666, 717615.9775, 348560.26666666666, 577177.7541666667, 162688.84041666667, 246360.69083333333, 1749842.5083333335,
				},
				Rel: []uint{
					22,
					58,
					999,
					254,
					338,
					164,
					271,
					76,
					115,
					824,
				},
			},
		},
	},
}

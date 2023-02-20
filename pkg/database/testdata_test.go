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

var mbTestRecords = []*massbank.Massbank{
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/AAFC/MSBNK-AAFC-AC000005.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-AAFC-AC000005\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"Mellein; LC-ESI-ITFT; MS2; CE: 50; R=17500; [M+H]+\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63634982400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63634982400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  0,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "Justin B. Renaud",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Mark W. Sumarah",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Agriculture and Agri-Food Canada",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY-SA\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "\"Copyright (C) 2017\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "\"Renaud, J. B.; Sumarah, M. W. Data Independent Acquisition-Digital Archiving Mass Spectrometry: Application to Single Kernel Mycotoxin Analysis of Fusarium Graminearum Infected Maize. Analytical and Bioanalytical Chemistry 2016, 408 (12), 3083–91. DOI:10.1007/s00216-016-9391-5\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Mellein\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Ochracin\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"8-hydroxy-3-methyl-3,4-dihydroisochromen-1-one\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"Natural Product",
					"Fungal metabolite",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C10H10O3\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           178.062990,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"CC1CC2=C(C(=CC=C2)O)C(=O)O1\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "KWILGNNWGSNMPA-UHFFFAOYSA-N",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "17397-85-2",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:28516",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "26529",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KNAPSACK",
						Identifier:      "C00000550",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"Q-Exactive Orbitrap Thermo Scientific\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"LC-ESI-ITFT\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "3.9 kV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION_VOLTAGE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "HCD",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "50(NCE)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Agilent RRHD Eclipse 50 x 2 mm, 1.8 uM",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "100:0 at 0 min, 100:0 at 0.5 min, 0:100 at 3.5 min, 0:100 at 5.5 min, 100:0 at 7 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "0.3 mL min-1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "3.44",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "1094",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "NAPS_RTI",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A H2O 0.1% FA",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				&massbank.AcChromatography{
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
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "133.0643",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "179.0697",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				&massbank.MsFocusedIon{
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
				&massbank.MsDataProcessing{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Proteowizard",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DEPROFILE",
					},
				},
				&massbank.MsDataProcessing{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "based on Fragment ion formula determination",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				&massbank.MsDataProcessing{
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
					String:          "\"splash10-01q9-0900000000-f556e9b53553d12b44b5\"",
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
					"m/z": []interface{}{
						105.069800,
						115.054000,
						133.064300,
						151.074700,
						161.058900,
						179.069600,
					},
					"mass_error(ppm)": []interface{}{
						-0.840000,
						-2.050000,
						-3.740000,
						-4.370000,
						-5.020000,
						-3.740000,
					},
					"tentative_formula": []interface{}{
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
					105.069901,
					115.054199,
					133.064804,
					151.075394,
					161.059692,
					179.070297,
				},
				Intensity: []float64{
					1513707.125000,
					134276.656250,
					3576966.750000,
					143513.875000,
					2536772.250000,
					204606.656250,
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
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/Athens_Univ/MSBNK-Athens_Univ-AU229201.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-Athens_Univ-AU229201\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"2-Amino-3,8-dimethylimidazo-[4,5-f]quinoxaline (MeIQx); LC-ESI-QTOF; MS2; CE: 10 eV; R=35000; [M+H]+\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63690019200,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63690019200,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  0,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "Nikiforos Alygizakis",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Katerina Galani",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Nikolaos Thomaidis",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " University of Athens",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "\"Copyright (C) 2019 Department of Chemistry, University of Athens\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "standard compound",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "CONFIDENCE",
				},
			},
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"2-Amino-3,8-dimethylimidazo-[4,5-f]quinoxaline (MeIQx)\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"MeIQx\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"3,8-dimethylimidazo[4,5-f]quinoxalin-2-amine\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"N/A",
					"Environmental Standard",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C11H11N5\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           213.101445,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"CN1C(N)=NC2=C1C=CC1=NC=C(C)N=C21\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C11H11N5/c1-6-5-13-7-3-4-8-10(9(7)14-6)15-11(12)16(8)2/h3-5H,1-2H3,(H2,12,15)\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "77500-04-0",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEBI",
						Identifier:      "76604",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KEGG",
						Identifier:      "C19255",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:62275",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "DVCCCQNKIYNAKB-UHFFFAOYSA-N",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "56076",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"Bruker maXis Impact\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"LC-ESI-QTOF\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "CID",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "10 eV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Acclaim RSLC C18 2.2um, 2.1x100mm, Thermo",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "99/1 at 0-1 min, 61/39 at 3 min, 0.1/99.9 at 14-16 min, 99/1 at 16.1-20 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "200 uL/min at 0-3 min, 400 uL/min at 14 min, 480 uL/min at 16-19 min, 200 uL/min at 19.1-20 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "4.075 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A 90:10 water:methanol with 0.01% formic acid and 5mM ammonium formate",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				&massbank.AcChromatography{
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
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "214.1081",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "214.1087",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				&massbank.MsFocusedIon{
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
				&massbank.MsDataProcessing{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "identity on assigned fragments and MS1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				&massbank.MsDataProcessing{
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
					String:          "\"splash10-03di-0090000000-4ca5f2773c0d659574ef\"",
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
					"error(ppm)": []interface{}{
						-1.220000,
						-7.780000,
						-13.600000,
					},
					"formula_count": []interface{}{
						1,
						1,
						1,
					},
					"m/z": []interface{}{
						214.108500,
						215.111000,
						216.113000,
					},
					"mass": []interface{}{
						214.108700,
						215.112600,
						216.116000,
					},
					"tentative_formula": []interface{}{
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
					214.108505,
					215.110992,
					216.113007,
				},
				Intensity: []float64{
					2303864.000000,
					289484.000000,
					16528.000000,
				},
				Rel: []uint{
					999,
					125,
					7,
				},
			},
		},
	},
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/Eawag/MSBNK-Eawag-EA018353.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-Eawag-EA018353\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"Sulfadimethoxine; LC-ESI-ITFT; MS2; CE: 30%; R=7500; [M-H]-\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63525254400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63525254400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  0,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "Stravs M",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Schymanski E",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Singer H",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Department of Environmental Chemistry",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Eawag",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "\"Copyright (C) 2012 Eawag, Duebendorf, Switzerland\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "standard compound",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "CONFIDENCE",
				},
			},
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Sulfadimethoxine\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"4-amino-N-(2,6-dimethoxy-4-pyrimidinyl)benzenesulfonamide\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"N/A",
					"Environmental Standard",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C12H14N4O4S\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           310.073600,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"c1(NS(c2ccc(N)cc2)(=O)=O)cc(nc(n1)OC)OC\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C12H14N4O4S/c1-19-11-7-10(14-12(15-11)20-2)16-21(17,18)9-5-3-8(13)4-6-9/h3-7H,13H2,1-2H3,(H,14,15,16)\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "122-11-2",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEBI",
						Identifier:      "32161",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KEGG",
						Identifier:      "D01142",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:5323",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "ZZORFUFYDOWNEF-UHFFFAOYSA-N",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "5132",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"LTQ Orbitrap XL Thermo Scientific\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"LC-ESI-ITFT\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "HCD",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "30 % (nominal)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "XBridge C18 3.5um, 2.1x50mm, Waters",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "90/10 at 0 min, 50/50 at 4 min, 5/95 at 17 min, 5/95 at 25 min, 90/10 at 25.1 min, 90/10 at 30 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "200 ul/min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "5.7 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A water with 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				&massbank.AcChromatography{
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
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "309.0653",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "309.0663",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				&massbank.MsFocusedIon{
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
				&massbank.MsDataProcessing{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Spline",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DEPROFILE",
					},
				},
				&massbank.MsDataProcessing{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "loess on assigned fragments and MS1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				&massbank.MsDataProcessing{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Peaks with additional N2/O included",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "REANALYZE",
					},
				},
				&massbank.MsDataProcessing{
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
					String:          "\"splash10-0a4i-0009000000-ccda245feefab7d2bd86\"",
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
					"error(ppm)": []interface{}{
						3.300000,
						0.090000,
						-2.230000,
						-0.940000,
					},
					"formula_count": []interface{}{
						2,
						1,
						1,
						1,
					},
					"m/z": []interface{}{
						174.067900,
						195.023400,
						230.080400,
						309.066000,
					},
					"mass": []interface{}{
						174.067300,
						195.023400,
						230.080900,
						309.066300,
					},
					"tentative_formula": []interface{}{
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
					174.067902,
					195.023407,
					230.080399,
					309.066010,
				},
				Intensity: []float64{
					3134.199951,
					4236.299805,
					10982.000000,
					805229.125000,
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
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/Eawag_Additional_Specs/MSBNK-Eawag_Additional_Specs-ET060401.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-Eawag_Additional_Specs-ET060401\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"FEN_246.1101_16.1; LC-ESI-QFT; MS2; CE: 15; R=17500; [M+H]+\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63593769600,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63578736000,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  63590054400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "R. Gulde",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " E. Schymanski",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " K. Fenner",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Department of Environmental Chemistry",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Eawag",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "\"Copyright (C) 2016 Eawag, Duebendorf, Switzerland\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "\"Gulde, R.; Meier, U.; Schymanski, E. L.; Kohler, H.-P. E.; Helbling, D. E.; Derrer, S.; Rentsch, D.; Fenner, K. Systematic Exploration of Biotransformation Reactions of Amine-Containing Micropollutants in Activated Sludge. Environmental Science \\u0026 Technology 2016, 50 (6), 2908–20. DOI:10.1021/acs.est.5b05186\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "Tentative identification: most likely structure (Level 3)",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "CONFIDENCE",
				},
			},
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"FEN_246.1101_16.1\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"N-desethyl-N-acetylfeniramine\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"N-[1-[3-(trifluoromethyl)phenyl]propan-2-yl]acetamide\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"N/A",
					"Environmental Transformation Products",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C12H14F3NO\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           245.102700,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"CC(CC1=CC(=CC=C1)C(F)(F)F)NC(C)=O\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C12H14F3NO/c1-8(16-9(2)17)6-10-4-3-5-11(7-10)12(13,14)15/h3-5,7-8H,6H2,1-2H3,(H,16,17)\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "40552-64-5",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:38514",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "ZVKARXLKNIBGIR-UHFFFAOYSA-N",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "35298",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"Q Exactive Plus Orbitrap Thermo Scientific\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"LC-ESI-QFT\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "HCD",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "15 (nominal)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Atlantis T3 3um, 3.0x150mm, Waters with guard column",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "95/5 at 0 min, 5/95 at 15 min, 5/95 at 20 min, 95/5 at 20.1 min, 95/5 at 25 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "300 uL/min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "15.8 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A water with 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				&massbank.AcChromatography{
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
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "65.0597",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "BASE_PEAK",
					},
				},
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "246.11",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				&massbank.MsFocusedIon{
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
				&massbank.MsDataProcessing{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "loess on assigned fragments and MS1",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RECALIBRATE",
					},
				},
				&massbank.MsDataProcessing{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Peaks with additional N2/O included",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "REANALYZE",
					},
				},
				&massbank.MsDataProcessing{
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
					String:          "\"splash10-052s-1940000000-a515d02f980838cad28d\"",
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
					"error(ppm)": []interface{}{
						0.830000,
						0.070000,
						-4.770000,
						-2.400000,
						-2.010000,
						0.180000,
						0.740000,
						0.750000,
					},
					"formula_count": []interface{}{
						1,
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					},
					"m/z": []interface{}{
						60.044400,
						60.080800,
						123.116200,
						141.000600,
						158.027200,
						159.041600,
						187.073000,
						246.110200,
					},
					"mass": []interface{}{
						60.044400,
						60.080800,
						123.116800,
						141.000900,
						158.027500,
						159.041600,
						187.072900,
						246.110000,
					},
					"tentative_formula": []interface{}{
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
					60.044399,
					60.080799,
					123.116203,
					141.000595,
					158.027206,
					159.041595,
					187.072998,
					214.089706,
					246.110199,
				},
				Intensity: []float64{
					17595.500000,
					1571.699951,
					990.299988,
					4683.899902,
					14370.000000,
					43520.398438,
					97124.796875,
					13043.944336,
					75456.703125,
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
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/Fac_Eng_Univ_Tokyo/MSBNK-Fac_Eng_Univ_Tokyo-JP009132.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-Fac_Eng_Univ_Tokyo-JP009132\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"METHYL PHENYL SULFIDE; EI-B; MS\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63588758400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63360144000,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  63440236800,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "SODA AROMATIC CO.",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " LTD.",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY-NC-SA\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: ([]*massbank.RecordComment)(nil),
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"METHYL PHENYL SULFIDE\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"N/A",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C7H8S\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           124.034670,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"CSc(c1)cccc1\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C7H8S/c1-8-7-5-3-2-4-6-7/h2-6H,1H3\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "HNKJADCVZUBCPG-UHFFFAOYSA-N",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"HITACHI M-80B\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"EI-B\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.MsFocusedIon{
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
					String:          "\"splash10-0fk9-9500000000-e5cde2928e0b7e33c1cc\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header:          ([]string)(nil),
				Values:          (map[string][]interface{})(nil),
			},
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
					5.680000,
					1.260000,
					3.110000,
					1.850000,
					4.410000,
					19.290001,
					28.639999,
					7.900000,
					5.090000,
					1.390000,
					18.139999,
					34.820000,
					3.180000,
					2.300000,
					2.040000,
					1.250000,
					6.110000,
					6.120000,
					22.520000,
					1.380000,
					14.670000,
					1.150000,
					1.480000,
					1.160000,
					6.230000,
					2.840000,
					1.810000,
					12.700000,
					42.959999,
					6.050000,
					2.100000,
					5.120000,
					1.610000,
					31.680000,
					2.020000,
					5.640000,
					46.380001,
					3.120000,
					1.970000,
					8.220000,
					99.989998,
					8.310000,
					4.820000,
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
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/Keio_Univ/MSBNK-Keio_Univ-KO009105.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-Keio_Univ-KO009105\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"Desthiobiotin; LC-ESI-IT; MS4; m/z: 215/197/179; [M+H]+\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63486460800,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63346147200,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  0,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "Ojima Y",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Kakazu Y",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Horai H",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Soga T",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Institute for Advanced Biosciences",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Keio Univ.",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY-NC-SA\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "KEIO_ID D075",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Desthiobiotin\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Dethiobiotin\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"N/A",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C10H18N2O3\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           214.131740,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"OC(=O)CCCCCC(N1)C(C)NC(=O)1\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C10H18N2O3/c1-7-8(12-10(15)11-7)5-3-2-4-6-9(13)14/h7-8H,2-6H2,1H3,(H,13,14)(H2,11,12,15)/t7-,8+/m0/s1\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "533-48-2",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEBI",
						Identifier:      "16691",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KEGG",
						Identifier:      "C01909",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "NIKKAJI",
						Identifier:      "J9.406D",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "SID:5017",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "AUTOLBMXDDTRRT-JGVFFNPUSA-N",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"LC/MSD Trap XCT, Agilent Technologies\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"LC-ESI-IT\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS4",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "215/197/179",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				&massbank.MsFocusedIon{
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
				&massbank.MsDataProcessing{
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
					String:          "\"splash10-000j-5900000000-8ad8423e2b359b500863\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header:          ([]string)(nil),
				Values:          (map[string][]interface{})(nil),
			},
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
					56.200001,
					58.200001,
					67.199997,
					68.199997,
					70.199997,
					76.699997,
					79.199997,
					80.000000,
					81.099998,
					82.000000,
					85.000000,
					91.099998,
					93.099998,
					94.000000,
					95.099998,
					96.099998,
					99.099998,
					108.099998,
					109.099998,
					110.099998,
					111.000000,
					113.099998,
					119.099998,
					123.099998,
					125.099998,
					134.100006,
					136.100006,
					137.100006,
					151.100006,
					162.000000,
					179.100006,
					180.100006,
					197.199997,
				},
				Intensity: []float64{
					7.300000,
					8.100000,
					66.360001,
					1.800000,
					6.700000,
					4.900000,
					14.000000,
					2.600000,
					64.279999,
					18.490000,
					3.000000,
					10.000000,
					49.500000,
					6.690000,
					28.990000,
					10.200000,
					342.459991,
					6.600000,
					33.389999,
					12.190000,
					41.200001,
					17.900000,
					180.850006,
					11.400000,
					12.890000,
					52.209999,
					498.250000,
					13.290000,
					142.240005,
					3.900000,
					39.869999,
					54.970001,
					2.200000,
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
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/MSSJ/MSBNK-MSSJ-MSJ00284.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-MSSJ-MSJ00284\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"Pentoxazone; ESI-QTOF; MS2; NEGATIVE; [M-H]-; CID; 60 V\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63720086400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63720086400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  0,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "Atsushi Yamamoto",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Faculty of Environmental Studies",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Tottori University of Environmental Studies",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " 1-1",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Wakabadai-kita",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Tottori City",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Tottori 689-1111",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Japan.",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "\"Atsushi Yamamoto, Faculty of Environmental Studies, Tottori University of Environmental Studies, 1-1, Wakabadai-kita, Tottori City, Tottori 689-1111, Japan.\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
				SubtagProperty: massbank.SubtagProperty{
					StringProperty: massbank.StringProperty{
						String:          "The sample was injected by direct infusion.",
						DefaultProperty: massbank.DefaultProperty{},
					},
					Subtag: "",
				},
			},
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Pentoxazone\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"Non-natural product",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C17H17ClFNO4\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           353.083000,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"CC(=C1C(=O)N(C(=O)O1)c2cc(c(cc2F)Cl)OC3CCCC3)C\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C17H17ClFNO4/c1-9(2)15-16(21)20(17(22)24-15)13-8-14(11(18)7-12(13)19)23-10-5-3-4-6-10/h7-8,10H,3-6H2,1-2H3\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "110956-75-7",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "9888955",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "JZPKLLLUDLHCEL-UHFFFAOYSA-N",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"X500R QTOF (AB Sciex LLC, USA)\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"ESI-QTOF\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "60 V",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "CID",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "352.0757",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				&massbank.MsFocusedIon{
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
					String:          "\"splash10-0006-9400000000-6b99aa683e8584601a75\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header:          ([]string)(nil),
				Values:          (map[string][]interface{})(nil),
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
					31.990101,
					34.969101,
					41.039200,
					69.034203,
					97.028900,
					131.001007,
					149.999207,
					166.977402,
					185.976105,
				},
				Intensity: []float64{
					0.025420,
					0.020940,
					0.260610,
					0.016450,
					0.025310,
					0.037660,
					0.042760,
					0.043920,
					0.039620,
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
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/RIKEN/MSBNK-RIKEN-PR100978.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-RIKEN-PR100978\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"Quercetin-3-Glucuronide; LC-ESI-QTOF; MS2; CE:Ramp 5-60 V; [M-H]-\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63588758400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63412675200,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  63440236800,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "Matsuda F",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Suzuki M",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Sawada Y",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Plant Science Center",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " RIKEN.",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY-SA\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Quercetin-3-Glucuronide\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Quer-3-GlcA\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Miquelianin\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Querciturone\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"Flavonoid",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C21H18O13\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           478.074740,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"OC(=O)C(O1)C(O)C(O)C(O)C1OC(C(=O)3)=C(Oc(c4)c(c(O)cc(O)4)3)c(c2)cc(O)c(O)c2\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C21H18O13/c22-7-4-10(25)12-11(5-7)32-17(6-1-2-8(23)9(24)3-6)18(13(12)26)33-21-16(29)14(27)15(28)19(34-21)20(30)31/h1-5,14-16,19,21-25,27-29H,(H,30,31)/t14-,15-,16+,19-,21+/m0/s1\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "22688-79-5",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "4438874",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "KNAPSACK",
						Identifier:      "C00005376",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:5274585",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "INCHIKEY",
						Identifier:      "DUBCCGAQYVUYEU-ZUGPOPFOSA-N",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"UPLC Q-Tof Premier, Waters\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"LC-ESI-QTOF\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Ramp 5-60 V",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Continuum",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DATAFORMAT",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "600.0 L/Hr",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DESOLVATION_GAS_FLOW",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "400 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DESOLVATION_TEMPERATURE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "LOW-ENERGY CID",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FRAGMENTATION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "ESI",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "IONIZATION",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "3.0 kV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "CAPILLARY_VOLTAGE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "23.0 V",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SAMPLING_CONE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A CH3CN(0.1%HCOOH)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				&massbank.AcChromatography{
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
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "477.06692",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_M/Z",
					},
				},
				&massbank.MsFocusedIon{
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
					String:          "\"splash10-0udi-0609400000-9fd50528da25d66adfc7\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header:          ([]string)(nil),
				Values:          (map[string][]interface{})(nil),
			},
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
					107.014297,
					109.029900,
					121.029800,
					151.003494,
					163.003601,
					178.998901,
					255.031097,
					301.035309,
					302.043213,
					477.066895,
					478.075897,
				},
				Intensity: []float64{
					370.799988,
					267.700012,
					395.399994,
					1650.000000,
					295.200012,
					793.799988,
					333.299988,
					4687.000000,
					386.000000,
					2215.000000,
					237.500000,
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
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/RIKEN/MSBNK-RIKEN-PR309089.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-RIKEN-PR309089\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"FA 18:2+1O; LC-ESI-QTOF; MS2\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63689328000,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63689328000,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  0,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "Tetsuya Mori",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Center for Sustainable Resource Science",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " RIKEN",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY-NC-SA\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "\"Tsugawa H., Nakabayashi R., Mori T., Yamada Y., Takahashi M., Rai A., Sugiyama R., Yamamoto H., Nakaya T., Yamazaki M., Kooke R., Bac-Molenaar JA., Oztolan-Erol N., Keurentjes JJB., Arita M., Saito K. (2019) \\\"A cheminformatics approach to characterize metabolomes in stable-isotope-labeled organisms\\\" Nature Methods 16(4):295-298. [doi:10.1038/s41592-019-0358-2]\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"FA 18:2+1O\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"Oxidized fatty acids",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C18H32O3\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           296.451000,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"O=C(O)CCCCCCCC=CC=CC(O)CCCCC\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C18H32O3/c1-2-3-11-14-17(19)15-12-9-7-5-4-6-8-10-13-16-18(20)21/h7,9,12,15,17,19H,2-6,8,10-11,13-14,16H2,1H3,(H,20,21)\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"LC, Waters Acquity UPLC System; MS, Waters Xevo G2 Q-Tof\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"LC-ESI-QTOF\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS2",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "NEGATIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "6V",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLLISION_ENERGY",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "800/h",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DESOLVATION_GAS_FLOW",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "450 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "DESOLVATION_TEMPERATURE",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "+3.00 kV",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "CAPILLARY_VOLTAGE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Acquity bridged ethyl hybrid C18 (1.7 um, 2.1 mm * 100 mm, Waters)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "40 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_TEMPERATURE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A/B = (99.5%/0.5% at 0 min, 99.5%/0.5% at 0.1 min, 20%/80% at 10 min, 0.5%/99.5% at 10.1 min, 0.5%/99.5% at 12.0 min, 99.5%/0.5% at 12.1 min, 99.5%/0.5% at 15.0 min)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "0.3 ml/min at 0 min, 0.3 ml/min at 10 min, 0.4 ml/min at 10.1 min, 0.4 ml/min at 14.4 min, 0.3 ml/min at 14.5 min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "9.57",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A water including 0.1% formic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				&massbank.AcChromatography{
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
				&massbank.MsFocusedIon{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "[M-H]-",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "PRECURSOR_TYPE",
					},
				},
				&massbank.MsFocusedIon{
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
					String:          "\"splash10-0002-0090000000-3b4035f10b24d4c3f5a0\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header:          ([]string)(nil),
				Values:          (map[string][]interface{})(nil),
			},
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
					57.084129,
					113.098259,
					172.092789,
					177.122955,
					195.136719,
					196.146408,
					197.186310,
					223.434525,
					233.159775,
					277.216187,
					295.227722,
				},
				Intensity: []float64{
					18.000000,
					20.000000,
					24.000000,
					20.000000,
					59.000000,
					20.000000,
					20.000000,
					29.000000,
					19.000000,
					272.000000,
					1553.000000,
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
	&massbank.Massbank{
		Metadata: struct {
			FileName   string
			VersionRef massbank.MbReference
		}{
			FileName:   "/home/david/Projekte/MassBank/MassBank-data/Washington_State_Univ/MSBNK-Washington_State_Univ-BML81902.txt",
			VersionRef: "63f38e47dc8c761f4af1ad51",
		},
		Accession: &massbank.RecordAccession{
			StringProperty: massbank.StringProperty{
				String:          "\"MSBNK-Washington_State_Univ-BML81902\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Deprecated: &massbank.RecordDeprecated{
			Date: time.Time{
				wall: 0,
				ext:  0,
				loc:  (*time.Location)(nil),
			},
			Reason:          "",
			DefaultProperty: massbank.DefaultProperty{},
		},
		RecordTitle: &massbank.RecordTitle{
			StringProperty: massbank.StringProperty{
				String:          "\"Parthenolide; LC-APCI-QTOF; MS; POSITIVE\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Date: &massbank.RecordDate{
			DefaultProperty: massbank.DefaultProperty{},
			Updated: time.Time{
				wall: 0,
				ext:  63588758400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Created: time.Time{
				wall: 0,
				ext:  63486806400,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
			Modified: time.Time{
				wall: 0,
				ext:  0,
				loc: &time.Location{
					name:       "",
					zone:       ([]time.zone)(nil),
					tx:         ([]time.zoneTrans)(nil),
					extend:     "",
					cacheStart: 0,
					cacheEnd:   0,
					cacheZone:  (*time.zone)(nil),
				},
			},
		},
		Authors: &massbank.RecordAuthorNames{
			DefaultProperty: massbank.DefaultProperty{},
			value: []massbank.RecordAuthorName{
				massbank.RecordAuthorName{
					Name:        "Cuthbertson DJ",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Johnson SR",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Lange BM",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Institute of Biological Chemistry",
					MarcRelator: "",
				},
				massbank.RecordAuthorName{
					Name:        " Washington State University",
					MarcRelator: "",
				},
			},
		},
		License: &massbank.RecordLicense{
			StringProperty: massbank.StringProperty{
				String:          "\"CC BY-SA\"",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Copyright: &massbank.RecordCopyright{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Publication: &massbank.RecordPublication{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Project: &massbank.RecordProject{
			StringProperty: massbank.StringProperty{
				String:          "null",
				DefaultProperty: massbank.DefaultProperty{},
			},
		},
		Comments: []*massbank.RecordComment{
			&massbank.RecordComment{
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
				&massbank.ChName{
					StringProperty: massbank.StringProperty{
						String:          "\"Parthenolide\"",
						DefaultProperty: massbank.DefaultProperty{},
					},
				},
			},
			Classes: &massbank.ChCompoundClasses{
				DefaultProperty: massbank.DefaultProperty{},
				value: []massbank.ChCompoundClass{
					"N/A",
				},
			},
			Formula: &massbank.ChFormula{
				StringProperty: massbank.StringProperty{
					String:          "\"C15H20O3\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			CdkDepict: ([]*massbank.CdkDepict)(nil),
			Mass: &massbank.ChMass{
				DefaultProperty: massbank.DefaultProperty{},
				value:           248.141245,
			},
			Smiles: &massbank.ChSmiles{
				StringProperty: massbank.StringProperty{
					String:          "\"C/C/1=C\\\\CC[C@@]2([C@@H](O2)[C@@H]3[C@@H](CC1)C(=C)C(=O)O3)C\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Inchi: &massbank.ChInchi{
				StringProperty: massbank.StringProperty{
					String:          "\"InChI=1S/C15H20O3/c1-9-5-4-8-15(3)13(18-15)12-11(7-6-9)10(2)14(16)17-12/h5,11-13H,2,4,6-8H2,1,3H3/b9-5+/t11-,12-,13-,15+/m0/s1\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Link: []*massbank.ChLink{
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CAS",
						Identifier:      "20554-84-1",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "CHEMSPIDER",
						Identifier:      "4554343",
					},
				},
				&massbank.ChLink{
					DatabaseProperty: massbank.DatabaseProperty{
						DefaultProperty: massbank.DefaultProperty{},
						Database:        "PUBCHEM",
						Identifier:      "CID:6473881",
					},
				},
				&massbank.ChLink{
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
			Name: &massbank.SpName{
				StringProperty: massbank.StringProperty{
					String:          "null",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Lineage: &massbank.SpLineage{
				DefaultProperty: massbank.DefaultProperty{},
				value:           ([]massbank.SpLineageElement)(nil),
			},
			Link:   ([]*massbank.SpLink)(nil),
			Sample: ([]*massbank.SampleInformation)(nil),
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
					String:          "\"Agilent 1200 RRLC; Agilent 6520 QTOF\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			InstrumentType: &massbank.AcInstrumentType{
				StringProperty: massbank.StringProperty{
					String:          "\"LC-APCI-QTOF\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			MassSpectrometry: []*massbank.AcMassSpectrometry{
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "MS",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "MS_TYPE",
					},
				},
				&massbank.AcMassSpectrometry{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "POSITIVE",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "ION_MODE",
					},
				},
				&massbank.AcMassSpectrometry{
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
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "Agilent C8 Cartridge Column 2.1X30mm 3.5 micron (guard); Agilent SB-Aq 2.1x50mm 1.8 micron (analytical)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_NAME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "60 C",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "COLUMN_TEMPERATURE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "linear from 98A/2B at 0 min to 2A/98B at 13 min, hold 6 min at 2A/98B, reequilibration 98A/2B (5 min)",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_GRADIENT",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "0.6 ml/min",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "FLOW_RATE",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "7.394",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "RETENTION_TIME",
					},
				},
				&massbank.AcChromatography{
					SubtagProperty: massbank.SubtagProperty{
						StringProperty: massbank.StringProperty{
							String:          "A water with 0.2% acetic acid",
							DefaultProperty: massbank.DefaultProperty{},
						},
						Subtag: "SOLVENT",
					},
				},
				&massbank.AcChromatography{
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
					String:          "\"splash10-0002-0090000000-b81b1903703b01f61d7d\"",
					DefaultProperty: massbank.DefaultProperty{},
				},
			},
			Annotation: &massbank.PkAnnotation{
				DefaultProperty: massbank.DefaultProperty{},
				Header:          ([]string)(nil),
				Values:          (map[string][]interface{})(nil),
			},
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
					249.148483,
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
}

package massbank

import (
	"time"
)

type MbMetaData struct {
	Commit    string
	Version   string
	Timestamp string
}

type SubtagProperty struct {
	Key   string
	Value string
}

type DatabaseProperty struct {
	Database   string
	Identifier string
}

type MassBank2 struct {
	Metadata struct {
		FileName   string
		VersionRef string
	}
	Accession   *string             `mb2:"ACCESSION"`
	Deprecated  *RecordDeprecated   `mb2:"DEPRECATED" optional:"true" bson:"deprecated,omitempty"`
	RecordTitle *string             `mb2:"RECORD_TITLE"`
	Date        *RecordDate         `mb2:"DATE"`
	Authors     *[]RecordAuthorName `mb2:"AUTHORS"`
	License     *string             `mb2:"LICENSE"`
	Copyright   *string             `mb2:"COPYRIGHT" optional:"true"`
	Publication *string             `mb2:"PUBLICATION" optional:"true"`
	Project     *string             `mb2:"PROJECT" optional:"true" bson:"project,omitempty"`
	Comments    *[]SubtagProperty   `mb2:"COMMENT" optional:"true"`
	Compound    struct {
		Names     *[]string           `mb2:"CH$NAME" json:"name"`
		Classes   *[]string           `mb2:"CH$COMPOUND_CLASS" json:"classes"`
		Formula   *string             `mb2:"CH$FORMULA" json:"formula"`
		CdkDepict *[]string           `mb2:"CH$CDK_DEPICT" json:"cdk-depict"` // not for productive use
		Mass      *float64            `mb2:"CH$EXACT_MASS" json:"mass"`
		Smiles    *string             `mb2:"CH$SMILES" json:"smiles"`
		InChI     *string             `mb2:"CH$IUPAC" json:"inchi"`
		Link      *[]DatabaseProperty `mb2:"CH$LINK" optional:"true" json:"link"`
	} `json:"compound"`
	Species struct {
		Name    *string             `mb2:"SP$SCIENTIFIC_NAME" optional:"true"`
		Lineage *[]string           `mb2:"SP$LINEAGE" optional:"true"`
		Link    *[]DatabaseProperty `mb2:"SP$LINK" optional:"true"`
		Sample  *[]string           `mb2:"SP$SAMPLE" optional:"true"`
	}
	Acquisition struct {
		Instrument       *string           `mb2:"AC$INSTRUMENT"`
		InstrumentType   *string           `mb2:"AC$INSTRUMENT_TYPE"`
		MassSpectrometry *[]SubtagProperty `mb2:"AC$MASS_SPECTROMETRY" optional:"true"`
		Chromatography   *[]SubtagProperty `mb2:"AC$CHROMATOGRAPHY" optional:"true"`
		General          *[]SubtagProperty `mb2:"AC$GENERAL" optional:"true"`
	}
	MassSpectrometry struct {
		FocusedIon     *[]SubtagProperty `mb2:"MS$FOCUSED_ION" optional:"true"`
		DataProcessing *[]SubtagProperty `mb2:"MS$DATA_PROCESSING" optional:"true"`
	}
	Peak struct {
		Splash     *string       `mb2:"PK$SPLASH"`
		Annotation *PkAnnotation `mb2:"PK$ANNOTATION" optional:"true"`
		NumPeak    *uint         `mb2:"PK$NUM_PEAK"`
		Peak       *PkPeak       `mb2:"PK$PEAK"`
	}
}

type RecordDeprecated struct {
	Date   time.Time
	Reason string
}

type RecordDate struct {
	Updated  time.Time
	Created  time.Time
	Modified time.Time
}

type RecordAuthorName struct {
	Name        string
	MarcRelator string
}

type PkPeak struct {
	Header    []string
	Mz        []float64
	Intensity []float64
	Rel       []uint
}

type PkAnnotation struct {
	Header []string
	Values map[string][]interface{}
}

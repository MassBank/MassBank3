package massbank

import (
	"reflect"
	"time"
)

const dateFormat = "2006.01.02"
const deprecatedDateFormat = "2006-01-02"

var lastTag string

type Property interface {
	Validate() (bool, error)
	Output() string
	Parse(string) error
}

type DefaultProperty struct {
}

type StringProperty struct {
	string
	DefaultProperty
}

type SubtagProperty struct {
	StringProperty
	subtag string
}

type DatabaseProperty struct {
	DefaultProperty
	Database   string
	Identifier string
}

type tagProperties struct {
	Type  reflect.Type
	Name  string
	Index []int
}

var TagMap = map[string]tagProperties{}

type Massbank struct {
	File struct {
		FileName string
	}
	Accession   *RecordAccession   `mb2:"ACCESSION"`
	Deprecated  *RecordDeprecated  `mb2:"DEPRECATED" optional:"true"`
	RecordTitle *RecordTitle       `mb2:"RECORD_TITLE"`
	Date        *RecordDate        `mb2:"DATE"`
	Authors     *RecordAuthorNames `mb2:"AUTHORS"`
	License     *RecordLicense     `mb2:"LICENSE"`
	Copyright   *RecordCopyright   `mb2:"COPYRIGHT" optional:"true"`
	Publication *RecordPublication `mb2:"PUBLICATION" optional:"true"`
	Project     *RecordProject     `mb2:"PROJECT" optional:"true"`
	Comments    []*RecordComment   `mb2:"COMMENT" optional:"true"`
	Compound    struct {
		Names     []*ChName          `mb2:"CH$NAME" json:"name"`
		Classes   *ChCompoundClasses `mb2:"CH$COMPOUND_CLASS" json:"classes"`
		Formula   *ChFormula         `mb2:"CH$FORMULA" json:"formula"`
		CdkDepict []*CdkDepict       `mb2:"CH$CDK_DEPICT" json:"cdk-depict"` // not for productive use
		Mass      *ChMass            `mb2:"CH$EXACT_MASS" json:"mass"`
		Smiles    *ChSmiles          `mb2:"CH$SMILES" json:"smiles"`
		Inchi     *ChInchi           `mb2:"CH$IUPAC" json:"inchi"`
		Link      []*ChLink          `mb2:"CH$LINK" optional:"true" json:"link"`
	} `json:"Compound"`
	Species struct {
		Name    *SpName              `mb2:"SP$SCIENTIFIC_NAME" optional:"true"`
		Lineage *SpLineage           `mb2:"SP$LINEAGE" optional:"true"`
		Link    []*SpLink            `mb2:"SP$LINK" optional:"true"`
		Sample  []*SampleInformation `mb2:"SP$SAMPLE" optional:"true"`
	}
	Acquisition struct {
		Instrument       *AcInstrument         `mb2:"AC$INSTRUMENT"`
		InstrumentType   *AcInstrumentType     `mb2:"AC$INSTRUMENT_TYPE"`
		MassSpectrometry []*AcMassSpectrometry `mb2:"AC$MASS_SPECTROMETRY" optional:"true"`
		Chromatography   []*AcChromatography   `mb2:"AC$CHROMATOGRAPHY" optional:"true"`
		General          []*AcGeneral          `mb2:"AC$GENERAL" optional:"true"`
	}
	MassSpectrometry struct {
		FocusedIon     []*MsFocusedIon     `mb2:"MS$FOCUSED_ION" optional:"true"`
		DataProcessing []*MsDataProcessing `mb2:"MS$DATA_PROCESSING" optional:"true"`
	}
	Peak struct {
		Splash     *PkSplash     `mb2:"PK$SPLASH"`
		Annotation *PkAnnotation `mb2:"PK$ANNOTATION" optional:"true"`
		NumPeak    *PkNumPeak    `mb2:"PK$NUM_PEAK"`
		Peak       *PkPeak       `mb2:"PK$PEAK"`
	}
}

type RecordAccession struct {
	StringProperty
}

type RecordDeprecated struct {
	Date   time.Time
	Reason string
	DefaultProperty
}

type RecordTitle struct {
	StringProperty
}

type RecordDate struct {
	DefaultProperty
	Updated  time.Time
	Created  time.Time
	Modified time.Time
}

type RecordAuthorNames struct {
	DefaultProperty
	value []RecordAuthorName
}

type RecordAuthorName struct {
	Name        string
	MarcRelator string
}

type RecordLicense struct {
	StringProperty
}

type RecordCopyright struct {
	StringProperty
}

type RecordPublication struct {
	StringProperty
}

type RecordProject struct {
	StringProperty
}

type RecordComment struct {
	SubtagProperty
}

type RecordSubtag string

type RecordMbTag string

type ChName struct {
	StringProperty
}

type ChCompoundClasses struct {
	DefaultProperty
	value []ChCompoundClass
}

type ChCompoundClass string

type ChFormula struct {
	StringProperty
}

type ChMass struct {
	DefaultProperty
	value float64
}

type ChSmiles struct {
	StringProperty
}

type ChInchi struct {
	StringProperty
}

type ChLink struct {
	DatabaseProperty
}

type ExtDatabase struct {
	StringProperty
}

type CdkDepict struct {
	StringProperty
}

type SpName struct {
	StringProperty
}

type SpLineage struct {
	DefaultProperty
	value []SpLineageElement
}

type SpLineageElement struct {
	StringProperty
}

type SpLink struct {
	DatabaseProperty
}

type SampleInformation struct {
	StringProperty
}

type AcInstrument struct {
	StringProperty
}

type Separation string
type Ionization string
type Analyzer string
type AcInstrumentType struct {
	StringProperty
}
type MsType string
type AcMassSpectrometry struct {
	SubtagProperty
}

type AcChromatography struct {
	SubtagProperty
}

type AcGeneral struct {
	SubtagProperty
}

type PkPeak struct {
	DefaultProperty
	Header    []string
	Mz        []float64
	Intensity []float64
	Rel       []uint
}

type MsFocusedIon struct {
	SubtagProperty
}
type MsDataProcessing struct {
	SubtagProperty
}

type PkSplash struct {
	StringProperty
}

type PkAnnotation struct {
	DefaultProperty
	Header []string
	Values map[string][]interface{}
}

type PkNumPeak struct {
	DefaultProperty
	Value uint
}

type TagValue struct {
	tag    string
	values []string
}

type TagValues []TagValue

// Build an array with type information and tag strings for parsing
func buildTags() {
	var mb = Massbank{}
	mb.addTagField(mb, []int{})
}

func (mb *Massbank) addTagField(i interface{}, index []int) {
	valType := reflect.TypeOf(i)
	for _, field := range reflect.VisibleFields(valType) {
		if field.Type.Kind() != reflect.Struct {
			mb.addFieldToMap(field, index)
		} else {
			mb.addTagField(reflect.ValueOf(i).FieldByIndex(field.Index).Interface(), append(index, field.Index...))
		}
	}
}

func (mb *Massbank) addFieldToMap(field reflect.StructField, index []int) {
	var props = tagProperties{}
	props.Name = field.Name
	props.Type = field.Type
	props.Index = append(index, field.Index...)
	tag := field.Tag.Get("mb2")
	subtag := field.Tag.Get("mb2st")
	if subtag != "" {
		subtag = ":" + subtag
	}
	TagMap[tag] = props
}

package mb3server

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/MassBank/MassBank3/pkg/massbank"
)

func ConvertMb3RecordToJsonString(record *MbRecord) (string, error) {
	// Marshal the MassBank2 struct into a JSON string
	recordJson, err := json.Marshal(record)
	if err != nil {
		fmt.Println("Error marshalling to JSON: ", err)
		return "", err
	}

	return string(recordJson), nil
}

func ConvertJsonStringToMb3Record(recordJson string) (*MbRecord, error) {
	// Unmarshal the JSON string into the MassBank2 struct
	var record MbRecord

	if err := json.Unmarshal([]byte(recordJson), &record); err != nil {
		fmt.Println("Error unmarshalling JSON: ", err)
		return nil, err
	}

	return &record, nil
}

func ConvertMb2RecordToMb3Record(record *massbank.MassBank2) (*MbRecord, error) {

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
		License:     "",
		Copyright:   "",
		Publication: "",
		Project:     "",
		Comments:    nil,
		Compound: MbRecordCompound{
			Names:   *record.Compound.Names,
			Classes: nil, // *record.Compound.Classes
			Formula: *record.Compound.Formula,
			Mass:    *record.Compound.Mass,
			Smiles:  *record.Compound.Smiles,
			Inchi:   *record.Compound.InChI,
			Link:    nil,
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
				Header: record.Peak.Peak.Header,
				Values: nil,
			},
			NeutralLoss: nil,
		},
	}
	if record.Publication != nil {
		result.Publication = *record.Publication
	}
	if record.License != nil {
		result.License = *record.License
	}
	if record.Copyright != nil {
		result.Copyright = *record.Copyright
	}
	if record.Project != nil {
		result.Project = *record.Project
	}

	// insert authors
	if record.Authors != nil {
		for _, author := range *record.Authors {
			result.Authors = append(result.Authors, AuthorsInner(author))
		}
	}

	// insert classes
	if record.Compound.Classes != nil {
		result.Compound.Classes = *record.Compound.Classes
	}

	// insert peak data
	// var ids = record.Peak.Peak.Id
	var mzs = record.Peak.Peak.Mz
	var ints = record.Peak.Peak.Intensity
	var rels = record.Peak.Peak.Rel
	for i := range mzs {
		result.Peak.Peak.Values = append(result.Peak.Peak.Values, MbRecordPeakPeakValuesInner{
			// Id:        ids[i],
			Mz:        mzs[i],
			Intensity: ints[i],
			Rel:       rels[i],
		})
	}

	if record.Peak.NeutralLoss != nil {
		result.Peak.NeutralLoss = []MbRecordPeakNeutralLossInner{}

		var diffs []float64
		diffs = append(diffs, record.Peak.NeutralLoss.Difference...)
		var peak1_ids []int32
		peak1_ids = append(peak1_ids, record.Peak.NeutralLoss.Peak1Id...)
		var peak2_ids []int32
		peak2_ids = append(peak2_ids, record.Peak.NeutralLoss.Peak2Id...)
		// var min_rel_intensities []int32
		// for _, min_rel_intensity := range *&record.Peak.NeutralLoss.MinRelIntensity {
		// 	min_rel_intensities = append(min_rel_intensities, min_rel_intensity)
		// }

		for i := 0; i < len(diffs); i++ {
			result.Peak.NeutralLoss = append(result.Peak.NeutralLoss, MbRecordPeakNeutralLossInner{
				Difference: diffs[i],
				Peak1Id:    peak1_ids[i],
				Peak2Id:    peak2_ids[i],
				// MinRelIntensity: min_rel_intensities[i],
			})
		}
	}

	// insert annotation data
	if record.Peak.Annotation != nil {
		result.Peak.Annotation.Header = record.Peak.Annotation.Header

		var annotationValues = [][]string{}
		for _, headerKey := range record.Peak.Annotation.Header {
			annotationValues = append(annotationValues, []string{})

			for _, v := range record.Peak.Annotation.Values[headerKey] {
				m, ok := v.(float64)
				if ok {
					s := strconv.FormatFloat(m, 'f', -1, 64)
					annotationValues[len(annotationValues)-1] = append(annotationValues[len(annotationValues)-1], s)
				} else {
					m, ok := v.(string)
					if ok {
						annotationValues[len(annotationValues)-1] = append(annotationValues[len(annotationValues)-1], m)
					}
				}
			}
		}

		result.Peak.Annotation.Values = annotationValues
	}

	// insert compound link data
	if record.Compound.Link != nil {
		links := []DatabaseObject{}
		for _, link := range *record.Compound.Link {
			links = append(links, DatabaseObject(link))
		}
		result.Compound.Link = links
	}

	// insert species data
	if record.Species.Name != nil {
		result.Species.Name = *record.Species.Name
	}
	if record.Species.Lineage != nil {
		result.Species.Lineage = *record.Species.Lineage
	}
	if record.Species.Link != nil {
		links := []DatabaseObject{}
		for _, link := range *record.Species.Link {
			links = append(links, DatabaseObject(link))
		}
		result.Species.Link = links
	}
	if record.Species.Sample != nil {
		result.Species.Sample = *record.Species.Sample
	}

	// insert acquisition data
	if *record.Acquisition.Instrument != "" {
		result.Acquisition.Instrument = *record.Acquisition.Instrument
	}
	if *record.Acquisition.InstrumentType != "" {
		result.Acquisition.InstrumentType = *record.Acquisition.InstrumentType
	}
	if record.Acquisition.Chromatography != nil {
		chromatographies := []AcChromatographyInner{}
		for _, chrom := range *record.Acquisition.Chromatography {
			chromatographies = append(chromatographies, AcChromatographyInner(chrom))
		}
		result.Acquisition.Chromatography = chromatographies
	}
	if record.Acquisition.General != nil {
		generals := []AcGeneralInner{}
		for _, general := range *record.Acquisition.General {
			generals = append(generals, AcGeneralInner(general))
		}
		result.Acquisition.General = generals
	}
	if record.Acquisition.MassSpectrometry != nil {
		spectrometry := AcMassSpec{}

		for _, spec := range *record.Acquisition.MassSpectrometry {
			if spec.Subtag == "ION_MODE" {
				spectrometry.IonMode = spec.Value
			} else if spec.Subtag == "MS_TYPE" {
				spectrometry.MsType = spec.Value
			} else {
				if spectrometry.Subtags == nil {
					spectrometry.Subtags = []AcMassSpecSubtagsInner{}
				}
				spectrometry.Subtags = append(spectrometry.Subtags, AcMassSpecSubtagsInner(spec))
			}
		}
		result.Acquisition.MassSpectrometry = spectrometry
	}

	// insert comments data
	if record.Comments != nil {
		comments := []massbank.SubtagProperty{}
		for _, comment := range *record.Comments {
			comments = append(comments, massbank.SubtagProperty(comment))
		}
		*record.Comments = comments
	}

	// insert mass spectrometry data
	if record.MassSpectrometry.DataProcessing != nil {
		dps := []MsDataProcessingInner{}
		for _, dp := range *record.MassSpectrometry.DataProcessing {
			dps = append(dps, MsDataProcessingInner(dp))
		}
		result.MassSpectrometry.DataProcessing = dps
	}
	if record.MassSpectrometry.FocusedIon != nil {
		ions := []MsFocusedIonInner{}
		for _, ion := range *record.MassSpectrometry.FocusedIon {
			ions = append(ions, MsFocusedIonInner(ion))
		}
		result.MassSpectrometry.FocusedIon = ions
	}

	return &result, nil
}

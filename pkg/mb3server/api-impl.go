package mb3server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/MassBank/MassBank3/pkg/config"
	"github.com/MassBank/MassBank3/pkg/database"
	"github.com/MassBank/MassBank3/pkg/massbank"

	mapset "github.com/deckarep/golang-set/v2"
)

var db database.MB3Database = nil
var ServerConfig *config.ServerConfig = nil

func initDB() error {
	var err error
	if db != nil && db.Ping() == nil {
		return nil
	}
	db, err = database.InitDb(ServerConfig.DBConfig)
	return err
}

func GetBrowseOptions(contributor []string, instrumentTyoe []string, msType []string, ionMode string) (*BrowseOptions, error) {
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
		InstrumentType: it,
		Splash:         "",
		MsType:         getMsTypes(msType),
		IonMode:        getIonMode(ionMode),
		CompoundName:   "",
		Mass:           nil,
		MassEpsilon:    nil,
		Formula:        "",
		Peaks:          nil,
		NeutralLoss:    nil,
		Inchi:          "",
		InchiKey:       "",
		Contributor:    co,
		Intensity:      nil,
	}
	vals, err := db.GetUniqueValues(filters)
	if err != nil {
		return nil, err
	}
	var result = BrowseOptions{}
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

func buildFilters(instrumentType []string, splash string, msType []string, ionMode string, compoundName string, compoundClass string, exactMass string, massTolerance float64, formula string, peaks []string, intensity int32, neutralLoss []string, inchi string, inchiKey string, contributor []string) (*database.Filters, error) {
	it := &instrumentType
	if len(*it) == 0 || (len(*it) == 1 && (*it)[0] == "") {
		it = nil
	}
	co := &contributor
	if len(*co) == 0 || (len(*co) == 1 && (*co)[0] == "") {
		co = nil
	}

	var _exactMass *float64
	if exactMass != "" {
		_exactMass2, err := strconv.ParseFloat(exactMass, 64)
		if err != nil {
			return nil, err
		}
		_exactMass = &_exactMass2
	} else {
		_exactMass = nil
	}

	var _peaks *[]float64
	if len(peaks) > 0 && peaks[0] != "" {
		_peaks = &[]float64{}
		for _, p := range peaks {
			peak, err := strconv.ParseFloat(p, 64)
			if err != nil {
				return nil, err
			}
			*_peaks = append(*_peaks, peak)
		}
	} else {
		_peaks = nil
	}

	var _neutralLoss *[]float64
	if len(neutralLoss) > 0 && neutralLoss[0] != "" {
		_neutralLoss = &[]float64{}
		for _, l := range neutralLoss {
			loss, err := strconv.ParseFloat(l, 64)
			if err != nil {
				return nil, err
			}
			*_neutralLoss = append(*_neutralLoss, loss)
		}
	} else {
		_neutralLoss = nil
	}

	_intensity := int64(intensity)

	var filters = database.Filters{
		InstrumentType: it,
		Splash:         splash,
		MsType:         getMsTypes(msType),
		IonMode:        getIonMode(ionMode),
		CompoundName:   compoundName,
		CompoundClass:  compoundClass,
		Mass:           _exactMass,
		MassEpsilon:    &massTolerance,
		Formula:        formula,
		Peaks:          _peaks,
		NeutralLoss:    _neutralLoss,
		Inchi:          inchi,
		InchiKey:       inchiKey,
		Contributor:    co,
		Intensity:      &_intensity,
	}

	return &filters, nil
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

func GetCount() (*int64, error) {
	if err := initDB(); err != nil {
		return nil, err
	}

	count, err := db.Count()
	if err != nil {
		return nil, err
	}
	return &count, nil
}

// func buildMbRecord(record *massbank.MassBank2) *MbRecord {
// 	result := MbRecord{
// 		Accession:  *record.Accession,
// 		Deprecated: MbRecordDeprecated{},
// 		Title:      *record.RecordTitle,
// 		Date: MbRecordDate{
// 			Updated:  record.Date.Updated.String(),
// 			Created:  record.Date.Created.String(),
// 			Modified: record.Date.Modified.String(),
// 		},
// 		Authors:     nil,
// 		License:     "",
// 		Copyright:   "",
// 		Publication: "",
// 		Project:     "",
// 		Comments:    nil,
// 		Compound: MbRecordCompound{
// 			Names:   *record.Compound.Names,
// 			Classes: *record.Compound.Classes,
// 			Formula: *record.Compound.Formula,
// 			Mass:    *record.Compound.Mass,
// 			Smiles:  *record.Compound.Smiles,
// 			Inchi:   *record.Compound.InChI,
// 			Link:    nil,
// 		},
// 		Species: MbRecordSpecies{
// 			Name:    "",
// 			Lineage: nil,
// 			Link:    nil,
// 			Sample:  nil,
// 		},
// 		Acquisition: MbRecordAcquisition{
// 			Instrument:     *record.Acquisition.Instrument,
// 			InstrumentType: *record.Acquisition.InstrumentType,
// 			MassSpectrometry: AcMassSpec{
// 				MsType:  "",
// 				IonMode: "",
// 				Subtags: nil,
// 			},
// 			Chromatography: nil,
// 			General:        nil,
// 			IonMobility:    nil,
// 		},
// 		MassSpectrometry: MbRecordMassSpectrometry{
// 			FocusedIon:     nil,
// 			DataProcessing: nil,
// 		},
// 		Peak: MbRecordPeak{
// 			Splash: *record.Peak.Splash,
// 			Annotation: MbRecordPeakAnnotation{
// 				Header: nil,
// 				Values: nil,
// 			},
// 			NumPeak: int32(*record.Peak.NumPeak),
// 			Peak: MbRecordPeakPeak{
// 				Header: record.Peak.Peak.Header,
// 				Values: nil,
// 			},
// 			NeutralLoss: nil,
// 		},
// 	}
// 	if record.Publication != nil {
// 		result.Publication = *record.Publication
// 	}
// 	if record.License != nil {
// 		result.License = *record.License
// 	}
// 	if record.Copyright != nil {
// 		result.Copyright = *record.Copyright
// 	}
// 	if record.Project != nil {
// 		result.Project = *record.Project
// 	}

// 	// insert authors
// 	if record.Authors != nil {
// 		for _, author := range *record.Authors {
// 			result.Authors = append(result.Authors, AuthorsInner(author))
// 		}
// 	}

// 	// insert peak data
// 	var ids = record.Peak.Peak.Id
// 	var mzs = record.Peak.Peak.Mz
// 	var ints = record.Peak.Peak.Intensity
// 	var rels = record.Peak.Peak.Rel
// 	for i := 0; i < len(mzs); i++ {
// 		result.Peak.Peak.Values = append(result.Peak.Peak.Values, MbRecordPeakPeakValuesInner{
// 			Id:        ids[i],
// 			Mz:        mzs[i],
// 			Intensity: ints[i],
// 			Rel:       rels[i],
// 		})
// 	}

// 	if record.Peak.NeutralLoss != nil {
// 		result.Peak.NeutralLoss = []MbRecordPeakNeutralLossInner{}

// 		var diffs []float64
// 		diffs = append(diffs, record.Peak.NeutralLoss.Difference...)
// 		var peak1_ids []int32
// 		peak1_ids = append(peak1_ids, record.Peak.NeutralLoss.Peak1Id...)
// 		var peak2_ids []int32
// 		peak2_ids = append(peak2_ids, record.Peak.NeutralLoss.Peak2Id...)
// 		// var min_rel_intensities []int32
// 		// for _, min_rel_intensity := range *&record.Peak.NeutralLoss.MinRelIntensity {
// 		// 	min_rel_intensities = append(min_rel_intensities, min_rel_intensity)
// 		// }

// 		for i := 0; i < len(diffs); i++ {
// 			result.Peak.NeutralLoss = append(result.Peak.NeutralLoss, MbRecordPeakNeutralLossInner{
// 				Difference: diffs[i],
// 				Peak1Id:    peak1_ids[i],
// 				Peak2Id:    peak2_ids[i],
// 				// MinRelIntensity: min_rel_intensities[i],
// 			})
// 		}
// 	}

// 	// insert annotation data
// 	if record.Peak.Annotation != nil {
// 		result.Peak.Annotation.Header = record.Peak.Annotation.Header

// 		var annotationValues = [][]string{}
// 		for _, headerKey := range record.Peak.Annotation.Header {
// 			annotationValues = append(annotationValues, []string{})

// 			for _, v := range record.Peak.Annotation.Values[headerKey] {
// 				m, ok := v.(float64)
// 				if ok {
// 					s := strconv.FormatFloat(m, 'f', -1, 64)
// 					annotationValues[len(annotationValues)-1] = append(annotationValues[len(annotationValues)-1], s)
// 				} else {
// 					m, ok := v.(string)
// 					if ok {
// 						annotationValues[len(annotationValues)-1] = append(annotationValues[len(annotationValues)-1], m)
// 					}
// 				}
// 			}
// 		}

// 		result.Peak.Annotation.Values = annotationValues
// 	}

// 	// insert compound link data
// 	if record.Compound.Link != nil {
// 		links := []DatabaseObject{}
// 		for _, link := range *record.Compound.Link {
// 			links = append(links, DatabaseObject(link))
// 		}
// 		result.Compound.Link = links
// 	}

// 	// insert species data
// 	if record.Species.Name != nil {
// 		result.Species.Name = *record.Species.Name
// 	}
// 	if record.Species.Lineage != nil {
// 		result.Species.Lineage = *record.Species.Lineage
// 	}
// 	if record.Species.Link != nil {
// 		links := []DatabaseObject{}
// 		for _, link := range *record.Species.Link {
// 			links = append(links, DatabaseObject(link))
// 		}
// 		result.Species.Link = links
// 	}
// 	if record.Species.Sample != nil {
// 		result.Species.Sample = *record.Species.Sample
// 	}

// 	// insert acquisition data
// 	if *record.Acquisition.Instrument != "" {
// 		result.Acquisition.Instrument = *record.Acquisition.Instrument
// 	}
// 	if *record.Acquisition.InstrumentType != "" {
// 		result.Acquisition.InstrumentType = *record.Acquisition.InstrumentType
// 	}
// 	if record.Acquisition.Chromatography != nil {
// 		chromatographies := []AcChromatographyInner{}
// 		for _, chrom := range *record.Acquisition.Chromatography {
// 			chromatographies = append(chromatographies, AcChromatographyInner(chrom))
// 		}
// 		result.Acquisition.Chromatography = chromatographies
// 	}
// 	if record.Acquisition.General != nil {
// 		generals := []AcGeneralInner{}
// 		for _, general := range *record.Acquisition.General {
// 			generals = append(generals, AcGeneralInner(general))
// 		}
// 		result.Acquisition.General = generals
// 	}
// 	if record.Acquisition.MassSpectrometry != nil {
// 		spectrometry := AcMassSpec{}

// 		for _, spec := range *record.Acquisition.MassSpectrometry {
// 			if spec.Subtag == "ION_MODE" {
// 				spectrometry.IonMode = spec.Value
// 			} else if spec.Subtag == "MS_TYPE" {
// 				spectrometry.MsType = spec.Value
// 			} else {
// 				if spectrometry.Subtags == nil {
// 					spectrometry.Subtags = []AcMassSpecSubtagsInner{}
// 				}
// 				spectrometry.Subtags = append(spectrometry.Subtags, AcMassSpecSubtagsInner(spec))
// 			}
// 		}
// 		result.Acquisition.MassSpectrometry = spectrometry
// 	}

// 	// insert comments data
// 	if record.Comments != nil {
// 		comments := []massbank.SubtagProperty{}
// 		for _, comment := range *record.Comments {
// 			comments = append(comments, massbank.SubtagProperty(comment))
// 		}
// 		*record.Comments = comments
// 	}

// 	// insert mass spectrometry data
// 	if record.MassSpectrometry.DataProcessing != nil {
// 		dps := []MsDataProcessingInner{}
// 		for _, dp := range *record.MassSpectrometry.DataProcessing {
// 			dps = append(dps, MsDataProcessingInner(dp))
// 		}
// 		result.MassSpectrometry.DataProcessing = dps
// 	}
// 	if record.MassSpectrometry.FocusedIon != nil {
// 		ions := []MsFocusedIonInner{}
// 		for _, ion := range *record.MassSpectrometry.FocusedIon {
// 			ions = append(ions, MsFocusedIonInner(ion))
// 		}
// 		result.MassSpectrometry.FocusedIon = ions
// 	}

// 	return &result
// }

func buildSimpleMbRecord(record *massbank.MassBank2) *MbRecord {
	result := MbRecord{
		Accession: *record.Accession,
		Title:     *record.RecordTitle,
		Compound: MbRecordCompound{
			Smiles: *record.Compound.Smiles,
		},
		Peak: MbRecordPeak{
			Peak: MbRecordPeakPeak{
				Header: record.Peak.Peak.Header,
				Values: nil,
			},
		},
	}
	// insert peak data
	var mzs = record.Peak.Peak.Mz
	var ints = record.Peak.Peak.Intensity
	var rels = record.Peak.Peak.Rel
	var ids = record.Peak.Peak.Id
	for i := range mzs {
		result.Peak.Peak.Values = append(result.Peak.Peak.Values, MbRecordPeakPeakValuesInner{
			Mz:        mzs[i],
			Intensity: ints[i],
			Rel:       rels[i],
			Id:        ids[i],
		})
	}
	result.Peak.NumPeak = int32(*record.Peak.NumPeak)

	return &result
}

// func ConvertJsonStringToMb3Record(recordJson string) (*MbRecord, error) {
// 	// Unmarshal the JSON string into the MassBank2 struct
// 	var record MbRecord

// 	if err := json.Unmarshal([]byte(recordJson), &record); err != nil {
// 		fmt.Println("Error unmarshalling JSON: ", err)
// 		return nil, err
// 	}

// 	return &record, nil
// }

func GetRecord(accession string) (*MbRecord, error) {
	if err := initDB(); err != nil {
		return nil, err
	}
	resultMb2, err := db.GetRecord(&accession)
	if err != nil {
		return nil, err
	}

	result, err := ConvertMb2RecordToMb3Record(resultMb2)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func GetSimpleRecord(accession string) (*MbRecord, error) {
	if err := initDB(); err != nil {
		return nil, err
	}
	record, err := db.GetSimpleRecord(&accession)
	if err != nil {
		return nil, err
	}
	result := *buildSimpleMbRecord(record)

	return &result, nil
}

func GetRecords(contributor []string, instrumentType []string, msType []string, ionMode string, splash string, compoundName string, compoundClass string, exactMass string, massTolerance float64, formula string, peaks []string, intensity int32, neutralLoss []string, peakList []string, peakListThreshold float64, inchi string, inchiKey string, substructure string) (*[]MbRecord, error) {
	if err := initDB(); err != nil {
		return nil, err
	}

	searchResult, err := GetSearchResults(contributor, instrumentType, msType, ionMode, splash, compoundName, compoundClass, exactMass, massTolerance, formula, peaks, intensity, neutralLoss, peakList, peakListThreshold, inchi, inchiKey, substructure)
	if err != nil {
		return nil, err
	}

	result := []MbRecord{}
	accessions := []string{}
	for _, searchResultDataInner := range searchResult.Data {
		accessions = append(accessions, searchResultDataInner.Accession)
	}
	recordStrings, err := db.GetRecords(&accessions)
	if err != nil {
		return nil, err
	}
	for _, recordString := range *recordStrings {
		record, err := ConvertJsonStringToMb3Record(recordString)
		if err != nil {
			return nil, err
		}
		result = append(result, *record)
	}

	return &result, nil
}

func GetVersion() (string, error) {

	content, err := os.ReadFile("mb_version.txt")
	if err != nil {
		return "v1.0.0 (default)", nil
	}
	version := strings.TrimSpace(string(content))
	if version == "" {
		return "v1.0.0 (default)", nil
	}
	return version, nil
}

func GetStatus() (GetStatus200Response, error) {
	postgresStatus := GetStatus200ResponsePostgres{
		Status: "OK",
		Error:  "",
	}
	export_service_status := GetStatus200ResponseExportService{
		Status: "OK",
		Error:  "",
	}
	similarity_service_status := GetStatus200ResponseSimilarityService{
		Status: "OK",
		Error:  "",
	}

	if err := initDB(); err != nil {
		postgresStatus.Status = "ERROR"
		postgresStatus.Error = err.Error()
	}

	exportServiceUrl := getEnv("EXPORT_SERVICE_URL", "http://export-service:8080")
	requestURL := exportServiceUrl + "/version"
	res, err := http.Get(requestURL)
	if err != nil {
		export_service_status.Status = "ERROR"
		export_service_status.Error = err.Error()
	} else {
		if res.StatusCode != 200 {
			export_service_status.Status = "ERROR"
			export_service_status.Error = "Export service returned status code " + strconv.Itoa(res.StatusCode)
		}
	}

	similarityServiceUrl := getEnv("SIMILARITY_SERVICE_COSINE_URL", "http://similarity-service:8080")
	requestURL = similarityServiceUrl + "/version"
	res, err = http.Get(requestURL)
	if err != nil {
		similarity_service_status.Status = "ERROR"
		similarity_service_status.Error = err.Error()
	} else {
		if res.StatusCode != 200 {
			similarity_service_status.Status = "ERROR"
			similarity_service_status.Error = "Similarity service returned status code " + strconv.Itoa(res.StatusCode)
		}
	}

	return GetStatus200Response{
		Postgres:          postgresStatus,
		ExportService:     export_service_status,
		SimilarityService: similarity_service_status,
	}, nil
}

func GetMetadata() (*Metadata, error) {
	if err := initDB(); err != nil {
		return nil, err
	}
	metadata, err := db.GetMetadata()
	if err != nil {
		return nil, err
	}

	result := Metadata{
		Version:              metadata.Version,
		Timestamp:            metadata.Timestamp,
		GitCommit:            metadata.GitCommit,
		SpectraCount:         int32(metadata.SpectraCount),
		CompoundCount:        int32(metadata.CompoundCount),
		CompoundClass:        []MetadataCompoundClassInner{},
		CompoundClassChemont: []MetadataCompoundClassInner{},
	}

	for i, compoundClass := range metadata.CompoundClass {
		result.CompoundClass = append(result.CompoundClass, MetadataCompoundClassInner{
			Name:  compoundClass,
			Count: int32(metadata.CompoundClassCount[i]),
		})
	}
	for i, compoundClassChemOnt := range metadata.CompoundClassChemOnt {
		result.CompoundClassChemont = append(result.CompoundClassChemont, MetadataCompoundClassInner{
			Name:  compoundClassChemOnt,
			Count: int32(metadata.CompoundClassCountChemOnt[i]),
		})
	}

	return &result, nil
}

func GetSearchResults(contributor []string, instrumentType []string, msType []string, ionMode string, splash string, compoundName string, compoundClass string, exactMass string, massTolerance float64, formula string, peaks []string, intensity int32, neutralLoss []string, peakList []string, peakListThreshold float64, inchi string, inchiKey string, substructure string) (*SearchResult, error) {
	if err := initDB(); err != nil {
		return nil, err
	}

	var err error
	atomCountResultMap := make(map[string]int32)

	// substructure search
	setSubstructureSearch := mapset.NewSet[string]()

	accessionsSubstructureSearch := []string{}
	checkSubstructure := substructure != ""
	if checkSubstructure {
		// fmt.Println(" -> filter by substructure")
		var atomCountsSubstructureSearch []int32
		accessionsSubstructureSearch, atomCountsSubstructureSearch, err = db.GetAccessionsBySubstructure(substructure)
		if err != nil {
			return nil, err
		}
		for i, accession := range accessionsSubstructureSearch {
			setSubstructureSearch.Add(accession)
			atomCountResultMap[accession] = atomCountsSubstructureSearch[i]
		}
		// fmt.Println("recordsSubstructureSearch: ", len(accessionsSubstructureSearch))
	}

	// similarity search
	setSimilaritySearch := mapset.NewSet[string]()
	similarityResultMap := make(map[string]float32)

	similaritySearchResult := &SimilaritySearchResult{}
	checkSimilarity := len(peakList) > 0 && peakList[0] != ""
	if checkSimilarity {
		// fmt.Println(" -> filter by Similarity")
		similaritySearchResult, err = GetSimilarity(peakList, peakListThreshold, []string{})
		if err != nil {
			return nil, err
		}
		for _, similarityResult := range similaritySearchResult.Data {
			setSimilaritySearch.Add(similarityResult.Accession)
			similarityResultMap[similarityResult.Accession] = similarityResult.Score
			atomCountResultMap[similarityResult.Accession] = similarityResult.Atomcount
		}
		// fmt.Println("similaritySearchResult: ", len(similaritySearchResult.Data))
	}

	// filter search
	filters, err := buildFilters(instrumentType, splash, msType, ionMode, compoundName, compoundClass, exactMass, massTolerance, formula, peaks, intensity, neutralLoss, inchi, inchiKey, contributor)
	if err != nil {
		return nil, err
	}
	// fmt.Println("filters: ", filters)

	// neutral loss search, only if filters.NeutralLoss is given
	checkNeutralLoss := filters.NeutralLoss != nil && len(*filters.NeutralLoss) > 0 && filters.MassEpsilon != nil

	setNeutralLossSearch := mapset.NewSet[string]()
	neutralLossResultMap := make(map[string][]string)
	accessionsNeutralLossSearch := []string{}
	if checkNeutralLoss {
		// fmt.Println(" -> filter by NeutralLoss")
		var atomCountsNeutralLossSearch []int32
		var peakPairs map[string][]string
		accessionsNeutralLossSearch, atomCountsNeutralLossSearch, peakPairs, err = db.NeutralLossSearch(filters.NeutralLoss, filters.MassEpsilon, filters.Intensity)
		if err != nil {
			return nil, err
		}
		for i, accession := range accessionsNeutralLossSearch {
			setNeutralLossSearch.Add(accession)
			if _, ok := neutralLossResultMap[accession]; !ok {
				neutralLossResultMap[accession] = []string{}
			}
			neutralLossResultMap[accession] = peakPairs[accession]
			atomCountResultMap[accession] = atomCountsNeutralLossSearch[i]
		}
	}

	checkFilters := (!checkSimilarity && !checkSubstructure && !checkNeutralLoss) || filters.CompoundName != "" || filters.CompoundClass != "" || filters.Mass != nil || filters.Formula != "" ||
		filters.Peaks != nil || filters.Inchi != "" ||
		filters.InchiKey != "" || filters.Splash != "" || filters.IonMode != massbank.ANY ||
		filters.MsType != nil || filters.InstrumentType != nil || filters.Contributor != nil

	setFilterSearch := mapset.NewSet[string]()

	accessionsFilters := []string{}
	if checkFilters {
		// fmt.Println(" -> filter by Filters")
		var atomCountsFilters []int32
		accessionsFilters, atomCountsFilters, err = db.GetAccessionsByFilterOptions(*filters)
		if err != nil {
			return nil, err
		}
		for i, accession := range accessionsFilters {
			setFilterSearch.Add(accession)
			atomCountResultMap[accession] = atomCountsFilters[i]
		}
		// fmt.Println("recordsFilters: ", len(accessionsFilters))
	}

	// merge search results
	results := &SearchResult{}
	results.Data = []SearchResultDataInner{}

	if checkSubstructure && checkSimilarity && checkNeutralLoss && checkFilters {
		// fmt.Println(" -> combined results (substructure + similarity + neutral loss + filters)")
		intersection := setSubstructureSearch.Intersect(setSimilaritySearch).Intersect(setNeutralLossSearch).Intersect(setFilterSearch)
		for _, accession := range intersection.ToSlice() {
			var peakPairs []string
			if _, ok := neutralLossResultMap[accession]; ok {
				peakPairs = neutralLossResultMap[accession]
			} else {
				peakPairs = []string{}
			}
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Score:     similarityResultMap[accession],
				Atomcount: atomCountResultMap[accession],
				PeakPairs: peakPairs,
			}
			results.Data = append(results.Data, searchResultData)
		}
		sort.Slice(results.Data, func(i, j int) bool {
			return results.Data[i].Score > results.Data[j].Score
		})
	} else if checkSubstructure && checkSimilarity && checkNeutralLoss && !checkFilters {
		// fmt.Println(" -> combined results (substructure + similarity + neutral loss)")
		intersection := setSubstructureSearch.Intersect(setSimilaritySearch).Intersect(setNeutralLossSearch)
		for _, accession := range intersection.ToSlice() {
			var peakPairs []string
			if _, ok := neutralLossResultMap[accession]; ok {
				peakPairs = neutralLossResultMap[accession]
			} else {
				peakPairs = []string{}
			}
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Score:     similarityResultMap[accession],
				Atomcount: atomCountResultMap[accession],
				PeakPairs: peakPairs,
			}
			results.Data = append(results.Data, searchResultData)
		}
		sort.Slice(results.Data, func(i, j int) bool {
			return results.Data[i].Score > results.Data[j].Score
		})
	} else if checkSubstructure && checkSimilarity && !checkNeutralLoss && checkFilters {
		// fmt.Println(" -> combined results (substructure + similarity + filters)")
		intersection := setSubstructureSearch.Intersect(setSimilaritySearch).Intersect(setFilterSearch)
		for _, accession := range intersection.ToSlice() {
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Score:     similarityResultMap[accession],
				Atomcount: atomCountResultMap[accession],
			}
			results.Data = append(results.Data, searchResultData)
		}
		sort.Slice(results.Data, func(i, j int) bool {
			return results.Data[i].Score > results.Data[j].Score
		})
	} else if checkSubstructure && !checkSimilarity && checkNeutralLoss && checkFilters {
		// fmt.Println(" -> combined results (substructure + neutral loss + filters)")
		intersection := setSubstructureSearch.Intersect(setNeutralLossSearch).Intersect(setFilterSearch)
		for _, accession := range intersection.ToSlice() {
			var peakPairs []string
			if _, ok := neutralLossResultMap[accession]; ok {
				peakPairs = neutralLossResultMap[accession]
			} else {
				peakPairs = []string{}
			}
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Atomcount: atomCountResultMap[accession],
				PeakPairs: peakPairs,
			}
			results.Data = append(results.Data, searchResultData)
		}
	} else if !checkSubstructure && checkSimilarity && checkNeutralLoss && checkFilters {
		// fmt.Println(" -> combined results (similarity + neutral loss + filters)")
		intersection := setSimilaritySearch.Intersect(setNeutralLossSearch).Intersect(setFilterSearch)
		for _, accession := range intersection.ToSlice() {
			var peakPairs []string
			if _, ok := neutralLossResultMap[accession]; ok {
				peakPairs = neutralLossResultMap[accession]
			} else {
				peakPairs = []string{}
			}
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Score:     similarityResultMap[accession],
				Atomcount: atomCountResultMap[accession],
				PeakPairs: peakPairs,
			}
			results.Data = append(results.Data, searchResultData)
		}
		sort.Slice(results.Data, func(i, j int) bool {
			return results.Data[i].Score > results.Data[j].Score
		})
	} else if checkSubstructure && checkSimilarity && !checkNeutralLoss && !checkFilters {
		// fmt.Println(" -> combined results (substructure + similarity)")
		intersection := setSubstructureSearch.Intersect(setSimilaritySearch)
		for _, accession := range intersection.ToSlice() {
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Score:     similarityResultMap[accession],
				Atomcount: atomCountResultMap[accession],
			}
			results.Data = append(results.Data, searchResultData)
		}
		sort.Slice(results.Data, func(i, j int) bool {
			return results.Data[i].Score > results.Data[j].Score
		})
	} else if checkSubstructure && !checkSimilarity && checkNeutralLoss && !checkFilters {
		// fmt.Println(" -> combined results (substructure + neutral loss)")
		intersection := setSubstructureSearch.Intersect(setNeutralLossSearch)
		for _, accession := range intersection.ToSlice() {
			var peakPairs []string
			if _, ok := neutralLossResultMap[accession]; ok {
				peakPairs = neutralLossResultMap[accession]
			} else {
				peakPairs = []string{}
			}
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Atomcount: atomCountResultMap[accession],
				PeakPairs: peakPairs,
			}
			results.Data = append(results.Data, searchResultData)
		}
	} else if !checkSubstructure && checkSimilarity && checkNeutralLoss && !checkFilters {
		// fmt.Println(" -> combined results (similarity + neutral loss)")
		intersection := setSimilaritySearch.Intersect(setNeutralLossSearch)
		for _, accession := range intersection.ToSlice() {
			var peakPairs []string
			if _, ok := neutralLossResultMap[accession]; ok {
				peakPairs = neutralLossResultMap[accession]
			} else {
				peakPairs = []string{}
			}
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Score:     similarityResultMap[accession],
				Atomcount: atomCountResultMap[accession],
				PeakPairs: peakPairs,
			}
			results.Data = append(results.Data, searchResultData)
		}
		sort.Slice(results.Data, func(i, j int) bool {
			return results.Data[i].Score > results.Data[j].Score
		})
	} else if checkSubstructure && !checkSimilarity && !checkNeutralLoss && checkFilters {
		// fmt.Println(" -> combined results (substructure + filters)")
		intersection := setSubstructureSearch.Intersect(setFilterSearch)
		for _, accession := range intersection.ToSlice() {
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Atomcount: atomCountResultMap[accession],
			}
			results.Data = append(results.Data, searchResultData)
		}
	} else if !checkSubstructure && checkSimilarity && !checkNeutralLoss && checkFilters {
		// fmt.Println(" -> combined results (similarity + filters)")
		intersection := setSimilaritySearch.Intersect(setFilterSearch)
		for _, accession := range intersection.ToSlice() {
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Score:     similarityResultMap[accession],
				Atomcount: atomCountResultMap[accession],
			}
			results.Data = append(results.Data, searchResultData)
		}
		sort.Slice(results.Data, func(i, j int) bool {
			return results.Data[i].Score > results.Data[j].Score
		})
	} else if !checkSubstructure && !checkSimilarity && checkNeutralLoss && checkFilters {
		// fmt.Println(" -> combined results (neutral loss + filters)")
		intersection := setNeutralLossSearch.Intersect(setFilterSearch)
		for _, accession := range intersection.ToSlice() {
			var peakPairs []string
			if _, ok := neutralLossResultMap[accession]; ok {
				peakPairs = neutralLossResultMap[accession]
			} else {
				peakPairs = []string{}
			}
			searchResultData := SearchResultDataInner{
				Accession: accession,
				Atomcount: atomCountResultMap[accession],
				PeakPairs: peakPairs,
			}
			results.Data = append(results.Data, searchResultData)
		}
	} else {
		// fmt.Println("no combined results found -> single results")
		if checkSimilarity && !checkFilters && !checkSubstructure && !checkNeutralLoss {
			// fmt.Println(" -> single results (similarity)")
			for _, similarityResult := range similaritySearchResult.Data {
				results.Data = append(results.Data, SearchResultDataInner{
					Accession: similarityResult.Accession,
					Score:     similarityResult.Score,
					Atomcount: similarityResult.Atomcount,
				})
			}
		} else if checkFilters && !checkSimilarity && !checkSubstructure && !checkNeutralLoss {
			// fmt.Println(" -> single results (filters)")
			for _, accession := range accessionsFilters {
				var peakPairs []string
				if _, ok := neutralLossResultMap[accession]; ok {
					peakPairs = neutralLossResultMap[accession]
				} else {
					peakPairs = []string{}
				}
				searchResultData := SearchResultDataInner{
					Accession: accession,
					Atomcount: atomCountResultMap[accession],
					PeakPairs: peakPairs,
				}
				results.Data = append(results.Data, searchResultData)
			}
		} else if checkSubstructure && !checkSimilarity && !checkFilters && !checkNeutralLoss {
			// fmt.Println(" -> single results (substructure)")
			for _, accession := range accessionsSubstructureSearch {
				searchResultData := SearchResultDataInner{
					Accession: accession,
					Atomcount: atomCountResultMap[accession],
				}
				results.Data = append(results.Data, searchResultData)
			}
		} else if checkNeutralLoss && !checkSimilarity && !checkFilters && !checkSubstructure {
			// fmt.Println(" -> single results (neutral loss)")
			for _, accession := range accessionsNeutralLossSearch {
				var peakPairs []string
				if _, ok := neutralLossResultMap[accession]; ok {
					peakPairs = neutralLossResultMap[accession]
				} else {
					peakPairs = []string{}
				}
				searchResultData := SearchResultDataInner{
					Accession: accession,
					Atomcount: atomCountResultMap[accession],
					PeakPairs: peakPairs,
				}
				results.Data = append(results.Data, searchResultData)
			}
		}
	}

	// fmt.Println("results: ", len(results.Data))

	return results, nil
}

func getEnv(name string, fallback string) string {
	if value, ok := os.LookupEnv(name); ok {
		return value
	}
	return fallback
}

func GetSimilarity(peakList []string, threshold float64, referenceSpectraList []string) (*SimilaritySearchResult, error) {
	sort.Slice(peakList, func(i, j int) bool {
		split1 := strings.Split(peakList[i], ";")
		split2 := strings.Split(peakList[j], ";")
		mz1, err := strconv.ParseFloat(split1[0], 64)
		if err != nil {
			return false
		}
		mz2, err := strconv.ParseFloat(split2[0], 64)
		if err != nil {
			return false
		}
		return mz1 < mz2
	})
	// fmt.Println("peakList: ", peakList)
	// fmt.Println("referenceSpectraList: ", referenceSpectraList)
	// fmt.Println("limit: ", limit)
	// fmt.Println("threshold: ", threshold)

	if err := initDB(); err != nil {
		return nil, err
	}

	type datatype1 struct {
		Mz        float64 `json:"mz"`
		Intensity float64 `json:"intensity"`
	}
	peakListParam := []datatype1{}
	for _, pl := range peakList {
		split := strings.Split(pl, ";")
		mzStr := split[0]
		relStr := split[1]
		mz, err := strconv.ParseFloat(mzStr, 64)
		if err != nil {
			return nil, err
		}
		rel, err := strconv.ParseFloat(relStr, 64)
		if err != nil {
			return nil, err
		}
		peakListParam = append(peakListParam, datatype1{Mz: mz, Intensity: rel})
	}

	similarityServiceUrl := getEnv("SIMILARITY_SERVICE_COSINE_URL", "http://similarity-service:8080")
	requestURL := similarityServiceUrl + "/similarity"

	type datatype2 struct {
		PeakList             []datatype1 `json:"peak_list"`
		ReferenceSpectraList []string    `json:"reference_spectra_list"`
	}

	data := datatype2{}
	data.PeakList = peakListParam
	if len(referenceSpectraList) == 1 && referenceSpectraList[0] == "" {
		data.ReferenceSpectraList = []string{}
	} else {
		data.ReferenceSpectraList = referenceSpectraList
	}

	b := new(bytes.Buffer)
	json.NewEncoder(b).Encode(data)
	req, err := http.NewRequest(http.MethodPost, requestURL, b)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	if err != nil {
		return nil, err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	type SimilarityScoreListInner struct {
		Accession       string  `json:"accession"`
		SimilarityScore float64 `json:"similarity_score"`
	}
	type SimilarityScoreList struct {
		SimilarityScoreList []SimilarityScoreListInner `json:"similarity_score_list"`
	}

	var result SimilarityScoreList
	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return nil, err
	}

	records := SimilaritySearchResult{}
	records.Data = []SimilaritySearchResultDataInner{}
	for _, res := range result.SimilarityScoreList {
		if threshold <= 0 || res.SimilarityScore >= threshold {
			records.Data = append(records.Data, SimilaritySearchResultDataInner{
				Accession: res.Accession,
				Score:     float32(res.SimilarityScore),
			})
		}
	}

	return &records, nil
}

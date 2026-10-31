package database

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/MassBank/MassBank3/pkg/massbank"
	"github.com/lib/pq"
)

type jpaKeyValue struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type jpaRecord struct {
	Accession      string        `json:"accession"`
	Title          []string      `json:"record_title"`
	Date           string        `json:"date"`
	Authors        string        `json:"authors"`
	License        string        `json:"license"`
	Copyright      *string       `json:"copyright"`
	Publication    *string       `json:"publication"`
	Project        *string       `json:"project"`
	Comments       []string      `json:"comment"`
	Names          []string      `json:"ch_name"`
	Classes        []string      `json:"ch_compound_class"`
	Formula        string        `json:"ch_formula"`
	Mass           float64       `json:"ch_exact_mass"`
	Smiles         string        `json:"ch_smiles"`
	Inchi          string        `json:"ch_iupac"`
	Links          []jpaKeyValue `json:"ch_link"`
	SpeciesName    *string       `json:"sp_scientific_name"`
	Lineage        string        `json:"sp_lineage"`
	SpeciesLinks   []jpaKeyValue `json:"sp_link"`
	Samples        []string      `json:"sp_sample"`
	Instrument     string        `json:"ac_instrument"`
	InstrumentType string        `json:"ac_instrument_type"`
	MsType         string        `json:"ac_mass_spectrometry_ms_type"`
	IonMode        string        `json:"ac_mass_spectrometry_ion_mode"`
	MassSpec       []jpaKeyValue `json:"ac_mass_spectrometry"`
	Chromatography []jpaKeyValue `json:"ac_chromatography"`
	FocusedIon     []jpaKeyValue `json:"ms_focused_ion"`
	DataProcessing []jpaKeyValue `json:"ms_data_processing"`
	Splash         string        `json:"pk_splash"`
	Annotation     struct {
		Header []string `json:"header"`
		Rows   []struct {
			Mz      float64  `json:"mz"`
			Columns []string `json:"columns"`
		} `json:"rows"`
	} `json:"pk_annotation"`
	Peaks []struct {
		ID        int32   `json:"id"`
		Mz        float64 `json:"mz"`
		Intensity float64 `json:"intensity"`
		Rel       int32   `json:"rel"`
	} `json:"peaks"`
}

func subtagProperties(values []jpaKeyValue) *[]massbank.SubtagProperty {
	result := make([]massbank.SubtagProperty, 0, len(values))
	for _, v := range values {
		result = append(result, massbank.SubtagProperty{Subtag: v.Key, Value: v.Value})
	}
	return &result
}

func databaseProperties(values []jpaKeyValue) *[]massbank.DatabaseProperty {
	result := make([]massbank.DatabaseProperty, 0, len(values))
	for _, v := range values {
		result = append(result, massbank.DatabaseProperty{Database: v.Key, Identifier: v.Value})
	}
	return &result
}

func decodeJPARecord(document []byte) (*massbank.MassBank2, error) {
	var r jpaRecord
	if err := json.Unmarshal(document, &r); err != nil {
		return nil, err
	}
	parts := strings.Split(r.Accession, "-")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid JPA accession %q", r.Accession)
	}
	title := strings.Join(r.Title, "; ")
	date, err := massbank.ParseRecordDate(r.Date)
	if err != nil {
		return nil, fmt.Errorf("DATE for %s: %w", r.Accession, err)
	}
	authors, err := massbank.ParseRecordAuthorNames(r.Authors)
	if err != nil {
		return nil, fmt.Errorf("AUTHORS for %s: %w", r.Accession, err)
	}
	comments := []massbank.SubtagProperty{}
	for _, comment := range r.Comments {
		value, err := massbank.ParseSubtagProperty(comment, "COMMENT")
		if err != nil {
			return nil, fmt.Errorf("COMMENT for %s: %w", r.Accession, err)
		}
		comments = append(comments, *value)
	}
	lineage := []string{}
	if r.Lineage != "" {
		lineage = strings.Split(r.Lineage, "; ")
	}
	massSpec := append([]jpaKeyValue{{Key: "MS_TYPE", Value: r.MsType}, {Key: "ION_MODE", Value: r.IonMode}}, r.MassSpec...)
	atomCount := uint(getAtomCount(r.Formula))
	peaks := &massbank.PkPeak{
		Header: []string{"m/z", "int.", "rel.int."},
		Id:     []int32{}, Mz: []float64{}, Intensity: []float64{}, Rel: []int32{},
	}
	for _, peak := range r.Peaks {
		peaks.Id = append(peaks.Id, peak.ID)
		peaks.Mz = append(peaks.Mz, peak.Mz)
		peaks.Intensity = append(peaks.Intensity, peak.Intensity)
		peaks.Rel = append(peaks.Rel, peak.Rel)
	}
	count := uint(len(r.Peaks))
	result := &massbank.MassBank2{
		Accession: &r.Accession, Contributor: &parts[1], RecordTitle: &title,
		Date: date, Authors: authors, License: &r.License, Copyright: r.Copyright,
		Publication: r.Publication, Project: r.Project, Comments: &comments,
		Compound: massbank.CompoundProperties{
			Names: &r.Names, Classes: &r.Classes, Formula: &r.Formula,
			Mass: &r.Mass, Smiles: &r.Smiles, InChI: &r.Inchi,
			Link: databaseProperties(r.Links), AtomCount: &atomCount,
		},
		Species: massbank.SpeciesProperties{
			Name: r.SpeciesName, Lineage: &lineage, Link: databaseProperties(r.SpeciesLinks), Sample: &r.Samples,
		},
		Acquisition: massbank.AcquisitionProperties{
			Instrument: &r.Instrument, InstrumentType: &r.InstrumentType,
			MassSpectrometry: subtagProperties(massSpec), Chromatography: subtagProperties(r.Chromatography),
		},
		MassSpectrometry: massbank.MassSpecProperties{
			FocusedIon: subtagProperties(r.FocusedIon), DataProcessing: subtagProperties(r.DataProcessing),
		},
		Peak: massbank.PeakProperties{Splash: &r.Splash, NumPeak: &count, Peak: peaks},
	}
	if len(r.Annotation.Header) > 0 {
		annotation := &massbank.PkAnnotation{Header: r.Annotation.Header, Values: map[string][]any{}}
		for _, row := range r.Annotation.Rows {
			if len(row.Columns)+1 != len(annotation.Header) {
				return nil, fmt.Errorf("invalid peak annotation for %s", r.Accession)
			}
			annotation.Values[annotation.Header[0]] = append(annotation.Values[annotation.Header[0]], row.Mz)
			for i, value := range row.Columns {
				key := annotation.Header[i+1]
				annotation.Values[key] = append(annotation.Values[key], value)
			}
		}
		result.Peak.Annotation = annotation
	}
	return result, nil
}

func (p *PostgresSQLDB) ReadRecords(accessions []string) ([]*massbank.MassBank2, error) {
	result := []*massbank.MassBank2{}
	if len(accessions) == 0 {
		return result, nil
	}
	if !p.shared {
		for _, accession := range accessions {
			record, err := p.GetRecord(&accession)
			if err != nil {
				return nil, err
			}
			result = append(result, record)
		}
		return result, nil
	}
	rows, err := p.database.Query(
		"SELECT document FROM massbank_api.record_data WHERE accession = ANY($1) ORDER BY accession",
		pq.Array(accessions))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var document []byte
		if err := rows.Scan(&document); err != nil {
			return nil, err
		}
		record, err := decodeJPARecord(document)
		if err != nil {
			return nil, err
		}
		result = append(result, record)
	}
	return result, rows.Err()
}

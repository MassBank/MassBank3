package mb3server

import (
	"encoding/json"
	"reflect"
	"testing"

	"github.com/MassBank/MassBank3/pkg/massbank"
)

func TestSourceDatesInRecordJSON(t *testing.T) {
	for _, tt := range []struct {
		source string
		want   map[string]string
	}{
		{"2012.10.22 (Created 2008.05.12)", map[string]string{"updated": "2012-10-22", "created": "2008-05-12"}},
		{"2016.01.19 (Created 2006.12.21, modified 2011.05.06)", map[string]string{"updated": "2016-01-19", "created": "2006-12-21", "modified": "2011-05-06"}},
		{"2025.01.17", map[string]string{"updated": "2025-01-17"}},
	} {
		t.Run(tt.source, func(t *testing.T) {
			date, err := massbank.ParseRecordDate(tt.source)
			if err != nil {
				t.Fatal(err)
			}
			record, err := ConvertMb2RecordToMb3Record(minimalRecord(date))
			if err != nil {
				t.Fatal(err)
			}
			body, err := json.Marshal(record)
			if err != nil {
				t.Fatal(err)
			}
			var response struct {
				Date map[string]string `json:"date"`
			}
			if err := json.Unmarshal(body, &response); err != nil {
				t.Fatal(err)
			}
			if !reflect.DeepEqual(response.Date, tt.want) {
				t.Fatalf("date=%v; want %v", response.Date, tt.want)
			}
		})
	}
}

func TestRecordConversionRejectsMissingDate(t *testing.T) {
	for _, date := range []*massbank.RecordDate{nil, {}} {
		if _, err := ConvertMb2RecordToMb3Record(&massbank.MassBank2{Date: date}); err == nil {
			t.Fatal("accepted a record without DATE")
		}
	}
}

func minimalRecord(date *massbank.RecordDate) *massbank.MassBank2 {
	text, names, mass, count := "test", []string{"test"}, 1.0, uint(0)
	return &massbank.MassBank2{
		Accession: &text, RecordTitle: &text, Date: date,
		Compound:    massbank.CompoundProperties{Names: &names, Formula: &text, Mass: &mass, Smiles: &text, InChI: &text},
		Acquisition: massbank.AcquisitionProperties{Instrument: &text, InstrumentType: &text},
		Peak:        massbank.PeakProperties{Splash: &text, NumPeak: &count, Peak: &massbank.PkPeak{}},
	}
}

func TestCommentsInRecordJSON(t *testing.T) {
	date, err := massbank.ParseRecordDate("2025.01.17")
	if err != nil {
		t.Fatal(err)
	}
	for _, comments := range [][]string{
		nil, {},
		{"CONFIDENCE  Predicted", "NATIVE_RUN_ID file.mzML", "  spaces  ", `quotes " and \ slash`, "\u00b5", "same", "same"},
	} {
		want := append([]string(nil), comments...)
		source := minimalRecord(date)
		source.Comments = &comments
		got, err := ConvertMb2RecordToMb3Record(source)
		if err != nil {
			t.Fatal(err)
		}
		body, err := json.Marshal(got)
		if err != nil {
			t.Fatal(err)
		}
		var decoded struct {
			Comments []string `json:"comments"`
		}
		if err := json.Unmarshal(body, &decoded); err != nil {
			t.Fatal(err)
		}
		if len(want) > 0 && !reflect.DeepEqual(decoded.Comments, want) {
			t.Fatalf("comments changed in %s", body)
		}
		if len(want) == 0 {
			var fields map[string]json.RawMessage
			if err := json.Unmarshal(body, &fields); err != nil {
				t.Fatal(err)
			}
			if _, present := fields["comments"]; present {
				t.Fatalf("empty optional comments were not omitted: %s", body)
			}
		}
		if len(want) > 0 {
			got.Comments[0] = "changed output"
			if !reflect.DeepEqual(*source.Comments, want) {
				t.Fatal("converter aliased or mutated input comments")
			}
		}
	}
}

func TestZeroPeakValuesAreNotOmitted(t *testing.T) {
	for _, peak := range []MbRecordPeakPeakValuesInner{
		{},
		{Id: 1, Mz: 107.04, Intensity: 100, Rel: 0},
	} {
		body, err := json.Marshal(peak)
		if err != nil {
			t.Fatal(err)
		}
		var got map[string]float64
		if err := json.Unmarshal(body, &got); err != nil {
			t.Fatal(err)
		}
		for key, want := range map[string]float64{
			"mz": peak.Mz, "intensity": peak.Intensity, "rel": float64(peak.Rel),
		} {
			if value, ok := got[key]; !ok || value != want {
				t.Fatalf("lost source value %s=%v in %s", key, want, body)
			}
		}
	}
}

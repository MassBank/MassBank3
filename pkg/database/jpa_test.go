package database

import (
	"database/sql"
	"encoding/json"
	"errors"
	"os"
	"reflect"
	"strings"
	"testing"

	"github.com/MassBank/MassBank3/pkg/massbank"
	"github.com/lib/pq"
)

func TestDecodeJPARecord(t *testing.T) {
	document := []byte(`{
		"accession":"MSBNK-Test-A1", "record_title":["Ethanol","LC-ESI-QTOF","MS2"],
		"date":"2026.01.02 (Created 2025.01.02, modified 2025.06.01)",
		"authors":"One, Two", "license":"CC0", "ch_name":["Ethanol"], "ch_formula":"C2H6O",
		"comment":["CONFIDENCE Reference standard", "Free text"],
		"ch_exact_mass":46.0419, "ch_smiles":"CCO", "ch_iupac":"InChI=1S/C2H6O",
		"ch_link":[{"key":"INCHIKEY","value":"LFQSCWFLJHTTHZ-UHFFFAOYSA-N"}],
		"ac_mass_spectrometry_ms_type":"MS2","ac_mass_spectrometry_ion_mode":"POSITIVE",
		"ms_focused_ion":[{"key":"PRECURSOR_M/Z","value":"47.0492"}],
		"pk_annotation":{"header":["m/z","formula"],"rows":[{"mz":31.0184,"columns":["CH3O+"]}]},
		"peaks":[{"id":123,"mz":31.0184,"intensity":1000,"rel":999}]
	}`)
	r, err := decodeJPARecord(document)
	if err != nil {
		t.Fatal(err)
	}
	if *r.RecordTitle != "Ethanol; LC-ESI-QTOF; MS2" || r.Date.Created.Year() != 2025 ||
		r.Date.Modified.Month() != 6 || *r.Compound.AtomCount != 9 || r.Peak.Peak.Id[0] != 123 {
		t.Fatalf("incorrect record conversion: %+v", r)
	}
	if (*r.Compound.Link)[0].Database != "INCHIKEY" ||
		(*r.Acquisition.MassSpectrometry)[0].Value != "MS2" ||
		r.Peak.Annotation.Values["formula"][0] != "CH3O+" ||
		(*r.Comments)[0] != "CONFIDENCE Reference standard" || (*r.Comments)[1] != "Free text" {
		t.Fatal("lost JPA collection or annotation values")
	}
	for _, invalid := range []string{
		`{"accession":"bad","date":"2026.01.02"}`,
		`{"accession":"MSBNK-Test-A1","date":"bad"}`,
		`{"accession":"MSBNK-Test-A1","date":"2026.01.02","pk_annotation":{"header":["m/z"],"rows":[{"mz":1,"columns":["extra"]}]}}`,
	} {
		if _, err := decodeJPARecord([]byte(invalid)); err == nil {
			t.Fatalf("accepted invalid JPA data: %s", invalid)
		}
	}
}

func TestJPACommentsAreLiteralValues(t *testing.T) {
	want := []string{"CONFIDENCE  Predicted", "[MS2] A1", "  spaces  ", `quoted "text", \ slash`, "a---b", "same", "same"}
	document, err := json.Marshal(map[string]any{
		"accession": "MSBNK-Test-A1", "date": "2025.01.17", "comment": want,
	})
	if err != nil {
		t.Fatal(err)
	}
	record, err := decodeJPARecord(document)
	if err != nil {
		t.Fatal(err)
	}
	if record.Comments == nil || !reflect.DeepEqual(*record.Comments, want) {
		t.Fatalf("changed JPA comments: %+v", record.Comments)
	}
}

func TestLegacyCommentCompatibility(t *testing.T) {
	encoded := []string{"CONFIDENCE---Predicted", "---Free---text", "[MS2]---A1", "plain"}
	want := []string{"CONFIDENCE Predicted", "Free---text", "[MS2] A1", "plain"}
	if got := decodeLegacyComments(encoded); !reflect.DeepEqual(got, want) {
		t.Fatalf("legacy comments=%v", got)
	}
	want = append(want, `quotes " and \ and ,`, "  spaces  ", "same", "same")
	wire, err := pq.Array(encodeLegacyComments(want)).Value()
	if err != nil {
		t.Fatal(err)
	}
	var stored pq.StringArray
	if err := stored.Scan(wire); err != nil {
		t.Fatal(err)
	}
	if got := decodeLegacyComments(stored); !reflect.DeepEqual(got, want) {
		t.Fatalf("legacy roundtrip=%v", got)
	}
}

func TestJPAConnectionIsReadOnly(t *testing.T) {
	for _, connection := range []string{
		"host=localhost dbname=massbank",
		"postgresql://localhost/massbank?sslmode=disable",
	} {
		db, err := NewPostgresSQLDb(DBConfig{Database: Postgres, DbSchema: "jpa", DbConnStr: connection})
		if err != nil {
			t.Fatal(err)
		}
		if !strings.Contains(db.connString, "default_transaction_read_only") ||
			!strings.Contains(db.connString, "massbank_api") {
			t.Fatal("shared database connection is not isolated/read-only")
		}
	}
}

func TestSharedDatabaseIntegration(t *testing.T) {
	connection := os.Getenv("MASSBANK_SHARED_TEST_DSN")
	if connection == "" {
		t.Skip("set MASSBANK_SHARED_TEST_DSN to an imported shared test database")
	}
	db, err := NewPostgresSQLDb(DBConfig{Database: Postgres, DbSchema: "jpa", DbConnStr: connection})
	if err != nil {
		t.Fatal(err)
	}
	if err := db.Connect(); err != nil {
		t.Fatal(err)
	}
	defer db.Disconnect()
	if err := db.Ping(); err != nil {
		t.Fatal(err)
	}
	count, err := db.Count()
	if err != nil || count == 0 {
		t.Fatalf("count=%d error=%v", count, err)
	}
	var expected int64
	if err := db.database.QueryRow(`SELECT count(*) FROM public."massbank-records"`).Scan(&expected); err != nil || count != expected {
		t.Fatalf("API/JPA count mismatch: %d != %d (%v)", count, expected, err)
	}
	accessions, _, err := db.GetAccessionsByFilterOptions(Filters{IonMode: massbank.ANY})
	if err != nil || int64(len(accessions)) != count {
		t.Fatalf("browse count=%d, error=%v", len(accessions), err)
	}
	records, err := db.ReadRecords(accessions)
	if err != nil || int64(len(records)) != count {
		t.Fatalf("record count=%d, error=%v", len(records), err)
	}
	if _, err := db.GetMetadata(); err != nil {
		t.Fatal(err)
	}
	if _, err := db.GetUniqueValues(Filters{IonMode: massbank.ANY}); err != nil {
		t.Fatal(err)
	}
	missing := "MSBNK-Missing-NOTFOUND"
	if _, err := db.GetRecord(&missing); !errors.Is(err, sql.ErrNoRows) {
		t.Fatalf("missing accession: %v", err)
	}
	var structureAccession, smiles string
	if err := db.database.QueryRow("SELECT accession, molecule FROM molecules ORDER BY accession LIMIT 1").
		Scan(&structureAccession, &smiles); err != nil {
		t.Fatal(err)
	}
	hits, _, err := db.GetAccessionsBySubstructure(smiles)
	if err != nil || !containsAccession(hits, structureAccession) {
		t.Fatalf("Bingo did not find its source record: %v", err)
	}
	r := records[0]
	filters := Filters{IonMode: massbank.ANY, Formula: *r.Compound.Formula, CompoundName: (*r.Compound.Names)[0]}
	hits, _, err = db.GetAccessionsByFilterOptions(filters)
	if err != nil || !containsAccession(hits, *r.Accession) {
		t.Fatalf("JPA filters failed: %v", err)
	}
	var peakAccession string
	var mz float64
	if err := db.database.QueryRow(`SELECT spectrum_id, mz FROM peak LIMIT 1`).
		Scan(&peakAccession, &mz); err != nil {
		t.Fatal(err)
	}
	{
		peaks := []float64{mz}
		intensity := int64(0)
		found, _, err := db.GetSearchResults(Filters{IonMode: massbank.ANY, Peaks: &peaks, Intensity: &intensity})
		if err != nil || found == nil || !containsAccession(*found, peakAccession) {
			t.Fatalf("peak search failed: %v", err)
		}
	}
	var lossAccession string
	var difference float64
	if err := db.database.QueryRow(`SELECT spectrum_id, difference FROM peak_differences LIMIT 1`).
		Scan(&lossAccession, &difference); err != nil {
		t.Fatal(err)
	}
	losses, tolerance, intensity := []float64{difference}, 0.001, int64(0)
	hits, _, pairs, err := db.NeutralLossSearch(&losses, &tolerance, &intensity)
	if err != nil || !containsAccession(hits, lossAccession) || len(pairs[lossAccession]) == 0 {
		t.Fatalf("neutral-loss search failed: %v", err)
	}
	multipleLosses := []float64{difference, difference}
	hits, _, _, err = db.NeutralLossSearch(&multipleLosses, &tolerance, &intensity)
	if err != nil || !containsAccession(hits, lossAccession) {
		t.Fatalf("multiple neutral-loss search failed: %v", err)
	}
	if _, err := db.database.Exec(`DELETE FROM public."massbank-records"`); err == nil {
		t.Fatal("API connection was allowed to write")
	}
	var plan string
	tx, err := db.database.Begin()
	if err != nil {
		t.Fatal(err)
	}
	defer tx.Rollback()
	if _, err := tx.Exec("SET LOCAL enable_seqscan = off"); err != nil {
		t.Fatal(err)
	}
	rows, err := tx.Query("EXPLAIN SELECT accession FROM molecules WHERE molecule @($1, '')::bingo.sub", smiles)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var line string
		if err := rows.Scan(&line); err != nil {
			t.Fatal(err)
		}
		plan += line
	}
	if err := rows.Err(); err != nil || !strings.Contains(plan, "shared_records_bingo_idx") {
		t.Fatalf("Bingo index not used: %s (%v)", plan, err)
	}
}

func containsAccession(values []string, wanted string) bool {
	for _, value := range values {
		if value == wanted {
			return true
		}
	}
	return false
}

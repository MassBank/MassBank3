package mb3server

import (
	"archive/tar"
	"bufio"
	"bytes"
	"compress/gzip"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"net/http/httptest"
	"os"
	"path"
	"reflect"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"testing"

	"github.com/MassBank/MassBank3/pkg/config"
	"github.com/MassBank/MassBank3/pkg/database"
)

type primaryFixture struct {
	Accession string
	Path      string
	SHA256    string
	Features  []string
	reference map[string]any
}

func loadPrimaryFixtures(t *testing.T) []primaryFixture {
	t.Helper()
	var manifest struct {
		Count         int
		ArchiveSHA256 string `json:"archive_sha256"`
		Records       []primaryFixture
	}
	data, err := os.ReadFile("testdata/primary/manifest.json")
	if err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal(data, &manifest); err != nil {
		t.Fatal(err)
	}
	if manifest.Count != 600 || len(manifest.Records) != 600 {
		t.Fatal("the regression corpus must contain exactly 600 records")
	}
	data, err = os.ReadFile("testdata/primary/records.tar.gz")
	if err != nil {
		t.Fatal(err)
	}
	if fmt.Sprintf("%x", sha256.Sum256(data)) != manifest.ArchiveSHA256 {
		t.Fatal("primary-data archive checksum differs from manifest")
	}
	compressed, err := gzip.NewReader(bytes.NewReader(data))
	if err != nil {
		t.Fatal(err)
	}
	defer compressed.Close()
	files := map[string][]byte{}
	archive := tar.NewReader(compressed)
	for {
		entry, err := archive.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			t.Fatal(err)
		}
		if !entry.FileInfo().Mode().IsRegular() || path.IsAbs(entry.Name) ||
			path.Clean(entry.Name) != entry.Name || strings.HasPrefix(entry.Name, "../") {
			t.Fatalf("unexpected archive entry: %q", entry.Name)
		}
		if _, exists := files[entry.Name]; exists {
			t.Fatalf("duplicate archive entry: %s", entry.Name)
		}
		files[entry.Name], err = io.ReadAll(archive)
		if err != nil {
			t.Fatal(err)
		}
	}
	seen := map[string]bool{}
	for i := range manifest.Records {
		fixture := &manifest.Records[i]
		data, exists := files[fixture.Path]
		if !exists || fmt.Sprintf("%x", sha256.Sum256(data)) != fixture.SHA256 {
			t.Fatalf("missing or changed original file: %s", fixture.Path)
		}
		delete(files, fixture.Path)
		if seen[fixture.Accession] {
			t.Fatalf("duplicate accession: %s", fixture.Accession)
		}
		seen[fixture.Accession] = true
		fixture.reference = primaryReference(t, string(data))
		if fixture.reference["accession"] != fixture.Accession {
			t.Fatalf("source accession differs from manifest: %s", fixture.Path)
		}
	}
	if len(files) != 0 {
		t.Fatal("archive contains files not listed in manifest")
	}
	return manifest.Records
}

func TestPrimaryFixtures(t *testing.T) {
	fixtures := loadPrimaryFixtures(t)
	contributors, coverage := map[string]bool{}, map[string]int{}
	for _, fixture := range fixtures {
		contributors[strings.Split(fixture.Path, "/")[0]] = true
		for _, feature := range fixture.Features {
			coverage[feature]++
		}
		if len(fixture.reference) != 37 {
			t.Fatalf("%s: expected 37 source-backed field groups, got %d", fixture.Accession, len(fixture.reference))
		}
	}
	if len(contributors) != 59 {
		t.Fatalf("expected all 59 release contributors, got %d", len(contributors))
	}
	for _, feature := range []string{
		"date_only", "date_created", "date_modified", "COMMENT", "multiple_comments",
		"comment_repeated_spaces", "PK$ANNOTATION", "SP$LINK", "PROJECT",
		"multiple_classes", "high_precision_mz", "zero_relative_intensity", "known_processing_split",
	} {
		if coverage[feature] == 0 {
			t.Errorf("missing regression coverage: %s", feature)
		}
	}
	if coverage["zero_intensity"] < 30 {
		t.Error("expected at least 30 records with zero-intensity peaks")
	}
	t.Logf("verified 600 original records, 59 contributors, coverage: %v", coverage)
}

// This oracle deliberately does not use the application's parser or converters.
func primaryReference(t *testing.T, text string) map[string]any {
	t.Helper()
	fields := map[string][]string{}
	peaks, annotations := []any{}, []any{}
	peakHeader, annotationHeader := []string{}, []string{}
	section := ""
	scanner := bufio.NewScanner(strings.NewReader(text))
	scanner.Buffer(make([]byte, 4096), 1024*1024)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "//" {
			break
		}
		if strings.HasPrefix(line, "  ") {
			values := strings.Fields(line)
			row := []any{}
			switch section {
			case "peaks":
				if len(values) != 3 {
					t.Fatalf("invalid source peak: %q", line)
				}
				if _, err := strconv.ParseInt(values[2], 10, 64); err != nil {
					t.Fatalf("non-integer source relative intensity: %q", line)
				}
				for _, value := range values {
					row = append(row, json.Number(value))
				}
				peaks = append(peaks, row)
			case "annotations":
				if len(values) != len(annotationHeader) {
					t.Fatalf("invalid source annotation: %q", line)
				}
				for i, value := range values {
					if annotationHeader[i] == "m/z" {
						row = append(row, json.Number(value))
					} else {
						row = append(row, value)
					}
				}
				annotations = append(annotations, row)
			default:
				t.Fatalf("unexpected source continuation: %q", line)
			}
			continue
		}
		tag, value, ok := strings.Cut(line, ": ")
		if !ok {
			t.Fatalf("invalid source line: %q", line)
		}
		section = ""
		switch tag {
		case "PK$PEAK":
			section, peakHeader = "peaks", strings.Fields(value)
		case "PK$ANNOTATION":
			section, annotationHeader = "annotations", strings.Fields(value)
		default:
			fields[tag] = append(fields[tag], value)
		}
	}
	if err := scanner.Err(); err != nil {
		t.Fatal(err)
	}
	take := func(tag string) []string {
		values := fields[tag]
		delete(fields, tag)
		return values
	}
	single := func(tag string, required bool) string {
		values := take(tag)
		if len(values) == 0 && !required {
			return ""
		}
		if len(values) != 1 {
			t.Fatalf("expected one %s, got %d", tag, len(values))
		}
		return values[0]
	}
	result := map[string]any{
		"deprecated":             map[string]any{},
		"peak.peak.header":       stringValues(peakHeader),
		"peak.peak.values":       peaks,
		"peak.annotation.header": stringValues(annotationHeader),
		"peak.annotation.values": annotations,
	}
	for tag, key := range map[string]string{
		"ACCESSION": "accession", "RECORD_TITLE": "title", "AUTHORS": "authors.text",
		"LICENSE": "license", "CH$FORMULA": "compound.formula", "CH$SMILES": "compound.smiles",
		"CH$IUPAC": "compound.inchi", "AC$INSTRUMENT": "acquisition.instrument",
		"AC$INSTRUMENT_TYPE": "acquisition.instrument_type", "PK$SPLASH": "peak.splash",
	} {
		result[key] = single(tag, true)
	}
	for tag, key := range map[string]string{
		"COPYRIGHT": "copyright", "PUBLICATION": "publication", "PROJECT": "project",
		"SP$SCIENTIFIC_NAME": "species.name",
	} {
		result[key] = single(tag, false)
	}
	for tag, key := range map[string]string{
		"CH$NAME": "compound.names", "COMMENT": "comments", "SP$SAMPLE": "species.sample",
	} {
		result[key] = stringValues(take(tag))
	}
	classes := []string{}
	for _, value := range take("CH$COMPOUND_CLASS") {
		classes = append(classes, strings.Split(value, "; ")...)
	}
	result["compound.classes"] = stringValues(classes)
	lineage := single("SP$LINEAGE", false)
	result["species.lineage"] = []any{}
	if lineage != "" {
		result["species.lineage"] = stringValues(strings.Split(lineage, "; "))
	}
	result["compound.mass"] = json.Number(single("CH$EXACT_MASS", true))
	count := single("PK$NUM_PEAK", true)
	if count != strconv.Itoa(len(peaks)) {
		t.Fatalf("source PK$NUM_PEAK=%s, actual rows=%d", count, len(peaks))
	}
	result["peak.numPeak"] = json.Number(count)
	date := regexp.MustCompile(`^(\d{4}\.\d{2}\.\d{2})(?: \(Created (\d{4}\.\d{2}\.\d{2})(?:, modified (\d{4}\.\d{2}\.\d{2}))?\))?$`).
		FindStringSubmatch(single("DATE", true))
	if date == nil {
		t.Fatal("source DATE does not match an allowed format")
	}
	dates := map[string]any{}
	for i, key := range []string{"updated", "created", "modified"} {
		if date[i+1] != "" {
			dates[key] = strings.ReplaceAll(date[i+1], ".", "-")
		}
	}
	result["date"] = dates
	for tag, key := range map[string]string{
		"CH$LINK": "compound.link", "SP$LINK": "species.link",
		"AC$MASS_SPECTROMETRY": "acquisition.mass_spectrometry.subtags",
		"AC$CHROMATOGRAPHY":    "acquisition.chromatography", "AC$GENERAL": "acquisition.general",
		"AC$ION_MOBILITY": "acquisition.ion_mobility",
		"MS$FOCUSED_ION":  "mass_spectrometry.focused_ion", "MS$DATA_PROCESSING": "mass_spectrometry.data_processing",
	} {
		pairs := []any{}
		for _, line := range take(tag) {
			subtag, value, ok := strings.Cut(line, " ")
			if !ok {
				t.Fatalf("invalid source subtag: %s: %s", tag, line)
			}
			if tag == "AC$MASS_SPECTROMETRY" && (subtag == "MS_TYPE" || subtag == "ION_MODE") {
				field := "acquisition.mass_spectrometry." + strings.ToLower(subtag)
				if _, exists := result[field]; exists {
					t.Fatalf("duplicate source %s", field)
				}
				result[field] = value
			} else if tag == "CH$LINK" || tag == "SP$LINK" {
				pairs = append(pairs, map[string]any{"database": subtag, "identifier": value})
			} else {
				pairs = append(pairs, map[string]any{"subtag": subtag, "value": value})
			}
		}
		result[key] = pairs
	}
	for _, subtag := range []string{"ms_type", "ion_mode"} {
		if _, exists := result["acquisition.mass_spectrometry."+subtag]; !exists {
			t.Fatalf("source has no %s", subtag)
		}
	}
	if len(fields) != 0 {
		t.Fatalf("unmapped source fields: %v", fields)
	}
	normalizePrimaryNumbers(t, result)
	return result
}

func stringValues(values []string) []any {
	result := make([]any, len(values))
	for i, value := range values {
		result[i] = value
	}
	return result
}

type exactPrimaryNumber string
type missingPrimaryValue struct{}

func normalizePrimaryNumbers(t *testing.T, value any) any {
	t.Helper()
	switch value := value.(type) {
	case json.Number:
		number, ok := new(big.Rat).SetString(string(value))
		if !ok {
			t.Fatalf("invalid numeric value: %q", value)
		}
		return exactPrimaryNumber(number.RatString())
	case []any:
		result := make([]any, len(value))
		for i, entry := range value {
			result[i] = normalizePrimaryNumbers(t, entry)
		}
		return result
	case map[string]any:
		result := map[string]any{}
		for key, entry := range value {
			result[key] = normalizePrimaryNumbers(t, entry)
		}
		return result
	default:
		return value
	}
}

func primaryValue(record map[string]any, key string, fallback any) any {
	var value any = record
	for _, part := range strings.Split(key, ".") {
		object, ok := value.(map[string]any)
		if !ok {
			return missingPrimaryValue{}
		}
		value, ok = object[part]
		if !ok {
			return fallback
		}
	}
	return value
}

func apiPrimaryValue(t *testing.T, record map[string]any, key string, expected any) any {
	t.Helper()
	var fallback any = missingPrimaryValue{}
	switch expected.(type) {
	case string:
		fallback = ""
	case []any:
		fallback = []any{}
	case map[string]any:
		fallback = map[string]any{}
	}
	value := primaryValue(record, key, fallback)
	switch key {
	case "authors.text":
		names := []string{}
		for _, author := range primaryValue(record, "authors", []any{}).([]any) {
			author := author.(map[string]any)
			name := author["name"].(string)
			if role, ok := author["marc-relator"].(string); ok && role != "" {
				name += " [" + role + "]"
			}
			names = append(names, name)
		}
		return strings.Join(names, ",")
	case "peak.peak.values":
		rows := []any{}
		for _, peak := range value.([]any) {
			peak := peak.(map[string]any)
			relative, ok := peak["rel"].(json.Number)
			if !ok {
				t.Fatalf("relative intensity must be a JSON integer: %v", peak)
			}
			if _, err := relative.Int64(); err != nil {
				t.Fatalf("non-integer relative intensity: %s", relative)
			}
			rows = append(rows, []any{peak["mz"], peak["intensity"], peak["rel"]})
		}
		return rows
	case "peak.annotation.values":
		header := primaryValue(record, "peak.annotation.header", []any{}).([]any)
		columns := value.([]any)
		if len(header) != len(columns) {
			t.Fatal("annotation header/column count mismatch")
		}
		rows := []any{}
		if len(columns) > 0 {
			count := len(columns[0].([]any))
			for _, column := range columns {
				if len(column.([]any)) != count {
					t.Fatal("annotation columns have different lengths")
				}
			}
			for i := range count {
				row := []any{}
				for j, column := range columns {
					cell := column.([]any)[i]
					if header[j] == "m/z" {
						cell = json.Number(cell.(string))
					}
					row = append(row, cell)
				}
				rows = append(rows, row)
			}
		}
		return rows
	case "mass_spectrometry.data_processing":
		return normalizeKnownProcessingSplit(value.([]any))
	default:
		return value
	}
}

func normalizeKnownProcessingSplit(values []any) []any {
	result := make([]any, len(values))
	for i, value := range values {
		pair := value.(map[string]any)
		result[i] = pair
		// Only the documented legacy boundary is tolerated; every character is still compared.
		if pair["subtag"] == "INTENSITY CUTOFF" {
			copy := map[string]any{}
			for key, value := range pair {
				copy[key] = value
			}
			copy["subtag"], copy["value"] = "INTENSITY", "CUTOFF "+pair["value"].(string)
			result[i] = copy
		}
	}
	return result
}

func comparePrimaryReference(t *testing.T, expected, actual map[string]any) {
	t.Helper()
	keys := make([]string, 0, len(expected))
	for key := range expected {
		keys = append(keys, key)
	}
	slices.Sort(keys)
	for _, key := range keys {
		want := normalizePrimaryNumbers(t, expected[key])
		got := normalizePrimaryNumbers(t, apiPrimaryValue(t, actual, key, expected[key]))
		if !reflect.DeepEqual(want, got) {
			t.Errorf("%s:\nsource: %#v\nAPI:    %#v", key, want, got)
		}
	}
}

func TestPrimaryComparisonPrecision(t *testing.T) {
	for _, tc := range []struct {
		name        string
		left, right any
		equal       bool
	}{
		{"decimal notation", json.Number("0.00"), json.Number("0"), true},
		{"exponent notation", json.Number("1.234567890123e2"), json.Number("123.4567890123"), true},
		{"no rounding tolerance", json.Number("123.4567890123"), json.Number("123.4567890124"), false},
		{"numeric string is not a number", json.Number("0"), "0", false},
		{"missing zero is not zero", json.Number("0"), nil, false},
		{"array order", []any{"one", "two"}, []any{"two", "one"}, false},
		{"duplicates", []any{"same", "same"}, []any{"same"}, false},
		{"literal comment spaces", "CONFIDENCE  Predicted", "CONFIDENCE Predicted", false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			equal := reflect.DeepEqual(normalizePrimaryNumbers(t, tc.left), normalizePrimaryNumbers(t, tc.right))
			if equal != tc.equal {
				t.Fatalf("equality=%t, want %t", equal, tc.equal)
			}
		})
	}
	expected := []any{map[string]any{"subtag": "INTENSITY", "value": "CUTOFF 0.05 Base Peak"}}
	actual := []any{map[string]any{"subtag": "INTENSITY CUTOFF", "value": "0.05 Base Peak"}}
	if !reflect.DeepEqual(expected, normalizeKnownProcessingSplit(actual)) {
		t.Fatal("documented processing split is not recognized")
	}
	actual[0].(map[string]any)["value"] = "0.5 Base Peak"
	if reflect.DeepEqual(expected, normalizeKnownProcessingSplit(actual)) {
		t.Fatal("processing exception hid a changed value")
	}
}

func TestPrimaryDatabaseIntegration(t *testing.T) {
	connection := os.Getenv("MASSBANK_PRIMARY_TEST_DSN")
	if connection == "" {
		if os.Getenv("MASSBANK_PRIMARY_TEST_REQUIRED") == "true" {
			t.Fatal("MASSBANK_PRIMARY_TEST_DSN is required; run test/run-primary-regression.sh")
		}
		t.Skip("run test/run-primary-regression.sh for importer-backed primary-data tests")
	}
	fixtures := loadPrimaryFixtures(t)
	previousConfig, previousDB := ServerConfig, db
	ServerConfig = &config.ServerConfig{DBConfig: database.DBConfig{
		Database: database.Postgres, DbSchema: "jpa", DbConnStr: connection,
	}}
	db = nil
	t.Cleanup(func() {
		if db != nil {
			if err := db.Disconnect(); err != nil {
				t.Error(err)
			}
		}
		ServerConfig, db = previousConfig, previousDB
	})
	router := NewRouter(NewDefaultAPIController(NewDefaultApiService()))
	get := func(t *testing.T, url string) any {
		t.Helper()
		response := httptest.NewRecorder()
		router.ServeHTTP(response, httptest.NewRequest(http.MethodGet, url, nil))
		if response.Code != http.StatusOK {
			t.Fatalf("%s: HTTP %d: %s", url, response.Code, response.Body.String())
		}
		decoder := json.NewDecoder(response.Body)
		decoder.UseNumber()
		var value any
		if err := decoder.Decode(&value); err != nil {
			t.Fatal(err)
		}
		return value
	}
	if count := get(t, "/records/count"); count != json.Number("600") {
		t.Fatalf("expected fresh 600-record importer database, got count=%v", count)
	}
	for _, fixture := range fixtures {
		t.Run(fixture.Accession, func(t *testing.T) {
			record := get(t, "/records/"+fixture.Accession).(map[string]any)
			comparePrimaryReference(t, fixture.reference, record)
			simple := map[string]any{}
			for _, key := range []string{"accession", "title", "compound.smiles", "peak.numPeak", "peak.peak.header", "peak.peak.values"} {
				simple[key] = fixture.reference[key]
			}
			record = get(t, "/records/"+fixture.Accession+"/simple").(map[string]any)
			comparePrimaryReference(t, simple, record)
		})
	}
	t.Run("bulk", func(t *testing.T) {
		records := get(t, "/records").([]any)
		expected := map[string]map[string]any{}
		for _, fixture := range fixtures {
			expected[fixture.Accession] = fixture.reference
		}
		for _, record := range records {
			record := record.(map[string]any)
			accession := record["accession"].(string)
			reference, exists := expected[accession]
			if !exists {
				t.Fatalf("unknown or duplicate bulk accession: %s", accession)
			}
			t.Run(accession, func(t *testing.T) {
				comparePrimaryReference(t, reference, record)
			})
			delete(expected, accession)
		}
		if len(expected) != 0 {
			t.Fatalf("bulk response is missing %d source records", len(expected))
		}
	})
	t.Log("600 originals compared through HTTP handlers: full records, simple records and bulk; exact decimals, integer relative intensities, 37 field groups plus rejection of unmapped source tags; only the documented processing split is tolerated")
}

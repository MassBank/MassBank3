package massbank

import (
	"bufio"
	"io/fs"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

func TestCommentLinesPreserveValues(t *testing.T) {
	buildTags()
	record := &MassBank2{}
	want := []string{"CONFIDENCE  Predicted", "[MS2] A1", "  spaces  ", `quoted "text", \ slash`, "same", "same"}
	for _, value := range want {
		if err := record.readLine("COMMENT: " + value); err != nil {
			t.Fatal(err)
		}
	}
	if record.Comments == nil || !reflect.DeepEqual(*record.Comments, want) {
		t.Fatalf("changed source comments: %+v", record.Comments)
	}
}

func TestParseRecordDate(t *testing.T) {
	for _, tt := range []struct {
		source, updated, created, modified string
	}{
		{"2012.10.22 (Created 2008.05.12)", "2012.10.22", "2008.05.12", ""},
		{"2016.01.19 (Created 2006.12.21, modified 2011.05.06)", "2016.01.19", "2006.12.21", "2011.05.06"},
		{"2025.01.17", "2025.01.17", "", ""},
		{"2024.02.29", "2024.02.29", "", ""},
	} {
		t.Run(tt.source, func(t *testing.T) {
			got, err := ParseRecordDate(tt.source)
			if err != nil {
				t.Fatal(err)
			}
			if got.Updated.Format(dateFormat) != tt.updated {
				t.Fatalf("updated=%s", got.Updated)
			}
			if tt.created == "" {
				if !got.Created.IsZero() {
					t.Fatal("invented a creation date")
				}
			} else if got.Created.Format(dateFormat) != tt.created {
				t.Fatalf("created=%s", got.Created)
			}
			if tt.modified == "" {
				if !got.Modified.IsZero() {
					t.Fatal("invented a modification date")
				}
			} else if got.Modified.Format(dateFormat) != tt.modified {
				t.Fatalf("modified=%s", got.Modified)
			}
		})
	}
}

func TestParseRecordDateRejectsInvalidInput(t *testing.T) {
	for _, source := range []string{
		"", "2025-01-17", "2025.1.17", "2025.02.29", "2025.13.01",
		"2025.01.17 trailing", "2025.01.17 (modified 2024.01.01)",
		"2025.01.17 (Created 2024.02.30)",
		"2025.01.17 (Created 2024.01.01, modified 2024.02.30)",
		"2025.01.17 (Created 2024.01.01, changed 2024.05.06)",
		"2025.01.17 (Created 2024.01.01, modified)",
		"2025.01.17 (Created 2024.01.01) trailing",
		"2025.01.17 (Created 2024.01.01",
	} {
		t.Run(source, func(t *testing.T) {
			if got, err := ParseRecordDate(source); err == nil || got != nil {
				t.Fatalf("accepted invalid DATE: %+v, %v", got, err)
			}
		})
	}
}

func TestRecordDatesFromSnapshot(t *testing.T) {
	root := os.Getenv("MASSBANK_SOURCE_DATA")
	if root == "" {
		t.Skip("set MASSBANK_SOURCE_DATA to validate every DATE in a local snapshot")
	}
	var active, deprecated int
	err := filepath.WalkDir(root, func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			if strings.HasPrefix(entry.Name(), ".") {
				return filepath.SkipDir
			}
			return nil
		}
		if !strings.HasPrefix(entry.Name(), "MSBNK-") || !strings.HasSuffix(entry.Name(), ".txt") {
			return nil
		}
		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := scanner.Text()
			if strings.HasPrefix(line, "DEPRECATED:") {
				deprecated++
				return nil
			}
			if strings.HasPrefix(line, "DATE: ") {
				active++
				if _, err := ParseRecordDate(strings.TrimPrefix(line, "DATE: ")); err != nil {
					t.Errorf("%s: %v", path, err)
				}
				return nil
			}
		}
		if err := scanner.Err(); err != nil {
			return err
		}
		t.Errorf("%s: missing DATE", path)
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if active == 0 {
		t.Fatal("no active source records checked")
	}
	t.Logf("checked DATE in %d active records; skipped %d deprecated records", active, deprecated)
}

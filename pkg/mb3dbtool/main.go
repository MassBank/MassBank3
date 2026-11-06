package main

import (
	"archive/zip"
	"bufio"
	"bytes"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/MassBank/MassBank3/pkg/config"
	"github.com/MassBank/MassBank3/pkg/mb3server"
	"github.com/go-git/go-git/v5"

	"github.com/MassBank/MassBank3/pkg/database"
	"github.com/MassBank/MassBank3/pkg/massbank"
)

const recordChunkSize = 100000

func main() {
	var userConfig = config.GetToolConfig()
	var db database.MB3Database
	var err error
	if userConfig.Database == database.Postgres {
		db, err = database.NewPostgresSQLDb(userConfig.DBConfig)
		if err != nil {
			panic(err)
		}
	}
	fmt.Println("Connecting to database...")
	if err = db.Connect(); err != nil {
		panic(err)
	}

	if userConfig.Init {
		fmt.Println("Start initialising database...")
		if err := db.Init(); err != nil {
			println(err.Error())
		}
		fmt.Println("Database initialisation finished.")

		// set status to removing indexes
		err = db.SetStatus("database_update", "remove indexes")
		if err != nil {
			println("Could not set status to \"remove indexes\": " + err.Error())
			panic(err)
		}

		println("Removing indexes...")
		err = db.RemoveIndexes()
		if err != nil {
			println("Could not remove indexes: " + err.Error())
			panic(err)
		}

		var versionData *massbank.MbMetaData
		var zReader *zip.Reader
		if len(userConfig.DataDir) > 0 {
			// set status to reading data from directory
			err = db.SetStatus("database_update", "reading data from directory")
			if err != nil {
				println("Could not set status to \"reading data from directory\": " + err.Error())
				panic(err)
			}

			fmt.Println("Reading data from directory...")
			versionData, err = readDirectoryMeta(userConfig.DataDir)
			if err != nil {
				panic(err)
			}
		}
		if versionData == nil && len(userConfig.GitRepo) > 0 {
			// set status to reading data from git
			err = db.SetStatus("database_update", "reading data from git")
			if err != nil {
				println("Could not set status to \"reading data from git\": " + err.Error())
				panic(err)
			}

			fmt.Println("Reading data from git repository...")
			zReader, versionData, err = openGitArchive(userConfig.GitRepo, userConfig.GitBranch)
			if err != nil {
				panic(err)
			}
		}
		if versionData == nil {
			panic("No files found")
		}
		fmt.Println("Start updating database with chunked processing...")

		// set status to updating metadata
		err = db.SetStatus("database_update", "updating metadata")
		if err != nil {
			println("Could not set status to \"updating metadata\": " + err.Error())
			panic(err)
		}

		println("Updating metadata...")
		metaId, err := db.UpdateMetadata(versionData)
		if err != nil {
			println("Could not update metadata: " + err.Error())
			panic(err)
		}

		// set status to updating records
		err = db.SetStatus("database_update", "updating records")
		if err != nil {
			println("Could not set status to \"updating records\": " + err.Error())
			panic(err)
		}

		println("Updating records...")
		var insertedRecords int
		if len(userConfig.DataDir) > 0 {
			insertedRecords, err = processDirectoryInChunks(userConfig.DataDir, recordChunkSize, func(records []*massbank.MassBank2) error {
				return prepareAndPersistChunk(db, metaId, records)
			})
		} else {
			if zReader == nil {
				panic("No files found")
			}
			insertedRecords, err = processGitInChunks(zReader, recordChunkSize, func(records []*massbank.MassBank2) error {
				return prepareAndPersistChunk(db, metaId, records)
			})
		}
		if err != nil {
			println("Could not add records: " + err.Error())
			panic(err)
		}
		fmt.Println("Reading, preparation and persistence finished:", insertedRecords, "records.")

		count, err := db.Count()
		if err != nil {
			panic(err)
		}

		println("Database filling was successful. ", count, " records in database.")

		// set status to adding indexes
		err = db.SetStatus("database_update", "adding indexes")
		if err != nil {
			println("Could not set status to \"adding indexes\": " + err.Error())
			panic(err)
		}

		println("Adding indexes...")
		err = db.AddIndexes()
		if err != nil {
			println("Could not add indexes: " + err.Error())
			panic(err)
		}

		println("Finished database update.")
	} else {
		println("Database initialisation was skipped.")
	}
	// set status to done
	err = db.SetStatus("database_update", "done")
	if err != nil {
		println("Could not set status to \"done\": " + err.Error())
		panic(err)
	}

	fmt.Println("Disconnecting to database...")
	if err = db.Disconnect(); err != nil {
		panic(err)
	}
	fmt.Println("Done.")
}

func readDirectoryMeta(dir string) (*massbank.MbMetaData, error) {
	mbmeta := &massbank.MbMetaData{}

	verFile, err := os.Open(dir + "/VERSION")
	if err != nil {
		return nil, err
	}
	defer verFile.Close()
	readVersionFile(verFile, mbmeta)

	repo, err := git.PlainOpen(dir)
	if err != nil {
		println(err.Error())
		return mbmeta, nil
	}

	head, err := repo.Head()
	if err != nil {
		println(err.Error())
		return mbmeta, nil
	}

	mbmeta.GitCommit = head.Hash().String()
	return mbmeta, nil
}

func openGitArchive(repo string, branch string) (*zip.Reader, *massbank.MbMetaData, error) {
	c := http.Client{}
	url := fmt.Sprintf("%v/archive/refs/heads/%v.zip", repo, branch)
	println("Downloading file " + url)

	resp, err := c.Get(url)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, nil, err
	}
	println("Download finished")

	zReader, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	if err != nil {
		return nil, nil, err
	}

	mbmeta := &massbank.MbMetaData{GitCommit: zReader.Comment}
	for _, zFile := range zReader.File {
		if !strings.HasSuffix(zFile.Name, "VERSION") {
			continue
		}

		file, err := zFile.Open()
		if err != nil {
			return nil, nil, err
		}
		readVersionFile(file, mbmeta)
		file.Close()
		break
	}

	return zReader, mbmeta, nil
}

func processDirectoryInChunks(dir string, chunkSize int, handleChunk func([]*massbank.MassBank2) error) (int, error) {
	println("Reading files from directory " + dir + " ...")
	processed := 0
	chunk := make([]*massbank.MassBank2, 0, chunkSize)

	flushChunk := func() error {
		if len(chunk) == 0 {
			return nil
		}
		if err := handleChunk(chunk); err != nil {
			return err
		}
		processed += len(chunk)
		fmt.Printf("Processed %d records so far...\n", processed)
		chunk = chunk[:0]
		return nil
	}

	err := filepath.WalkDir(dir, func(filePath string, d fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if d.IsDir() {
			return nil
		}

		matched, matchErr := filepath.Match("MSBNK*.txt", filepath.Base(filePath))
		if matchErr != nil {
			return matchErr
		}
		if !matched {
			return nil
		}

		file, err := os.Open(filePath)
		if err != nil {
			return err
		}
		mb, scanErr := massbank.ScanMbFile(file, filePath)
		file.Close()
		if scanErr == nil {
			chunk = append(chunk, mb)
		}

		if len(chunk) >= chunkSize {
			return flushChunk()
		}
		return nil
	})
	if err != nil {
		return processed, err
	}

	if err := flushChunk(); err != nil {
		return processed, err
	}

	fmt.Println("Reading of data finished: ", processed, " valid files.")
	return processed, nil
}

func processGitInChunks(zReader *zip.Reader, chunkSize int, handleChunk func([]*massbank.MassBank2) error) (int, error) {
	processed := 0
	chunk := make([]*massbank.MassBank2, 0, chunkSize)

	flushChunk := func() error {
		if len(chunk) == 0 {
			return nil
		}
		if err := handleChunk(chunk); err != nil {
			return err
		}
		processed += len(chunk)
		fmt.Printf("Processed %d records so far...\n", processed)
		chunk = chunk[:0]
		return nil
	}

	for _, zFile := range zReader.File {
		matched, err := path.Match("MSBNK*.txt", path.Base(zFile.Name))
		if err != nil {
			return processed, err
		}
		if !matched {
			continue
		}

		fmt.Println("Processing file:", zFile.Name)

		file, err := zFile.Open()
		if err != nil {
			return processed, err
		}
		mb, scanErr := massbank.ScanMbFile(file, zFile.Name)
		file.Close()
		if scanErr == nil {
			chunk = append(chunk, mb)
		}

		if len(chunk) >= chunkSize {
			if err := flushChunk(); err != nil {
				return processed, err
			}
		}
	}

	if err := flushChunk(); err != nil {
		return processed, err
	}

	println("Reading of data finished.")
	return processed, nil
}

func prepareAndPersistChunk(db database.MB3Database, metaId string, records []*massbank.MassBank2) error {
	mb3RecordStrings := make([]string, 0, len(records))
	for _, mb2Record := range records {
		mb3Record, err := mb3server.ConvertMb2RecordToMb3Record(mb2Record)
		if err != nil {
			return fmt.Errorf("could not convert record: %w", err)
		}

		mb3RecordString, err := mb3server.ConvertMb3RecordToJsonString(mb3Record)
		if err != nil {
			return fmt.Errorf("could not convert record to string: %w", err)
		}
		mb3RecordStrings = append(mb3RecordStrings, mb3RecordString)
	}

	if err := db.AddRecords(records, metaId, mb3RecordStrings); err != nil {
		return fmt.Errorf("could not add records: %w", err)
	}

	return nil
}

func readVersionFile(file io.Reader, mbmeta *massbank.MbMetaData) {
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.Split(scanner.Text(), "=")
		if len(line) == 2 {
			switch strings.TrimSpace(line[0]) {
			case "version":
				mbmeta.Version = strings.TrimSpace(line[1])
			case "timestamp":
				mbmeta.Timestamp = strings.TrimSpace(line[1])

			}
		}
	}
}

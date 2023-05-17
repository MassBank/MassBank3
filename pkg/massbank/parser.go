package massbank

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"
)

func getDatabaseProperty(s string) (*DatabaseProperty, error) {
	db := DatabaseProperty{}
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 {
		db.Database = ss[0]
		db.Identifier = ss[1]
	} else {
		return nil, errors.New("Subtag error: " + s)
	}
	return &db, nil
}

func getSubtagProperty(s string) (*SubtagProperty, error) {
	p := SubtagProperty{}
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 {
		p.Subtag = ss[0]
		p.Value = ss[1]
	} else {
		return nil, errors.New("Subtag error: " + s)
	}
	return &p, nil
}

func getRecordDate(s string) (*RecordDate, error) {
	var err error
	var p = &RecordDate{}
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 {
		re := regexp.MustCompile("\\(Created (.*)\\)")
		ss2 := re.FindStringSubmatch(ss[1])
		if len(ss2) == 2 {
			ss3 := strings.SplitN(ss2[1], ",", 2)
			if len(ss3) > 1 {
				if p.Created, err = time.Parse(dateFormat, ss3[0]); err != nil {
					return nil, err
				}
				ss4 := strings.SplitN(strings.TrimSpace(ss3[1]), " ", 2)
				if len(ss4) > 1 {
					if p.Modified, err = time.Parse(dateFormat, ss4[1]); strings.TrimSpace(ss4[0]) != "modified" || err != nil {
						return nil, err
					}
				} else {
					return nil, err
				}
			} else {
				if p.Created, err = time.Parse(dateFormat, ss2[1]); err != nil {
					return nil, err
				}
			}
		}
	} else {
		if p.Created, err = time.Parse(dateFormat, ss[0]); err != nil {
			return nil, err
		}
	}
	p.Updated, err = time.Parse(dateFormat, ss[0])
	if err != nil {
		return nil, err
	}
	return p, nil

}

func (p *RecordDeprecated) Parse(s string) error {
	var err error
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 0 {
		if p.Date, err = time.Parse(deprecatedDateFormat, ss[0]); err != nil {
			return errors.New("Format error in Date: " + err.Error())
		}
		if len(ss) > 1 {
			p.Reason = ss[1]
		}
		return nil
	}
	return errors.New("could not parse DEPRECATED tag")
}

func getRecordAuthornames(s string) (*[]RecordAuthorName, error) {
	rn := []RecordAuthorName{}
	ss := strings.Split(s, ",")
	for _, s1 := range ss {
		re := regexp.MustCompile("(.*)([(.*)])?")
		ss1 := re.FindStringSubmatch(s1)
		marc := ""
		if len(ss1) > 2 {
			marc = ss1[2]
		}
		if len(ss1) > 1 {
			rn = append(rn, RecordAuthorName{ss1[1], marc})
		}
	}
	return &rn, nil
}

func (p *PkPeak) Parse(s string) error {
	if s != "m/z int. rel.int." {
		return errors.New("PK$ is not valid")
	}
	p.Header = strings.Split(s, " ")
	p.Mz = []float64{}
	p.Intensity = []float64{}
	p.Rel = []uint{}
	return nil
}

func getAnnotions(s string) (*PkAnnotation, error) {
	pa := PkAnnotation{}
	pa.Header = strings.Split(s, " ")
	pa.Values = map[string][]interface{}{}
	return &pa, nil
}

func ParseFile(fileName string) (mb *MassBank2, err error) {
	file, err := os.Open(fileName)
	defer file.Close()
	if err != nil {
		return nil, err
	}
	mb, err = ScanMbFile(file, fileName)
	if err != nil {
		return nil, err
	}
	return mb, nil
}

func ScanMbFile(mb2Reader io.Reader, fileName string) (*MassBank2, error) {
	if len(tagMap) == 0 {
		buildTags()
	}
	var mb = MassBank2{}
	mb.Metadata.FileName = fileName
	scanner := bufio.NewScanner(mb2Reader)
	lineNum := 0
	for scanner.Scan() {
		line := scanner.Text()
		mb.ReadLine(line, lineNum)
		lineNum++
	}
	return &mb, nil
}

func (mb *MassBank2) ReadLine(line string, lineNum int) {
	if strings.HasPrefix(line, "//") {
		// ignore comment
	} else if strings.HasPrefix(line, "  ") {
		if lastTag == "PK$PEAK" {
			err := mb.parsePeakValue(line, lineNum)
			if err != nil {
				println("Error while reading peaks: " + err.Error())
			}

		} else if lastTag == "PK$ANNOTATION" {
			mb.parseAnnotationValue(line, lineNum)
		} else {
			println("not implemented", line)
		}
	} else {
		s := strings.SplitN(line, ":", 2)
		if len(s) == 2 {
			tag := strings.TrimSpace(s[0])
			err := mb.addValue(tag, strings.TrimSpace(s[1]), lineNum)
			if err != nil {
				println("Error while adding Value " + tag + " record.")
			}
			lastTag = tag
		} else {
			println("The line is not a valid massbank tag line: \n", line)
		}
	}
}

func (mb *MassBank2) parsePeakValue(line string, lineNum int) error {
	svals := strings.Split(strings.TrimSpace(line), " ")
	if len(svals) != 3 {
		return errors.New("Could not read Peakvalue: line " + strconv.Itoa(lineNum))
	}
	var mz, intens float64
	var err error
	var rel uint64
	if mz, err = strconv.ParseFloat(svals[0], 32); err != nil {
		return errors.New("could not parse mz Value")
	}
	if intens, err = strconv.ParseFloat(svals[1], 32); err != nil {
		return errors.New("could not parse intensity Value")
	}
	if rel, err = strconv.ParseUint(svals[2], 10, 32); err != nil {
		return errors.New("could not parse relative intensity")
	}
	mb.Peak.Peak.Mz = append(mb.Peak.Peak.Mz, mz)
	mb.Peak.Peak.Intensity = append(mb.Peak.Peak.Intensity, intens)
	mb.Peak.Peak.Rel = append(mb.Peak.Peak.Rel, uint(rel))
	return nil
}

func (mb *MassBank2) parseAnnotationValue(line string, lineNum int) {
	var values = &(mb.Peak.Annotation.Values)
	var header = mb.Peak.Annotation.Header
	if strings.HasPrefix(line, "    ") && len(*values) > 0 {
		log.Println("Found multiline annotation")
		return
	}
	svals := strings.Split(strings.TrimSpace(line), " ")
	for index, ss := range svals {
		h := header[index]
		i, err := strconv.ParseInt(ss, 10, 64)
		if err == nil {
			(*values)[h] = append((*values)[h], i)
			continue
		}
		f, err := strconv.ParseFloat(ss, 64)
		if err == nil {
			(*values)[h] = append((*values)[h], f)
			continue
		}
		(*values)[h] = append((*values)[h], ss)
	}
}
func (mb *MassBank2) addValue(tagname string, value string, lineNum int) error {
	tagInfo := tagMap[tagname]
	index := tagInfo.Index
	mb2 := reflect.ValueOf(mb)
	mb3 := reflect.Indirect(mb2)
	property := mb3.FieldByIndex(index)
	propertyElement := property.Type().Elem()
	newProperty := reflect.New(propertyElement)
	switch propertyElement.Kind() {
	case reflect.String:
		newProperty.Elem().SetString(value)
		property.Set(newProperty)
	case reflect.Float64:
		f, _ := strconv.ParseFloat(value, 64)
		newProperty.Elem().SetFloat(f)
	case reflect.Struct:
		switch propertyElement {
		case reflect.TypeOf(RecordDate{}):
			rd, err := getRecordDate(value)
			if err != nil {
				println("Could not parse Recorddate: ", value)
			}
			property.Set(reflect.ValueOf(rd))
		case reflect.TypeOf(PkAnnotation{}):
			pa, _ := getAnnotions(value)
			property.Set(reflect.ValueOf(pa))
		default:
			fmt.Printf("Found unhandled struct: %s\n", propertyElement.Name())
		}
	case reflect.Slice:
		switch propertyElement.Elem() {
		case reflect.TypeOf(""):
			if property.Elem().Kind() == reflect.Invalid {
				property.Set(reflect.New(propertyElement))
			}
			property.Elem().Set(reflect.Append(property.Elem(), reflect.ValueOf(value)))
		case reflect.TypeOf(RecordAuthorName{}):
			rn, _ := getRecordAuthornames(value)
			property.Set(reflect.ValueOf(rn))
		case reflect.TypeOf(SubtagProperty{}):
			st, _ := getSubtagProperty(value)
			if property.Elem().Kind() == reflect.Invalid {
				property.Set(reflect.New(propertyElement))
			}
			property.Elem().Set(reflect.Append(property.Elem(), reflect.ValueOf(*st)))
		case reflect.TypeOf(DatabaseProperty{}):
			db, _ := getDatabaseProperty(value)
			if property.Elem().Kind() == reflect.Invalid {
				property.Set(reflect.New(propertyElement))
			}
			property.Elem().Set(reflect.Append(property.Elem(), reflect.ValueOf(*db)))
		default:
			fmt.Printf("Found unhandled slice of %s\n", propertyElement.Elem().String())
		}
	default:
		fmt.Printf("Property not set. Type was %v, kind was %v, tag was %v\n", propertyElement.String(), propertyElement.Kind().String(), tagname)

	}
	return nil
}

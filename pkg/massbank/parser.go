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

func ParseFile(fileName string) (mb *MassBank2, err error) {
	file, err := os.Open(fileName)
	if err != nil {
		return nil, err
	}
	defer file.Close()
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
		if strings.Contains(line, "DEPRECATED:") {
			return nil, errors.New("Record is deprecated")
		}
		lineNum++
		err := mb.readLine(line)
		if err != nil {
			log.Printf("Error in file %s, line %v:\n %s", fileName, lineNum, err)
		}
	}
	if mb.Accession != nil {
		c := strings.Split(*mb.Accession, "-")[1]
		mb.Contributor = &c
	}
	return &mb, nil
}

const dateFormat = "2006.01.02"
const deprecatedDateFormat = "2006-01-02"

func getDatabaseProperty(s string) (*DatabaseProperty, error) {
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 {
		return &DatabaseProperty{
			Database:   ss[0],
			Identifier: ss[1],
		}, nil
	} else {
		return nil, errors.New("Error in database link: " + s)
	}
}

func getSubtagProperty(s string, tagname string) (*SubtagProperty, error) {
	p := SubtagProperty{}
	ss := strings.SplitN(s, " ", 2)
	if tagname == "COMMENT" {
		if len(ss) > 1 && contains(commentSubtagList, strings.TrimSpace(ss[0])) {
			p.Subtag = ss[0]
			p.Value = ss[1]
		} else {
			p.Value = s
		}
	} else if len(ss) > 1 {
		p.Subtag = ss[0]
		p.Value = ss[1]
	} else {
		return nil, errors.New("Key error: " + s)
	}
	return &p, nil
}

func getRecordDate(s string) (*RecordDate, error) {
	var err error
	var date = &RecordDate{}
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 {
		re := regexp.MustCompile("\\(Created (.*)\\)")
		ss2 := re.FindStringSubmatch(ss[1])
		if len(ss2) == 2 {
			ss3 := strings.SplitN(ss2[1], ",", 2)
			if len(ss3) > 1 {
				if date.Created, err = time.Parse(dateFormat, ss3[0]); err != nil {
					return nil, err
				}
				ss4 := strings.SplitN(strings.TrimSpace(ss3[1]), " ", 2)
				if len(ss4) > 1 {
					if date.Modified, err = time.Parse(dateFormat, ss4[1]); strings.TrimSpace(ss4[0]) != "modified" || err != nil {
						return nil, err
					}
				} else {
					return nil, err
				}
			} else {
				if date.Created, err = time.Parse(dateFormat, ss2[1]); err != nil {
					return nil, err
				}
			}
		}
	} else {
		if date.Created, err = time.Parse(dateFormat, ss[0]); err != nil {
			return nil, err
		}
	}
	date.Updated, err = time.Parse(dateFormat, ss[0])
	if err != nil {
		return nil, err
	}
	return date, nil
}

func getDeprecated(s string) (*RecordDeprecated, error) {
	var err error
	dp := RecordDeprecated{}
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 0 {
		if dp.Date, err = time.Parse(deprecatedDateFormat, ss[0]); err != nil {
			return nil, errors.New("Format error in Date: " + err.Error())
		}
		if len(ss) > 1 {
			dp.Reason = ss[1]
		}
		return &dp, nil
	}
	return nil, errors.New("could not parse DEPRECATED tag")
}

func getRecordAuthornames(s string) (*[]RecordAuthorName, error) {
	names := []RecordAuthorName{}
	ss := strings.Split(s, ",")
	for _, s1 := range ss {
		re := regexp.MustCompile("(.*)([(.*)])?")
		sss := re.FindStringSubmatch(s1)
		marc := ""
		if len(sss) > 2 {
			marc = sss[2]
		}
		if len(sss) > 1 {
			names = append(names, RecordAuthorName{sss[1], marc})
		}
	}
	if len(names) < 1 {
		return nil, nil
	}
	return &names, nil
}

func getPeaks(s string) (*PkPeak, error) {
	if s != "m/z int. rel.int." {
		return nil, errors.New("PK$ is not valid: " + s)
	}
	return &PkPeak{
		Header:    strings.Split(s, " "),
		Id:        []int32{},
		Mz:        []float64{},
		Intensity: []float64{},
		Rel:       []int32{},
	}, nil
}

func getAnnotation(s string) (*PkAnnotation, error) {
	return &PkAnnotation{
		Header: strings.Split(s, " "),
		Values: map[string][]interface{}{},
	}, nil
}

func (mb *MassBank2) readLine(line string) error {
	if strings.HasPrefix(line, "//") {
		// ignore comment
	} else if strings.HasPrefix(line, "  ") {
		if lastTag == "PK$PEAK" {
			err := mb.parsePeakValue(line)
			if err != nil {
				return errors.Join(err, errors.New("Error while reading peaks:\n "+line))
			}

		} else if lastTag == "PK$ANNOTATION" {
			mb.parseAnnotationValue(line)
		} else {
			return errors.New("Parsing of line is not implemented:\n " + line)
		}
	} else {
		s := strings.SplitN(line, ":", 2)
		if len(s) == 2 {
			tag := strings.TrimSpace(s[0])
			err := mb.addValue(tag, strings.TrimSpace(s[1]))
			if err != nil {
				return errors.Join(errors.New("Error while adding Value "+tag+" record:\n "+line), err)
			}
			lastTag = tag
		} else {
			return errors.New("The line is not a valid massbank tag line:\n " + line)
		}
	}
	return nil
}

func (mb *MassBank2) parsePeakValue(line string) error {
	svals := strings.Split(strings.TrimSpace(line), " ")
	if len(svals) != 3 {
		return errors.New("Could not read peak value: " + line)
	}
	var mz, intens float64
	var err error

	if mz, err = strconv.ParseFloat(svals[0], 32); err != nil {
		return errors.New("could not parse mz Value")
	}
	if intens, err = strconv.ParseFloat(svals[1], 32); err != nil {
		return errors.New("could not parse intensity Value")
	}
	relInt64, err := strconv.ParseInt(svals[2], 10, 32)
	if err != nil {
		return errors.New("could not parse relative intensity")
	}
	mb.Peak.Peak.Mz = append(mb.Peak.Peak.Mz, mz)
	mb.Peak.Peak.Intensity = append(mb.Peak.Peak.Intensity, intens)
	mb.Peak.Peak.Rel = append(mb.Peak.Peak.Rel, int32(relInt64))

	return nil
}

func (mb *MassBank2) parseAnnotationValue(line string) {
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
func (mb *MassBank2) addValue(tagname string, value string) error {
	tagInfo := tagMap[tagname]
	index := tagInfo.Index
	property := reflect.ValueOf(mb).Elem().FieldByIndex(index)
	propertyElement := property.Type().Elem()
	switch propertyElement.Kind() {
	case reflect.String:
		newProperty := reflect.New(propertyElement)
		newProperty.Elem().SetString(value)
		property.Set(newProperty)
	case reflect.Float64:
		f, err := strconv.ParseFloat(value, 64)
		if err != nil {
			return errors.New(fmt.Sprintf("Error while Parsing Float: %s\nTag: %s; Value: %s", err.Error(), tagname, value))
		}
		newProperty := reflect.New(propertyElement)
		newProperty.Elem().SetFloat(f)
		property.Set(newProperty)
	case reflect.Uint:
		i, err := strconv.ParseUint(value, 10, 32)
		if err != nil {
			return errors.New(fmt.Sprintf("Error while Parsing UInt: %s\nTag: %s; Value: %s", err.Error(), tagname, value))
		}
		newProperty := reflect.New(propertyElement)
		newProperty.Elem().SetUint(i)
		property.Set(newProperty)
	case reflect.Struct:
		switch propertyElement {
		case reflect.TypeOf(RecordDate{}):
			rd, err := getRecordDate(value)
			if err != nil {
				return errors.New(fmt.Sprintf("Error in Date: %s\nTag: %s; Value: %s", err.Error(), tagname, value))
			}
			property.Set(reflect.ValueOf(rd))
		case reflect.TypeOf(PkAnnotation{}):
			pa, err := getAnnotation(value)
			if err != nil {
				return errors.New(fmt.Sprintf("Error in Peak Annotation: %s\nTag: %s; Value: %s", err.Error(), tagname, value))
			}
			property.Set(reflect.ValueOf(pa))
		case reflect.TypeOf(PkPeak{}):
			pk, err := getPeaks(value)
			if err != nil {
				return errors.New(fmt.Sprintf("Error in Peaks: %s\nTag: %s; Value: %s", err.Error(), tagname, value))
			}
			property.Set(reflect.ValueOf(pk))
		case reflect.TypeOf(RecordDeprecated{}):
			dp, err := getDeprecated(value)
			if err != nil {
				return errors.New(fmt.Sprintf("Error in Deprecated: %s\nTag: %s; Value: %s", err.Error(), tagname, value))
			}
			property.Set(reflect.ValueOf(dp))
		default:
			return errors.New(fmt.Sprintf("Found unhandled struct: %s\n", propertyElement.Name()))
		}
	case reflect.Slice:
		switch propertyElement.Elem() {
		case reflect.TypeOf(""):
			if property.Elem().Kind() == reflect.Invalid {
				property.Set(reflect.New(propertyElement))
			}
			property.Elem().Set(reflect.Append(property.Elem(), reflect.ValueOf(value)))
		case reflect.TypeOf(RecordAuthorName{}):
			rn, err := getRecordAuthornames(value)
			if err != nil {
				return errors.New(fmt.Sprintf("Error in Authornames: %s\nTag: %s; Value: %s", err.Error(), tagname, value))
			}
			property.Set(reflect.ValueOf(rn))
		case reflect.TypeOf(SubtagProperty{}):
			st, _ := getSubtagProperty(value, tagname)
			if property.Elem().Kind() == reflect.Invalid {
				property.Set(reflect.New(propertyElement))
			}
			property.Elem().Set(reflect.Append(property.Elem(), reflect.ValueOf(*st)))
		case reflect.TypeOf(DatabaseProperty{}):
			db, err := getDatabaseProperty(value)
			if err != nil {
				return errors.New(fmt.Sprintf("Error in Database Property: %s\nTag: %s; Value: %s", err.Error(), tagname, value))
			}
			if property.Elem().Kind() == reflect.Invalid {
				property.Set(reflect.New(propertyElement))
			}
			property.Elem().Set(reflect.Append(property.Elem(), reflect.ValueOf(*db)))
		default:
			return errors.New(fmt.Sprintf("Found unhandled slice of %s\n", propertyElement.Elem().String()))
		}
	default:
		return errors.New(fmt.Sprintf("Property not handled. Type was %v, kind was %v, tag was %v\n", propertyElement.String(), propertyElement.Kind().String(), tagname))

	}
	return nil
}

var lastTag string

type tagProperties struct {
	Type  reflect.Type
	Name  string
	Index []int
}

var tagMap = map[string]tagProperties{}

// Build an array with type information and tag strings for parsing
func buildTags() {
	var mb = MassBank2{}
	mb.addTagField(mb, []int{})
}

func (mb *MassBank2) addTagField(i interface{}, index []int) {
	valType := reflect.TypeOf(i)
	for _, field := range reflect.VisibleFields(valType) {
		if field.Type.Kind() != reflect.Struct {
			mb.addFieldToMap(field, index)
		} else {
			mb.addTagField(reflect.ValueOf(i).FieldByIndex(field.Index).Interface(), append(index, field.Index...))
		}
	}
}

func (mb *MassBank2) addFieldToMap(field reflect.StructField, index []int) {
	var props = tagProperties{}
	props.Name = field.Name
	props.Type = field.Type
	props.Index = append(index, field.Index...)
	tag := field.Tag.Get("mb2")
	subtag := field.Tag.Get("mb2st")
	if subtag != "" {
		subtag = ":" + subtag
	}
	tagMap[tag] = props
}

package massbank

import (
	"bufio"
	"errors"
	"io"
	"log"
	"os"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"
)

func (p *DefaultProperty) Parse(string) error {
	return errors.New("not implemented")
}

func (p *StringProperty) Parse(s string) error {
	p.string = s
	return nil
}

func (p *SubtagProperty) Parse(s string) error {
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 {
		p.subtag = ss[0]
		p.string = ss[1]
	} else {
		return errors.New("Subtag error: " + s)
	}
	return nil
}

func (p *DatabaseProperty) Parse(s string) error {
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 {
		p.Database = ss[0]
		p.Identifier = ss[1]
	} else {
		return errors.New("Subtag error: " + s)
	}
	return nil
}

func (d *RecordDate) Parse(s string) error {
	var err error
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 {
		re := regexp.MustCompile("\\(Created (.*)\\)")
		ss2 := re.FindStringSubmatch(ss[1])
		if len(ss2) == 2 {
			ss3 := strings.SplitN(ss2[1], ",", 2)
			if len(ss3) > 1 {
				if d.Created, err = time.Parse(dateFormat, ss3[0]); err != nil {
					return err
				}
				ss4 := strings.SplitN(strings.TrimSpace(ss3[1]), " ", 2)
				if len(ss4) > 1 {
					if d.Modified, err = time.Parse(dateFormat, ss4[1]); strings.TrimSpace(ss4[0]) != "modified" || err != nil {
						return err
					}
				} else {
					return err
				}
			} else {
				if d.Created, err = time.Parse(dateFormat, ss2[1]); err != nil {
					return err
				}
			}
		}
	} else {
		if d.Created, err = time.Parse(dateFormat, ss[0]); err != nil {
			return err
		}
	}
	d.Updated, err = time.Parse(dateFormat, ss[0])
	if err != nil {
		return err
	}
	return nil

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

func (names *RecordAuthorNames) Parse(s string) error {
	ss := strings.Split(s, ",")
	for _, s1 := range ss {
		re := regexp.MustCompile("(.*)([(.*)])?")
		ss1 := re.FindStringSubmatch(s1)
		marc := ""
		if len(ss1) > 2 {
			marc = ss1[2]
		}
		if len(ss1) > 1 {
			names.value = append(names.value, RecordAuthorName{ss1[1], marc})
		}
	}
	return nil
}

func (cc *ChCompoundClasses) Parse(s string) error {
	ss := strings.Split(s, ";")
	for _, s1 := range ss {
		var c = ChCompoundClass(strings.TrimSpace(s1))
		cc.value = append(cc.value, c)
	}
	return nil
}

func (mass *ChMass) Parse(s string) error {
	var err error
	mass.value, err = strconv.ParseFloat(s, 64)
	if err != nil {
		return err
	}
	return nil
}

func (n *PkNumPeak) Parse(s string) error {
	val, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		return err
	}
	n.Value = uint(val)
	return nil
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

func (p *PkAnnotation) Parse(s string) error {
	p.Header = strings.Split(s, " ")
	p.Values = map[string][]interface{}{}
	return nil
}

func (p *SpLineage) Parse(s string) error {
	ss := strings.Split(s, ";")
	for _, es := range ss {
		element := SpLineageElement{}
		element.string = strings.TrimSpace(es)
		p.value = append(p.value, element)
	}
	return nil
}

func (p *RecordComment) Parse(s string) error {
	ss := strings.SplitN(s, " ", 2)
	if len(ss) > 1 && contains(commentSubtagList, strings.TrimSpace(ss[0])) {
		p.subtag = ss[0]
		p.string = ss[1]
	} else if len(s) > 0 {
		p.string = s
	} else {
		return errors.New("Subtag error: " + s)
	}
	return nil
}

func ParseFile(fileName string) (mb *Massbank, err error) {
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

func ScanMbFile(mb2Reader io.Reader, fileName string) (*Massbank, error) {
	if len(TagMap) == 0 {
		buildTags()
	}
	var mb = Massbank{}
	mb.File.FileName = fileName
	scanner := bufio.NewScanner(mb2Reader)
	lineNum := 0
	for scanner.Scan() {
		line := scanner.Text()
		mb.ReadLine(line, lineNum)
		lineNum++
	}
	return &mb, nil
}

func (mb *Massbank) ReadLine(line string, lineNum int) {
	if strings.HasPrefix(line, "//") {
		// ignore comment
	} else if strings.HasPrefix(line, "  ") {
		if lastTag == "PK$PEAK" {
			mb.parsePeakValue(line, lineNum)
		} else if lastTag == "PK$ANNOTATION" {
			mb.parseAnnotationValue(line, lineNum)
		} else {
			println("not implemented", line)
		}
	} else {
		s := strings.SplitN(line, ":", 2)
		if len(s) == 2 {
			tag := strings.TrimSpace(s[0])
			mb.addValue(tag, strings.TrimSpace(s[1]), lineNum)
			lastTag = tag
		} else {
			println("The line is not a valid massbank tag line: \n", line)
		}
	}
}

func (mb *Massbank) parsePeakValue(line string, lineNum int) error {
	svals := strings.Split(strings.TrimSpace(line), " ")
	if len(svals) != 3 {
		return errors.New("Could not read Peakvalue: line " + strconv.Itoa(lineNum))
	}
	var mz, intens float64
	var err error
	var rel uint64
	if mz, err = strconv.ParseFloat(svals[0], 32); err != nil {
		return errors.New("could not parse mz value")
	}
	if intens, err = strconv.ParseFloat(svals[1], 32); err != nil {
		return errors.New("could not parse intensity value")
	}
	if rel, err = strconv.ParseUint(svals[2], 10, 32); err != nil {
		return errors.New("could not parse relative intensity")
	}
	mb.Peak.Peak.Mz = append(mb.Peak.Peak.Mz, mz)
	mb.Peak.Peak.Intensity = append(mb.Peak.Peak.Intensity, intens)
	mb.Peak.Peak.Rel = append(mb.Peak.Peak.Rel, uint(rel))
	return nil
}

func (mb *Massbank) parseAnnotationValue(line string, lineNum int) {
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

func (mb *Massbank) addValue(tagname string, value string, lineNum int) error {
	tagInfo := TagMap[tagname]
	index := tagInfo.Index
	mb2 := reflect.ValueOf(mb)
	mb3 := reflect.Indirect(mb2)
	prop := mb3.FieldByIndex(index)
	prop2 := prop.Type().Elem()
	if prop.Kind() == reflect.Slice {
		prop2 = prop2.Elem()
	}
	newPro := reflect.New(prop2)
	newInterf := newPro.Interface()
	propInt := newInterf.(Property)
	err := propInt.Parse(value)
	if err != nil {
		log.Println(err.Error(), "Tag: ", tagname, "File: ", mb.File.FileName, "Line: ", lineNum)
	}
	if prop.Kind() == reflect.Slice {
		prop.Set(reflect.Append(prop, newPro))
	} else {
		prop.Set(newPro)
	}
	return nil
}

package massbank

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/bsontype"
	"strings"
	"time"
)

func (p DatabaseProperty) MarshalBSONValue() (bsontype.Type, []byte, error) {
	return bson.MarshalValue(bson.E{
		Key:   p.Database,
		Value: p.Identifier,
	})
}

func (p SubtagProperty) MarshalBSONValue() (bsontype.Type, []byte, error) {
	return bson.MarshalValue(bson.E{
		Key:   p.Subtag,
		Value: p.Value,
	})
}

func (p RecordDeprecated) MarshalBSONValue() (bsontype.Type, []byte, error) {
	return bson.MarshalValue(struct {
		Date   time.Time
		Reason string
	}{p.Date, p.Reason})
}

func (p RecordDate) MarshalBSONValue() (bsontype.Type, []byte, error) {
	return bson.MarshalValue(bson.D{
		{"updated", p.Updated},
		{"created", p.Created},
		{"modified", p.Modified}})
}

func (p PkPeak) MarshalBSONValue() (bsontype.Type, []byte, error) {
	return bson.MarshalValue(struct {
		Header    []string
		Mz        []float64
		Intensity []float64
		Rel       []uint
	}{p.Header, p.Mz, p.Intensity, p.Rel})
}

func (p PkAnnotation) MarshalBSONValue() (bsontype.Type, []byte, error) {
	return bson.MarshalValue(struct {
		Header []string
		Values map[string][]interface{}
	}{p.Header, p.Values})
}

func (p *DatabaseProperty) UnmarshalBSONValue(t bsontype.Type, b []byte) error {
	var raw = bson.RawValue{Type: t, Value: b}
	var doc bson.E
	if err := raw.Unmarshal(&doc); err != nil {
		return err
	}
	p.Database = doc.Key
	p.Identifier = fmt.Sprintf("%v", doc.Value)
	return nil
}

func (p *SubtagProperty) UnmarshalBSONValue(t bsontype.Type, b []byte) error {
	var raw = bson.RawValue{Type: t, Value: b}
	var doc bson.E
	if err := raw.Unmarshal(&doc); err != nil {
		return err
	}
	p.Subtag = doc.Key
	p.Value = fmt.Sprintf("%v", doc.Value)
	return nil
}

func (p *RecordDeprecated) UnmarshalBSONValue(t bsontype.Type, b []byte) error {
	var raw = bson.RawValue{Type: t, Value: b}
	var v struct {
		Date   time.Time
		Reason string
	}
	if t != bsontype.Null {
		if err := raw.Unmarshal(&v); err != nil {
			return err
		}
		p.Reason = v.Reason
		p.Date = v.Date
	}
	return nil
}

func (p *RecordDate) UnmarshalBSONValue(t bsontype.Type, b []byte) error {
	var raw = bson.RawValue{Type: t, Value: b}.Document()
	var err error
	if p.Created, err = getTime(raw, "created"); err != nil {
		return err
	}
	p.Updated, err = getTime(raw, "updated")
	if err != nil {
		return err
	}
	p.Modified, err = getTime(raw, "modified")
	return err
}

func getTime(raw bson.Raw, key string) (time.Time, error) {
	var t time.Time
	var ok bool
	var err error
	t, ok = raw.Lookup(key).TimeOK()
	if !ok {
		s := strings.Trim(raw.Lookup(key).String(), "\"")
		if t, err = time.Parse(time.RFC3339, s); err != nil {
			return t, err
		}
	}
	return t, nil
}

func (p *PkAnnotation) UnmarshalBSONValue(t bsontype.Type, b []byte) error {
	var raw = bson.RawValue{Type: t, Value: b}
	var v struct {
		Header []string
		Values map[string][]interface{}
	}
	if err := raw.Unmarshal(&v); err != nil {
		return err
	}
	p.Header = v.Header
	p.Values = v.Values
	return nil
}

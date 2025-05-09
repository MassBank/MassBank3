// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 */

package mb3server




// MbRecordPeakPeak - Peak Data
type MbRecordPeakPeak struct {

	// Fixed header
	Header []string `json:"header,omitempty"`

	// Peak values
	Values []MbRecordPeakPeakValuesInner `json:"values,omitempty"`
}

// AssertMbRecordPeakPeakRequired checks if the required fields are not zero-ed
func AssertMbRecordPeakPeakRequired(obj MbRecordPeakPeak) error {
	for _, el := range obj.Values {
		if err := AssertMbRecordPeakPeakValuesInnerRequired(el); err != nil {
			return err
		}
	}
	return nil
}

// AssertMbRecordPeakPeakConstraints checks if the values respects the defined constraints
func AssertMbRecordPeakPeakConstraints(obj MbRecordPeakPeak) error {
	for _, el := range obj.Values {
		if err := AssertMbRecordPeakPeakValuesInnerConstraints(el); err != nil {
			return err
		}
	}
	return nil
}

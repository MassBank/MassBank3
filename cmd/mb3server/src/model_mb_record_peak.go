/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

type MbRecordPeak struct {

	// Hashed Identifier of Mass Spectra
	Splash string `json:"splash"`

	Annotation MbRecordPeakAnnotation `json:"annotation,omitempty"`

	// Total Number of Peaks
	NumPeak int32 `json:"numPeak"`

	Peak MbRecordPeakPeak `json:"peak"`
}

// AssertMbRecordPeakRequired checks if the required fields are not zero-ed
func AssertMbRecordPeakRequired(obj MbRecordPeak) error {
	elements := map[string]interface{}{
		"splash":  obj.Splash,
		"numPeak": obj.NumPeak,
		"peak":    obj.Peak,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	if err := AssertMbRecordPeakAnnotationRequired(obj.Annotation); err != nil {
		return err
	}
	if err := AssertMbRecordPeakPeakRequired(obj.Peak); err != nil {
		return err
	}
	return nil
}

// AssertRecurseMbRecordPeakRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of MbRecordPeak (e.g. [][]MbRecordPeak), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseMbRecordPeakRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aMbRecordPeak, ok := obj.(MbRecordPeak)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertMbRecordPeakRequired(aMbRecordPeak)
	})
}

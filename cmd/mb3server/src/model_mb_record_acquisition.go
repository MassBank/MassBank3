/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

// MbRecordAcquisition -
type MbRecordAcquisition struct {

	// Commercial name and manufacturer of instrument
	Instrument string `json:"instrument"`

	// Type of instrument
	InstrumentType string `json:"instrument_type" validate:"regexp=((CE|GC|LC)-)?(APCI|APPI|EI|ESI|FAB|MALDI,FD|CI|FISIMS)-(B|E|FT|IT|Q|TOF)(B|E|FT|IT|Q|TOF)?"`

	MassSpectrometry AcMassSpec `json:"mass_spectrometry"`

	Chromatography []AcChromatographyInner `json:"chromatography,omitempty"`

	General []AcGeneralInner `json:"general,omitempty"`

	IonMobility []AcIonMobilityInner `json:"ion_mobility,omitempty"`
}

// AssertMbRecordAcquisitionRequired checks if the required fields are not zero-ed
func AssertMbRecordAcquisitionRequired(obj MbRecordAcquisition) error {
	elements := map[string]interface{}{
		"instrument":        obj.Instrument,
		"instrument_type":   obj.InstrumentType,
		"mass_spectrometry": obj.MassSpectrometry,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	if err := AssertAcMassSpecRequired(obj.MassSpectrometry); err != nil {
		return err
	}
	for _, el := range obj.Chromatography {
		if err := AssertAcChromatographyInnerRequired(el); err != nil {
			return err
		}
	}
	for _, el := range obj.General {
		if err := AssertAcGeneralInnerRequired(el); err != nil {
			return err
		}
	}
	for _, el := range obj.IonMobility {
		if err := AssertAcIonMobilityInnerRequired(el); err != nil {
			return err
		}
	}
	return nil
}

// AssertRecurseMbRecordAcquisitionRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of MbRecordAcquisition (e.g. [][]MbRecordAcquisition), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseMbRecordAcquisitionRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aMbRecordAcquisition, ok := obj.(MbRecordAcquisition)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertMbRecordAcquisitionRequired(aMbRecordAcquisition)
	})
}

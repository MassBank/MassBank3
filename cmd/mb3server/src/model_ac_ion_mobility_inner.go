/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

type AcIonMobilityInner struct {
	Subtag string `json:"subtag,omitempty"`

	Value string `json:"value,omitempty"`
}

// AssertAcIonMobilityInnerRequired checks if the required fields are not zero-ed
func AssertAcIonMobilityInnerRequired(obj AcIonMobilityInner) error {
	return nil
}

// AssertRecurseAcIonMobilityInnerRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of AcIonMobilityInner (e.g. [][]AcIonMobilityInner), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseAcIonMobilityInnerRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aAcIonMobilityInner, ok := obj.(AcIonMobilityInner)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertAcIonMobilityInnerRequired(aAcIonMobilityInner)
	})
}

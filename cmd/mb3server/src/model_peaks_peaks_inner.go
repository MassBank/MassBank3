/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

type PeaksPeaksInner struct {
	Operator string `json:"operator,omitempty"`

	Mz float32 `json:"mz,omitempty"`
}

// AssertPeaksPeaksInnerRequired checks if the required fields are not zero-ed
func AssertPeaksPeaksInnerRequired(obj PeaksPeaksInner) error {
	return nil
}

// AssertRecursePeaksPeaksInnerRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of PeaksPeaksInner (e.g. [][]PeaksPeaksInner), otherwise ErrTypeAssertionError is thrown.
func AssertRecursePeaksPeaksInnerRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aPeaksPeaksInner, ok := obj.(PeaksPeaksInner)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertPeaksPeaksInnerRequired(aPeaksPeaksInner)
	})
}

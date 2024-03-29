/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

type PeakListPeaksInner struct {
	Mz float32 `json:"mz,omitempty"`

	Intensity int32 `json:"intensity,omitempty"`
}

// AssertPeakListPeaksInnerRequired checks if the required fields are not zero-ed
func AssertPeakListPeaksInnerRequired(obj PeakListPeaksInner) error {
	return nil
}

// AssertRecursePeakListPeaksInnerRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of PeakListPeaksInner (e.g. [][]PeakListPeaksInner), otherwise ErrTypeAssertionError is thrown.
func AssertRecursePeakListPeaksInnerRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aPeakListPeaksInner, ok := obj.(PeakListPeaksInner)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertPeakListPeaksInnerRequired(aPeakListPeaksInner)
	})
}

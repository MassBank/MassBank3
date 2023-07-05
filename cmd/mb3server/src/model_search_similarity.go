/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

type SearchSimilarity struct {
	Mz []float64 `json:"Mz,omitempty"`

	Intensities []float64 `json:"Intensities,omitempty"`

	Parameters map[string]interface{} `json:"Parameters,omitempty"`
}

// AssertSearchSimilarityRequired checks if the required fields are not zero-ed
func AssertSearchSimilarityRequired(obj SearchSimilarity) error {
	return nil
}

// AssertRecurseSearchSimilarityRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of SearchSimilarity (e.g. [][]SearchSimilarity), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseSearchSimilarityRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aSearchSimilarity, ok := obj.(SearchSimilarity)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertSearchSimilarityRequired(aSearchSimilarity)
	})
}

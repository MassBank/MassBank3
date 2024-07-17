/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

// SimilaritySearchResultDataInner - A record with similarity score.
type SimilaritySearchResultDataInner struct {

	// MassBank accession id.
	Accession string `json:"accession,omitempty"`

	// Similarity score to the query spectrum.
	Score float32 `json:"score,omitempty"`
}

// AssertSimilaritySearchResultDataInnerRequired checks if the required fields are not zero-ed
func AssertSimilaritySearchResultDataInnerRequired(obj SimilaritySearchResultDataInner) error {
	return nil
}

// AssertRecurseSimilaritySearchResultDataInnerRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of SimilaritySearchResultDataInner (e.g. [][]SimilaritySearchResultDataInner), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseSimilaritySearchResultDataInnerRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aSimilaritySearchResultDataInner, ok := obj.(SimilaritySearchResultDataInner)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertSimilaritySearchResultDataInnerRequired(aSimilaritySearchResultDataInner)
	})
}
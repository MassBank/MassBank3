/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

// SearchResultDataInner - Data for a single compound.
type SearchResultDataInner struct {
	Data map[string]interface{} `json:"data,omitempty"`

	// Compound name.
	Name string `json:"name,omitempty"`

	// Formula of the compound.
	Formula string `json:"formula,omitempty"`

	// Exact Mass of the compound.
	Mass float64 `json:"mass,omitempty"`

	// Smiles to generate structure.
	Smiles string `json:"smiles,omitempty"`

	// A list of spectra for the compound
	Spectra []SearchResultDataInnerSpectraInner `json:"spectra,omitempty"`
}

// AssertSearchResultDataInnerRequired checks if the required fields are not zero-ed
func AssertSearchResultDataInnerRequired(obj SearchResultDataInner) error {
	for _, el := range obj.Spectra {
		if err := AssertSearchResultDataInnerSpectraInnerRequired(el); err != nil {
			return err
		}
	}
	return nil
}

// AssertRecurseSearchResultDataInnerRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of SearchResultDataInner (e.g. [][]SearchResultDataInner), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseSearchResultDataInnerRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aSearchResultDataInner, ok := obj.(SearchResultDataInner)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertSearchResultDataInnerRequired(aSearchResultDataInner)
	})
}
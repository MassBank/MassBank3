// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 */

package mb3server




type AcGeneralInner struct {

	Subtag string `json:"subtag,omitempty"`

	Value string `json:"value,omitempty"`
}

// AssertAcGeneralInnerRequired checks if the required fields are not zero-ed
func AssertAcGeneralInnerRequired(obj AcGeneralInner) error {
	return nil
}

// AssertAcGeneralInnerConstraints checks if the values respects the defined constraints
func AssertAcGeneralInnerConstraints(obj AcGeneralInner) error {
	return nil
}

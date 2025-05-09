// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 */

package mb3server


import (
	"errors"
)



type StringCountInner struct {

	Value string `json:"value,omitempty"`

	Count int32 `json:"count,omitempty"`
}

// AssertStringCountInnerRequired checks if the required fields are not zero-ed
func AssertStringCountInnerRequired(obj StringCountInner) error {
	return nil
}

// AssertStringCountInnerConstraints checks if the values respects the defined constraints
func AssertStringCountInnerConstraints(obj StringCountInner) error {
	if obj.Count < 0 {
		return &ParsingError{Param: "Count", Err: errors.New(errMsgMinValueConstraint)}
	}
	return nil
}

/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

// MbRecordDeprecated - Mark the record as deprecated
type MbRecordDeprecated struct {

	// Date of deprecation
	Date string `json:"date,omitempty"`

	// reason for deprecation
	Reason string `json:"reason,omitempty"`
}

// AssertMbRecordDeprecatedRequired checks if the required fields are not zero-ed
func AssertMbRecordDeprecatedRequired(obj MbRecordDeprecated) error {
	return nil
}

// AssertRecurseMbRecordDeprecatedRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of MbRecordDeprecated (e.g. [][]MbRecordDeprecated), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseMbRecordDeprecatedRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aMbRecordDeprecated, ok := obj.(MbRecordDeprecated)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertMbRecordDeprecatedRequired(aMbRecordDeprecated)
	})
}

/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

// MbRecordCompound - Information of Chemical Compound Analyzed
type MbRecordCompound struct {

	// Chemical names
	Names []string `json:"names"`

	// Chemical category
	Classes []string `json:"classes"`

	// Chemical formula
	Formula string `json:"formula"`

	// Exact mass
	Mass float64 `json:"mass"`

	// SMILES code
	Smiles string `json:"smiles"`

	// InChI code
	Inchi string `json:"inchi"`

	// External database name with identifier
	Link []DatabaseObject `json:"link,omitempty"`
}

// AssertMbRecordCompoundRequired checks if the required fields are not zero-ed
func AssertMbRecordCompoundRequired(obj MbRecordCompound) error {
	elements := map[string]interface{}{
		"names":   obj.Names,
		"classes": obj.Classes,
		"formula": obj.Formula,
		"mass":    obj.Mass,
		"smiles":  obj.Smiles,
		"inchi":   obj.Inchi,
	}
	for name, el := range elements {
		if isZero := IsZeroValue(el); isZero {
			return &RequiredError{Field: name}
		}
	}

	for _, el := range obj.Link {
		if err := AssertDatabaseObjectRequired(el); err != nil {
			return err
		}
	}
	return nil
}

// AssertRecurseMbRecordCompoundRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of MbRecordCompound (e.g. [][]MbRecordCompound), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseMbRecordCompoundRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aMbRecordCompound, ok := obj.(MbRecordCompound)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertMbRecordCompoundRequired(aMbRecordCompound)
	})
}

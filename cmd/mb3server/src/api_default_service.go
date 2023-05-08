/*
 * MassBank3 API
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 3.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package mb3server

import (
	"context"
	"errors"
	"net/http"
)

// DefaultApiService is a service that implements the logic for the DefaultApiServicer
// This service should implement the business logic for every endpoint for the DefaultApi API.
// Include any external packages or services that will be required by this service.
type DefaultApiService struct {
}

// NewDefaultApiService creates a default api service
func NewDefaultApiService() DefaultApiServicer {
	return &DefaultApiService{}
}

// GetBrowseOptions - get browse options
func (s *DefaultApiService) GetBrowseOptions(ctx context.Context) (ImplResponse, error) {
	opt, err := GetBrowseOptions()
	if err != nil {
		return Response(http.StatusInternalServerError, nil), errors.New("Could not get results")
	}
	return Response(http.StatusOK, opt), nil
}

// GetFilterOptions - get filter options
func (s *DefaultApiService) GetFilterOptions(ctx context.Context) (ImplResponse, error) {

	opt, err := GetBrowseOptions()
	if err != nil {
		return Response(http.StatusInternalServerError, nil), errors.New("Could not get results")
	}
	return Response(http.StatusOK, opt), nil

}

// GetMetadata - get massbank metadata
func (s *DefaultApiService) GetMetadata(ctx context.Context) (ImplResponse, error) {
	// TODO - update GetMetadata with the required logic for this service method.
	// Add api_default_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, Metadata{}) or use other options such as http.Ok ...
	//return Response(200, Metadata{}), nil

	return Response(http.StatusNotImplemented, nil), errors.New("GetMetadata method not implemented")
}

// GetRecord - Get a MassBank record
func (s *DefaultApiService) GetRecord(ctx context.Context, accession string) (ImplResponse, error) {
	// TODO - update GetRecord with the required logic for this service method.
	// Add api_default_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	record, err := GetRecord(accession)
	return Response(200, record), err

	return Response(http.StatusNotImplemented, nil), errors.New("GetRecord method not implemented")
}

// GetRecords - Get a list of records
func (s *DefaultApiService) GetRecords(ctx context.Context, instrumentType []string, splash string, msType []string, ionMode string, compoundName string, exactMass string, massTolerance float64, formula string, peaks []string, intensity int32, peakDifferences []string, peakList []string, limit int32, page int32, intensityCutoff int32, inchiKey string, contributor string) (ImplResponse, error) {
	result, err := GetRecords(limit, (page-1)*limit)
	if err != nil {
		return Response(http.StatusInternalServerError, nil), errors.New("Could not get results")
	}
	return Response(200, result), nil

}

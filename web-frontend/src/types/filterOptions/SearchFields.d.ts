import CompoundSearchFilterOptions from './CompoundSearchFilterOptions';
import PropertyFilterOptions from './PropertyFilterOptions';
import SpectralSearchFilterOptions from './SpectralSearchFilterOptions';

interface SearchFields {
  compoundSearchFilterOptions?: CompoundSearchFilterOptions;
  spectralSearchFilterOptions?: SpectralSearchFilterOptions;
  propertyFilterOptions?: PropertyFilterOptions;
}

export default SearchFields;

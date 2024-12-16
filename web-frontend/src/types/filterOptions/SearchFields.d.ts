import PeakSearchFilterOptions from './PeakSearchFilterOptions';
import SimilarityFilterOptions from './SimilarityFilterOptions';

interface SearchFields {
  basicSearchFilterOptions?: BasicSearchFilterOptions;
  peaks?: {
    similarity?: SimilarityFilterOptions;
    peaks?: PeakSearchFilterOptions;
  };
  inchi?: string;
  splash?: string;
  massSpecFilterOptions?: {
    contributor: string[];
    instrument_type: string[];
    ion_mode: string[];
    ms_type: string[];
  };
  structure?: string;
}

export default SearchFields;

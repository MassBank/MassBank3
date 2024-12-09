import ContentFilterOptions from './ContentFilterOtions';
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
  massSpecFilterOptions?: ContentFilterOptions;
  structure?: string;
}

export default SearchFields;

import NeutralLossFilterOptions from './NeutralLossFilterOptions';
import PeakSearchFilterOptions from './PeakSearchFilterOptions';
import SimilarityFilterOptions from './SimilarityFilterOptions';

interface SpectralSearchFilterOptions {
  similarity?: SimilarityFilterOptions;
  peaks?: PeakSearchFilterOptions;
  neutralLoss?: NeutralLossFilterOptions;
  splash?: string;
}

export default SpectralSearchFilterOptions;

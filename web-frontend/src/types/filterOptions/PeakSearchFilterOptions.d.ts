import PeakSearchPeakType from './PeakSearchPeakType';

interface PeakSearchFilterOptions {
  peaks?: PeakSearchPeakType[] | undefined;
  massTolerance?: number;
  intensity?: number;
}

export default PeakSearchFilterOptions;

import PeakSearchPeakType from './PeakSearchPeakType';

interface NeutralLossFilterOptions {
  neutralLosses?: PeakSearchPeakType[] | undefined;
  massTolerance?: number;
  intensity?: number;
}

export default NeutralLossFilterOptions;

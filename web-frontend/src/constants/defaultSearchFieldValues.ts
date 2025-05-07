import SearchFields from '../types/filterOptions/SearchFields';

const defaultMassTolerance = 0.1;
const defaultSimilarityThreshold = 0.8;
const defaultPeakIntensity = 50;

const defaultSearchFieldValues: SearchFields = {
  compoundSearchFilterOptions: {
    compoundName: undefined,
    formula: undefined,
    exactMass: undefined,
    massTolerance: defaultMassTolerance,
    inchi: undefined,
    structure: undefined,
  },
  spectralSearchFilterOptions: {
    similarity: {
      peakList: undefined,
      threshold: defaultSimilarityThreshold,
    },
    peaks: {
      peaks: [],
      massTolerance: defaultMassTolerance,
      intensity: defaultPeakIntensity,
    },
    neutralLoss: {
      neutralLosses: [],
      massTolerance: defaultMassTolerance,
      intensity: defaultPeakIntensity,
    },
    splash: undefined,
  },
  propertyFilterOptions: undefined,
};

export default defaultSearchFieldValues;

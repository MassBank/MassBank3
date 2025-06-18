import defaultSearchFieldValues from '../constants/defaultSearchFieldValues';
import CompoundSearchFilterOptions from '../types/filterOptions/CompoundSearchFilterOptions';
import PeakSearchPeakType from '../types/filterOptions/PeakSearchPeakType';
import SearchFields from '../types/filterOptions/SearchFields';
import SpectralSearchFilterOptions from '../types/filterOptions/SpectralSearchFilterOptions';

function buildFormDataFromSearchParams(searchParams: URLSearchParams) {
  const formData = JSON.parse(
    JSON.stringify(defaultSearchFieldValues),
  ) as SearchFields;
  let containsValues = false;

  formData.propertyFilterOptions = {
    contributor: searchParams.get('contributor')?.split(',') ?? [],
    instrument_type: searchParams.get('instrument_type')?.split(',') ?? [],
    ms_type: searchParams.get('ms_type')?.split(',') ?? [],
    ion_mode: searchParams.get('ion_mode')?.split(',') ?? [],
  };
  containsValues =
    formData.propertyFilterOptions.contributor.length > 0 ||
    formData.propertyFilterOptions.instrument_type.length > 0 ||
    formData.propertyFilterOptions.ms_type.length > 0 ||
    formData.propertyFilterOptions.ion_mode.length > 0;

  const similarityPeakList = searchParams.get('peak_list');
  if (similarityPeakList && similarityPeakList.length > 0) {
    const peak_list_text = similarityPeakList
      .split(',')
      .map((p) => {
        const split = p.split(';');
        return split.join(' ');
      })
      .join('\n');
    const similarityPeakListThreshold = searchParams.get('peak_list_threshold');
    const peak_list_threshold =
      similarityPeakListThreshold !== undefined
        ? Number(similarityPeakListThreshold)
        : defaultSearchFieldValues.spectralSearchFilterOptions!.similarity!
            .threshold;
    if (formData.spectralSearchFilterOptions) {
      formData.spectralSearchFilterOptions.similarity = {
        peakList: peak_list_text,
        threshold: peak_list_threshold,
      };
    }
    containsValues = true;
  }

  const compound_name = searchParams.get('compound_name');
  if (compound_name && compound_name.length > 0) {
    (
      formData.compoundSearchFilterOptions as CompoundSearchFilterOptions
    ).compoundName = compound_name;
    containsValues = true;
  }

  const compound_class = searchParams.get('compound_class');
  if (compound_class && compound_class.length > 0) {
    (
      formData.compoundSearchFilterOptions as CompoundSearchFilterOptions
    ).compoundClass = compound_class;
    containsValues = true;
  }

  const formula = searchParams.get('formula');
  if (formula && formula.length > 0) {
    (
      formData.compoundSearchFilterOptions as CompoundSearchFilterOptions
    ).formula = formula;
    containsValues = true;
  }

  const exact_mass = searchParams.get('exact_mass');
  if (exact_mass && exact_mass.length > 0) {
    (
      formData.compoundSearchFilterOptions as CompoundSearchFilterOptions
    ).exactMass = Number(exact_mass);
    containsValues = true;

    const mass_tolerance = searchParams.get('mass_tolerance');
    if (mass_tolerance && mass_tolerance.length > 0) {
      (
        formData.compoundSearchFilterOptions as CompoundSearchFilterOptions
      ).massTolerance = Number(mass_tolerance);
    }
  }

  const inchi = searchParams.get('inchi') ?? searchParams.get('inchi_key');
  if (inchi && inchi.length > 0) {
    (
      formData.compoundSearchFilterOptions as CompoundSearchFilterOptions
    ).inchi = inchi;
    containsValues = true;
  }

  const splash = searchParams.get('splash');
  if (splash && splash.length > 0) {
    (
      formData.spectralSearchFilterOptions as SpectralSearchFilterOptions
    ).splash = splash;
    containsValues = true;
  }

  const substructure = searchParams.get('substructure');
  if (substructure && substructure.length > 0) {
    (
      formData.compoundSearchFilterOptions as CompoundSearchFilterOptions
    ).structure = substructure;
    containsValues = true;
  }

  const peaks = searchParams.get('peaks');
  if (peaks && peaks.length > 0) {
    const peak_list: PeakSearchPeakType[] = peaks.split(',').map((p) => {
      return { mz: Number(p), formula: undefined };
    });
    const mass_tolerance = searchParams.get('mass_tolerance');
    const intensity = searchParams.get('intensity');
    (
      formData.spectralSearchFilterOptions as SpectralSearchFilterOptions
    ).peaks = {
      peaks: peak_list,
      massTolerance: mass_tolerance
        ? Number(mass_tolerance)
        : defaultSearchFieldValues.spectralSearchFilterOptions!.peaks!
            .massTolerance,
      intensity: intensity
        ? Number(intensity)
        : defaultSearchFieldValues.spectralSearchFilterOptions!.peaks!
            .intensity,
    };
    containsValues = true;
  }

  const neutralLoss = searchParams.get('neutral_loss');
  if (neutralLoss && neutralLoss.length > 0) {
    const neutralLosses = neutralLoss.split(',').map((p) => {
      return { mz: Number(p), formula: undefined } as PeakSearchPeakType;
    });
    const mass_tolerance = searchParams.get('mass_tolerance');
    const intensity = searchParams.get('intensity');
    (
      formData.spectralSearchFilterOptions as SpectralSearchFilterOptions
    ).neutralLoss = {
      neutralLosses,
      massTolerance: mass_tolerance
        ? Number(mass_tolerance)
        : defaultSearchFieldValues.spectralSearchFilterOptions!.neutralLoss!
            .massTolerance,
      intensity: intensity
        ? Number(intensity)
        : defaultSearchFieldValues.spectralSearchFilterOptions!.neutralLoss!
            .intensity,
    };
    containsValues = true;
  }

  return { formData, containsValues };
}

export default buildFormDataFromSearchParams;

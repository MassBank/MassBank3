import defaultSearchFieldValues from '../constants/defaultSearchFieldValues';
import SearchFields from '../types/filterOptions/SearchFields';
import parsePeakListInputField from './parsePeakListAndReferences';
import propertyFilterOptionsFormDataToContentMapper from './propertyFilterOptionsFormDataToContentMapper';
import buildSearchParams from './request/buildSearchParams';

function buildSearchParamsFromFormData(formData: SearchFields) {
  const _defaultSearchFieldValues = JSON.parse(
    JSON.stringify(defaultSearchFieldValues),
  ) as SearchFields;
  if (!formData.compoundSearchFilterOptions) {
    formData.compoundSearchFilterOptions =
      _defaultSearchFieldValues.compoundSearchFilterOptions;
  }
  if (!formData.spectralSearchFilterOptions) {
    formData.spectralSearchFilterOptions =
      _defaultSearchFieldValues.spectralSearchFilterOptions;
  }
  if (!formData.propertyFilterOptions) {
    formData.propertyFilterOptions =
      _defaultSearchFieldValues.propertyFilterOptions;
  }

  const formData_content = propertyFilterOptionsFormDataToContentMapper(
    formData.propertyFilterOptions,
    undefined,
  );
  const builtSearchParams = buildSearchParams(formData_content);

  const similarityPeakListInputFieldData = (
    formData.spectralSearchFilterOptions?.similarity?.peakList ?? ''
  ).trim();

  if (similarityPeakListInputFieldData.length > 0) {
    const peakList = parsePeakListInputField(similarityPeakListInputFieldData);
    builtSearchParams['peak_list'] = [
      peakList.map((p) => `${p.mz};${p.intensity}`).join(','),
    ];
    const peakListThreshold =
      formData.spectralSearchFilterOptions?.similarity?.threshold ?? 0;
    builtSearchParams['peak_list_threshold'] = [String(peakListThreshold)];
  }

  const peaks = (
    formData.spectralSearchFilterOptions?.peaks
      ? (formData.spectralSearchFilterOptions?.peaks.peaks ?? [])
      : []
  )
    .filter((p) => p.mz && p.mz > 0)
    .map((p) => p.mz);

  if (formData.spectralSearchFilterOptions?.peaks && peaks.length > 0) {
    builtSearchParams['peaks'] = [peaks.join(',')];
    if (
      formData.spectralSearchFilterOptions?.peaks.massTolerance &&
      formData.spectralSearchFilterOptions?.peaks.massTolerance > 0
    ) {
      builtSearchParams['mass_tolerance'] = [
        String(formData.spectralSearchFilterOptions?.peaks.massTolerance),
      ];
    }
    if (
      formData.spectralSearchFilterOptions?.peaks.intensity &&
      formData.spectralSearchFilterOptions?.peaks.intensity > 0
    ) {
      builtSearchParams['intensity'] = [
        String(formData.spectralSearchFilterOptions?.peaks.intensity),
      ];
    }
  }

  const neutralLoss = (
    formData.spectralSearchFilterOptions?.neutralLoss
      ? (formData.spectralSearchFilterOptions?.neutralLoss.neutralLosses ?? [])
      : []
  )
    .filter((p) => p.mz && p.mz > 0)
    .map((p) => p.mz);

  if (
    formData.spectralSearchFilterOptions?.neutralLoss &&
    neutralLoss.length > 0
  ) {
    builtSearchParams['neutral_loss'] = [neutralLoss.join(',')];
    if (
      formData.spectralSearchFilterOptions?.neutralLoss.massTolerance &&
      formData.spectralSearchFilterOptions?.neutralLoss.massTolerance > 0
    ) {
      builtSearchParams['mass_tolerance'] = [
        String(formData.spectralSearchFilterOptions?.neutralLoss.massTolerance),
      ];
    }
    if (
      formData.spectralSearchFilterOptions?.neutralLoss.intensity &&
      formData.spectralSearchFilterOptions?.neutralLoss.intensity > 0
    ) {
      builtSearchParams['intensity'] = [
        String(formData.spectralSearchFilterOptions?.neutralLoss.intensity),
      ];
    }
  }

  const inchi = (formData.compoundSearchFilterOptions?.inchi ?? '').trim();
  if (inchi.length > 0) {
    if (inchi.startsWith('InChI=')) {
      builtSearchParams['inchi'] = [inchi];
    } else {
      builtSearchParams['inchi_key'] = [inchi];
    }
  }

  const splash = (formData.spectralSearchFilterOptions?.splash ?? '').trim();
  if (splash.length > 0) {
    builtSearchParams['splash'] = [splash];
  }

  const compoundName = (
    formData.compoundSearchFilterOptions?.compoundName ?? ''
  ).trim();
  if (compoundName.length > 0) {
    builtSearchParams['compound_name'] = [compoundName];
  }

  const compoundClass = (
    formData.compoundSearchFilterOptions?.compoundClass ?? ''
  ).trim();
  if (compoundClass.length > 0) {
    builtSearchParams['compound_class'] = [compoundClass];
  }

  const formula = (formData.compoundSearchFilterOptions?.formula ?? '').trim();
  if (formula.length > 0) {
    builtSearchParams['formula'] = [formula];
  }

  const exactMass = formData.compoundSearchFilterOptions?.exactMass ?? 0;
  if (exactMass > 0) {
    builtSearchParams['exact_mass'] = [String(exactMass)];

    const massTolerance =
      formData.compoundSearchFilterOptions?.massTolerance ?? 0;
    if (exactMass > 0) {
      builtSearchParams['mass_tolerance'] = [String(massTolerance)];
    } else {
      builtSearchParams['mass_tolerance'] = ['0.0'];
    }
  }

  const smiles = formData.compoundSearchFilterOptions?.structure;
  if (smiles && smiles.trim().length > 0) {
    builtSearchParams['substructure'] = [smiles];
  }

  return builtSearchParams;
}

export default buildSearchParamsFromFormData;

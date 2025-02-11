import ContentFilterOptions from '../types/filterOptions/ContentFilterOtions';
import SearchFields from '../types/filterOptions/SearchFields';
import ValueCount from '../types/ValueCount';

const propertyFilterOptionsFormDataToContentMapper = (
  formData: SearchFields['propertyFilterOptions'],
  content: ContentFilterOptions | undefined,
) => {
  const mapper = (
    d: string[],
    cont: ValueCount[] | undefined,
  ): ValueCount[] => {
    if (!cont) {
      return (d || []).map((value) => ({ value }) as ValueCount);
    }
    return cont.map((vc) => {
      return {
        ...vc,
        flag: d.includes(vc.value),
      };
    });
  };

  return {
    contributor: mapper(formData?.contributor ?? [], content?.contributor),
    instrument_type: mapper(
      formData?.instrument_type ?? [],
      content?.instrument_type,
    ),
    ms_type: mapper(formData?.ms_type ?? [], content?.ms_type),
    ion_mode: mapper(formData?.ion_mode ?? [], content?.ion_mode),
  } as ContentFilterOptions;
};

export default propertyFilterOptionsFormDataToContentMapper;

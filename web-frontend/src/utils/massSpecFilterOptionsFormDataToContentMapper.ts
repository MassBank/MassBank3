import ContentFilterOptions from '../types/filterOptions/ContentFilterOtions';
import SearchFields from '../types/filterOptions/SearchFields';
import ValueCount from '../types/ValueCount';

const massSpecFilterOptionsFormDataToContentMapper = (
  formData_massSpecFilterOptions: SearchFields['massSpecFilterOptions'],
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
    contributor: mapper(
      formData_massSpecFilterOptions?.contributor || [],
      content?.contributor,
    ),
    instrument_type: mapper(
      formData_massSpecFilterOptions?.instrument_type || [],
      content?.instrument_type,
    ),
    ms_type: mapper(
      formData_massSpecFilterOptions?.ms_type || [],
      content?.ms_type,
    ),
    ion_mode: mapper(
      formData_massSpecFilterOptions?.ion_mode || [],
      content?.ion_mode,
    ),
  } as ContentFilterOptions;
};

export default massSpecFilterOptionsFormDataToContentMapper;

import ContentFilterOptions from '../../types/filterOptions/ContentFilterOtions';
import SearchParams from '../../types/SearchParams';
import ValueCount from '../../types/ValueCount';

function buildSearchParams(cont: ContentFilterOptions | undefined) {
  const searchParams: SearchParams = {};
  if (cont) {
    Object.keys(cont)
      .filter((k) => k !== 'metadata')
      .forEach((k) => {
        const values = (cont[k] as ValueCount[])
          .filter((vc) => (vc.flag !== undefined ? vc.flag : true))
          .map((vc) => vc.value);
        if (values.length > 0) {
          searchParams[k] = [values.join(',')];
        }
      });
  }

  return searchParams;
}

export default buildSearchParams;

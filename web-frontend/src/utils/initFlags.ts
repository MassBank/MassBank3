import ContentFilterOptions from '../types/filterOptions/ContentFilterOtions';
import ValueCount from '../types/ValueCount';

function initFlags(cont: ContentFilterOptions) {
  const keys = Object.keys(cont).filter((key) => key !== 'metadata');
  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    cont[key] = (cont[key] as ValueCount[]).map((vc) => {
      return {
        ...vc,
        count: vc.count || 0,
        flag: vc.flag !== undefined ? vc.flag : vc.count > 0,
      };
    });
  }

  return cont;
}

export default initFlags;

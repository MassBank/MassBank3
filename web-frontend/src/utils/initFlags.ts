import Content from '../types/Content';
import ValueCount from '../types/ValueCount';

function initFlags(cont: Content) {
  const keys = Object.keys(cont).filter((key) => key !== 'metadata');
  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    cont[key] = (cont[key] as ValueCount[]).map((vc) => {
      return {
        ...vc,
        count: vc.count || 0,
        flag: vc.count !== undefined && vc.count > 0,
      };
    });
  }

  return cont;
}

export default initFlags;

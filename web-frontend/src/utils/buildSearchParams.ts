import Content from '../types/Content';
import SearchParams from '../types/SearchParams';
import ValueCount from '../types/ValueCount';

function buildSearchParams(cont: Content | undefined) {
  const searchParams: SearchParams = {};
  if (cont) {
    Object.keys(cont)
      .filter((k) => k !== 'metadata')
      .forEach((k) => {
        const valueCounts = cont[k] as ValueCount[];
        const filtered = valueCounts
          .filter((_vc) => _vc.flag === true)
          .map((_vc) => _vc.value);
        if (filtered.length !== valueCounts.length) {
          searchParams[k] = [filtered.join(',')];
        }
      });
  }

  return searchParams;
}

export default buildSearchParams;

import Record from '../../types/record/Record';
import generateID from '../generateID';

import getRecord from './fetchRecord';

async function searchAccession(id: string, backendUrl: string) {
  const res = await getRecord(id, backendUrl);
  if (res && typeof res === 'object') {
    const rec = res as Record;
    rec.peak.peak.values = rec.peak.peak.values.map((p) => {
      const _p = p;
      _p.id = generateID();
      return _p;
    });
    return rec;
  }

  return undefined;
}

export default searchAccession;

import Record from '../../types/Record';
import generateID from '../generateID';
import getRecord from './fetchRecord';

async function searchAccession(id: string, backendUrl: string) {
  const rec: Record | undefined = await getRecord(id, backendUrl);
  if (rec && typeof rec === 'object') {
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

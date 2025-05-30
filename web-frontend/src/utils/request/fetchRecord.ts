import Record from '../../types/record/Record';
import fetchData from './fetchData';

async function getRecord(id: string, backendUrl: string) {
  const url = backendUrl + '/records/' + id;

  const record = await fetchData(url);
  if (!record || typeof record !== 'object') {
    return undefined;
  }
  const rec = record as Record;
  rec.peak.peak.values = rec.peak.peak.values.map((p) => {
    const _p = p;
    _p.id = 'peak-' + p.id;
    _p.rel = _p.rel ?? 0;
    return _p;
  });
  if (rec.peak.neutral_loss) {
    rec.peak.neutral_loss = rec.peak.neutral_loss.map((nl) => {
      const _nl = { ...nl };
      _nl.peak_id = 'peak-' + nl.peak_id;
      return _nl;
    });
  }

  return rec;
}

export default getRecord;

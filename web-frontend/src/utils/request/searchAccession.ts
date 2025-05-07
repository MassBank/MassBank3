import Record from '../../types/record/Record';
import getRecord from './fetchRecord';

async function searchAccession(id: string, backendUrl: string) {
  const res = await getRecord(id, backendUrl);
  if (res && typeof res === 'object') {
    const rec = res as Record;
    rec.peak.peak.values = rec.peak.peak.values.map((p) => {
      const _p = p;
      _p.id = 'peak-' + p.id;
      return _p;
    });
    if (rec.peak.neutral_loss) {
      rec.peak.neutral_loss = rec.peak.neutral_loss.map((nl) => {
        const _nl = { ...nl };
        _nl.peak1_id = 'peak-' + nl.peak1_id;
        _nl.peak2_id = 'peak-' + nl.peak2_id;
        return _nl;
      });
    }

    return rec;
  }

  return undefined;
}

export default searchAccession;

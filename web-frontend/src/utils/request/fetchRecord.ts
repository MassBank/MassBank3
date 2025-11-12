import Record from '../../types/record/Record';
import RequestResponse from '../../types/RequestResponse';
import fetchData from './fetchData';

async function getRecord(
  id: string,
  backendUrl: string,
): Promise<RequestResponse<Record | null>> {
  const url = backendUrl + '/records/' + id;

  const response = (await fetchData(url)) as RequestResponse<Record | null>;
  if (response.status !== 'success') {
    return response;
  }
  const record = response.data;
  if (!record || typeof record !== 'object') {
    return response;
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
  response.data = rec;

  return response;
}

export default getRecord;

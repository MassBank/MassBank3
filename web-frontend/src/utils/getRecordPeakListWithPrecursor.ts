import Record from '../types/record/Record';
import Peak from '../types/peak/Peak';

function getRecordPeakListWithPrecursor(record: Record): Peak[] {
  return record.peak.neutral_loss && record.peak.neutral_loss.length > 0
    ? record.peak.peak.values.concat({
        id: 'precursor',
        mz: record.peak.neutral_loss[0].precursor_mass,
        rel: 999,
      } as Peak)
    : record.peak.peak.values;
}

export default getRecordPeakListWithPrecursor;

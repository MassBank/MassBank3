import Peak from '../types/peak/Peak';
import generateID from './generateID';

function parsePeakListInputField(peakListInputFieldData: string) {
  const peakListValues: number[][] = peakListInputFieldData
    .split('\n')
    .map((line: string) => {
      const [mz, intensity] = line.split(' ');
      return [parseFloat(mz), parseFloat(intensity)];
    });
  const max = Math.max(...peakListValues.map((p) => p[1]));
  const peakList: Peak[] = peakListValues.map((values: number[]) => {
    const [mz, intensity] = values;
    const rel = Math.floor((intensity / max) * 1000) - 1;
    return {
      mz,
      intensity,
      rel: rel < 0 ? 0 : rel,
      id: generateID(),
    } as Peak;
  });

  return peakList;
}

export default parsePeakListInputField;

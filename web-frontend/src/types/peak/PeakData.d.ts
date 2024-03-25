import PeakAnnotation from './PeakAnnotation';
import PeakPeakData from './PeakPeakData';

export default interface PeakData {
  splash: string;
  numPeak: number;
  peak: PeakPeakData;
  annotation?: PeakAnnotation;
}

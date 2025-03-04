import NeutralLoss from './NeutralLoss';
import PeakAnnotation from './PeakAnnotation';
import PeakPeakData from './PeakPeakData';

export default interface PeakData {
  splash: string;
  numPeak: number;
  peak: PeakPeakData;
  neutral_loss: NeutralLoss[];
  annotation?: PeakAnnotation;
}

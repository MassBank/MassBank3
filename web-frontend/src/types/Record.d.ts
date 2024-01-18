import Acquisition from './Acquisition';
import Compound from './Compound';
import Date from './Date';
import MassSpectrometry from './MassSpectrometry';
import Subtag from './Subtag';
import PeakData from './peak/PeakData';

export default interface Record {
  accession: string;
  deprecated: {};
  title: string;
  date: Date;
  authors: [{ name: string }];
  publication: string;
  license: string;
  copyright: string;
  compound: Compound;
  species: {};
  acquisition: Acquisition;
  mass_spectrometry: MassSpectrometry;
  peak: PeakData;
  comments: Subtag[];
}

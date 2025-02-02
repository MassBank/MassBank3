import PeakData from '../peak/PeakData';
import Acquisition from './Acquisition';
import Compound from './Compound';
import Date from './Date';
import MassSpectrometry from './MassSpectrometry';
import Species from './Species';
import SubTag from './SubTag';

export default interface Record {
  accession: string;
  title: string;
  date: Date;
  authors: [{ name: string }];
  publication: string;
  license: string;
  copyright: string;
  compound: Compound;
  species: Species;
  acquisition: Acquisition;
  mass_spectrometry: MassSpectrometry;
  peak: PeakData;
  comments: SubTag[];
}

import PeakData from './peak/PeakData';

export default interface Record {
  accession: string;
  deprecated: {};
  title: string;
  date: {
    updated: string;
    created: string;
    modified: string;
  };
  authors: [{ name: string }];
  license: string;
  compound: {
    names: string;
    classes: string;
    formula: string;
    mass: number;
    smiles: string;
    inchi: string;
  };
  species: {};
  acquisition: {
    instrument: string;
    instrument_type: string;
    mass_spectrometry: {};
  };
  mass_spectrometry: {};
  peak: PeakData;
}

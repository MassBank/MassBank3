import Subtag from './SubTag';

export default interface Acquisition {
  instrument: string;
  instrument_type: string;
  chromatography: Subtag[];
  mass_spectrometry: {
    ion_mode: string;
    ms_type: string;
    subtags: Subtag[];
  };
}

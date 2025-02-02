import Link from './Link';

export default interface Compound {
  names: string[];
  classes: string[];
  formula: string;
  mass: number;
  smiles: string;
  inchi: string;
  link: Link[];
}

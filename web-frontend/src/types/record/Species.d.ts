import Link from './Link';

export default interface Species {
  name: string;
  lineage: string[];
  link: Link[];
  sample: string[];
}

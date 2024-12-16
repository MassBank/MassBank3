export default interface Hit {
  index: number;
  accession: string;
  score?: number;
  record?: Record;
}

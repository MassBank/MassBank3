import ResultTableSortOption from '../types/ResultTableSortOption';

const resultTableSortOptionValues: Partial<
  Record<ResultTableSortOption, string>
> = {
  accession: 'Accession',
  score: 'Score',
  atom_count: 'Atom Count',
};

export default resultTableSortOptionValues;

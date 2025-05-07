import Hit from '../types/Hit';
import ResultTableSortOption from '../types/ResultTableSortOption';

function sortHits(hits: Hit[], sortValue: ResultTableSortOption): Hit[] {
  const _hits = [...hits];
  _hits.sort((a, b) => {
    if (sortValue === 'score_asc') {
      return a.score !== undefined && b.score !== undefined
        ? a.score - b.score
        : 0;
    } else if (sortValue === 'accession') {
      return a.accession.localeCompare(b.accession, undefined, {
        sensitivity: 'variant',
      });
    } else if (sortValue === 'accession_desc') {
      return b.accession.localeCompare(a.accession, undefined, {
        sensitivity: 'variant',
      });
    } else if (sortValue === 'atom_count') {
      //   return a.record !== undefined && b.record !== undefined
      //     ? a.record.compound.atom_count - b.record.compound.atom_count
      //     : 0;
      return a.atomcount - b.atomcount;
    } else if (sortValue === 'atom_count_desc') {
      //   return b.record !== undefined && a.record !== undefined
      //     ? b.record.compound.atom_count - a.record.compound.atom_count
      //     : 0;
      return b.atomcount - a.atomcount;
    }

    return 0;
  });

  _hits.forEach((hit, i) => {
    hit.index = i;
  });

  return _hits;
}

export default sortHits;

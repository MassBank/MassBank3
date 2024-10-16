import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';
import './ResultTable.scss';

import { useMemo } from 'react';
import ResultTableRow from './ResultTableRow';

type InputProps = {
  reference?: Peak[];
  hits: Hit[];
  offset: number;
  // eslint-disable-next-line no-unused-vars
  onDoubleClick: (slideIndex: number) => void;
  rowHeight?: number;
};

function ResultTable({
  reference,
  hits,
  offset,
  onDoubleClick,
  rowHeight = 200,
}: InputProps) {
  const header = useMemo(() => {
    const hasScore = hits.some((hit) => hit.score !== undefined);
    return (
      <tr key={'result-table-header'}>
        <th>#</th>
        {hasScore && <th>Score</th>}
        <th>Accession</th>
        <th>Title</th>
        <th>Chart</th>
        <th>Structure</th>
      </tr>
    );
  }, [hits]);

  const body = useMemo(() => {
    const _body: JSX.Element[] = [];

    hits.forEach((hit, i) => {
      _body.push(
        <ResultTableRow
          key={'result-table-row_' + i + '_' + hit.score}
          reference={reference}
          hit={hit}
          label={offset + i + 1}
          height={rowHeight}
          chartWidth={500}
          imageWidth={rowHeight}
          onDoubleClick={() => onDoubleClick(i)}
        />,
      );
    });

    return _body;
  }, [hits, offset, onDoubleClick, reference, rowHeight]);

  return (
    <div className="result-table-container">
      <table>
        <thead>{header}</thead>
        <tbody>
          {body}
          <tr className="auto-height" />
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;

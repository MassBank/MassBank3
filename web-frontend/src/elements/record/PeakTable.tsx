import './PeakTable.scss';

import { useMemo } from 'react';
import PeakData from '../../types/PeakData';
import PeakTableRow from './PeakTableRow';

type InputProps = {
  pd: PeakData[];
  className?: string;
};

function PeakTable({ pd, className = 'PeakTable' }: InputProps) {
  const rows = useMemo(
    () => pd.map((r) => <PeakTableRow rowData={r} key={r.id} />),
    [pd],
  );

  return (
    <div className={className}>
      <table>
        <thead>
          <tr>
            <th>m/z</th>
            <th>Intensity</th>
            <th>Relative Intensity</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default PeakTable;

import './PeakTable.scss';

import { useMemo } from 'react';
import PeakData from '../../types/PeakData';
import PeakTableRow from './PeakTableRow';

type InputProps = {
  pd: PeakData[];
};

function PeakTable({ pd }: InputProps) {
  const rows = useMemo(
    () => pd.map((r) => <PeakTableRow rowData={r} key={r.id} />),
    [pd],
  );

  return (
    <div className="PeakTable">
      <table>
        <thead>
          <tr>
            <th>m/z</th>
            <th>Intensity</th>
            <th>Relative Intensity</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr className="auto-height"></tr>
        </tbody>
      </table>
    </div>
  );
}

export default PeakTable;

import './PeakTable.scss';

import { useMemo } from 'react';
import PeakTableRow from './PeakTableRow';
import Peak from '../../types/peak/Peak';

type InputProps = {
  pd: Peak[];
  width: number;
  height: number;
};

function PeakTable({ pd, width, height }: InputProps) {
  const rows = useMemo(
    () => pd.map((p) => <PeakTableRow peak={p} key={p.id} />),
    [pd],
  );

  return (
    <div className="PeakTable" style={{ width, height }}>
      <table>
        <thead>
          <tr>
            <th>m/z</th>
            <th>Intensity</th>
            <th>Rel. Intensity</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr className="auto-height" />
        </tbody>
      </table>
    </div>
  );
}

export default PeakTable;

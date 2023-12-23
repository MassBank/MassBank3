import './PeakTable.scss';

import { useMemo } from 'react';
import PeakData from '../../types/PeakData';

type InputProps = {
  pd: PeakData[];
  className?: string;
};

function PeakTable({ pd, className = 'PeakTable' }: InputProps) {
  const rows = useMemo(
    () =>
      pd.map((r) => (
        <tr key={'peakTableRow' + r.mz}>
          <td>{r.mz}</td>
          <td>{r.intensity.toFixed(2)}</td>
          <td>{r.rel}</td>
        </tr>
      )),
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

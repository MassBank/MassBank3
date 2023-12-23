import { MouseEvent, useCallback, useMemo } from 'react';
import { useHighlight } from '../../highlight';
import PeakData from '../../types/PeakData';

type InputProps = {
  rowData: PeakData;
};

function PeakTableRow({ rowData }: InputProps) {
  const highlightRow = useHighlight([rowData.id]);

  const handleOnMouseEnter = useCallback(
    (e: MouseEvent<HTMLTableRowElement>) => {
      e.preventDefault();
      e.stopPropagation();

      highlightRow.show();
    },
    [highlightRow],
  );

  const handleOnMouseLeave = useCallback(
    (e: MouseEvent<HTMLTableRowElement>) => {
      e.preventDefault();
      e.stopPropagation();

      highlightRow.hide();
    },
    [highlightRow],
  );

  const row = useMemo(
    () => (
      <tr
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        style={{
          backgroundColor: highlightRow.isActive ? 'lightblue' : 'transparent',
        }}
      >
        <td>{rowData.mz}</td>
        <td>{rowData.intensity.toFixed(2)}</td>
        <td>{rowData.rel}</td>
      </tr>
    ),
    [
      handleOnMouseEnter,
      handleOnMouseLeave,
      highlightRow.isActive,
      rowData.intensity,
      rowData.mz,
      rowData.rel,
    ],
  );

  return row;
}

export default PeakTableRow;

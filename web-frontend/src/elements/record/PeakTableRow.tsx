import { MouseEvent, useCallback, useMemo } from 'react';
import { useHighlight } from '../../highlight/Index';
import Peak from '../../types/peak/Peak';

type InputProps = {
  peak: Peak;
};

function PeakTableRow({ peak }: InputProps) {
  const highlightRow = useHighlight([peak.id]);

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
        <td>{peak.mz.toFixed(4)}</td>
        <td>{peak.intensity.toFixed(1)}</td>
        <td>{peak.rel || 0}</td>
      </tr>
    ),
    [
      handleOnMouseEnter,
      handleOnMouseLeave,
      highlightRow.isActive,
      peak.intensity,
      peak.mz,
      peak.rel,
    ],
  );

  return row;
}

export default PeakTableRow;

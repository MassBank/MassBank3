import './AnnotationTable.scss';

import { useMemo } from 'react';
import PeakAnnotation from '../../types/peak/PeakAnnotation';

type InputProps = {
  annotation: PeakAnnotation;
  width?: number | string;
  height?: number | string;
};

function AnnotationTable({
  annotation,
  width = '100%',
  height = 400,
}: InputProps) {
  const annotationTable = useMemo(() => {
    const numHeaders = annotation.header.length;
    const numPeaks = annotation.values[0].length;

    const headerContent = (
      <tr key={'anno-header'}>
        {annotation.header.map((h) => (
          <th key={'anno-header-' + h}>{h.split('_').join(' ')}</th>
        ))}
      </tr>
    );

    const bodyContent: JSX.Element[] = [];
    for (let i = 0; i < numPeaks; i++) {
      const rows: JSX.Element[] = [];
      for (let h = 0; h < numHeaders; h++) {
        rows.push(
          <td key={'anno-row-' + i + '-' + h}>{annotation.values[h][i]}</td>,
        );
      }
      bodyContent.push(<tr key={'anno-row-' + i}>{rows}</tr>);
    }

    return (
      <table>
        <thead>{headerContent}</thead>
        <tbody>
          {bodyContent}
          <tr className="auto-height" />
        </tbody>
      </table>
    );
  }, [annotation]);

  return (
    <div className="annotation-table" style={{ width, height }}>
      {annotationTable}
    </div>
  );
}

export default AnnotationTable;

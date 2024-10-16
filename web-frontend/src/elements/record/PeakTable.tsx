import './PeakTable.scss';

import { CSSProperties, useMemo } from 'react';
import PeakTableRow from './PeakTableRow';
import Peak from '../../types/peak/Peak';
import { splitStringAndCapitaliseFirstLetter } from '../../utils/stringUtils';
import LinkedPeakAnnotation from '../../types/peak/LinkedPeakAnnotation';
import PeakAnnotation from '../../types/peak/PeakAnnotation';

type InputProps = {
  peaks: Peak[];
  annotations?: PeakAnnotation;
  linkedAnnotations?: LinkedPeakAnnotation[];
  style?: CSSProperties;
  tableStyle?: CSSProperties;
};

function PeakTable({
  peaks,
  annotations,
  linkedAnnotations,
  style,
  tableStyle,
}: InputProps) {
  const rows = useMemo(
    () =>
      peaks.map((p, i) => {
        if (
          annotations &&
          annotations.header &&
          annotations.header.length > 0 &&
          linkedAnnotations &&
          linkedAnnotations.length > 0
        ) {
          const annoRowIndex = linkedAnnotations[i].annotationIndex;
          const annotation: string[] = [];
          annotations.values.forEach((anno, k) => {
            if (annotations.header[k] !== 'm/z') {
              annotation.push(anno[annoRowIndex]);
            }
          });
          return <PeakTableRow peak={p} annotation={annotation} key={p.id} />;
        }
        return <PeakTableRow peak={p} annotation={undefined} key={p.id} />;
      }),
    [annotations, linkedAnnotations, peaks],
  );

  return (
    <div className="peak-table" style={style}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>m/z</th>
            <th>Intensity</th>
            <th>Relative Intensity</th>
            {annotations &&
              annotations.header &&
              annotations.header.length > 0 &&
              annotations.header.map(
                (h) =>
                  h !== 'm/z' && (
                    <th key={'anno-header-' + h}>
                      {splitStringAndCapitaliseFirstLetter(h, '_', ' ')}
                    </th>
                  ),
              )}
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

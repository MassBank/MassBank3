import './ResultTableRow.scss';

import { MouseEvent, useCallback, useMemo } from 'react';

import ResultLink from './ResultLink';
import Peak from '../../types/peak/Peak';
import Hit from '../../types/Hit';
import Chart from '../basic/Chart';
import StructureView from '../basic/StructureView';

type InputProps = {
  label: string | number;
  reference?: Peak[];
  hit: Hit;
  height: number;
  chartWidth: number;
  imageWidth: number;
  onDoubleClick: () => void;
};

function ResultTableRow({
  label,
  reference,
  hit,
  height,
  chartWidth,
  imageWidth,
  onDoubleClick,
}: InputProps) {
  const handleOnDoubleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onDoubleClick();
    },
    [onDoubleClick],
  );

  const row = useMemo(() => {
    return (
      <tr
        key={`resultCard_${label}`}
        className="result-table-row-container"
        style={{ height }}
        onDoubleClick={handleOnDoubleClick}
      >
        <td>{label}</td>
        {hit.score && (
          <td title={`Score: ${hit.score}`} className="score-col">
            {hit.score.toFixed(4)}
          </td>
        )}
        <td className="accession-link-view" style={{ height }}>
          <label>{hit.accession}</label>
          <ResultLink hit={hit} />
        </td>
        <td>{hit.record.title}</td>
        <td
          style={{
            width: chartWidth,
          }}
        >
          {reference && reference.length > 0 ? (
            <Chart
              peakData={reference}
              peakData2={
                (hit.record ? hit.record.peak.peak.values : []) as Peak[]
              }
              width={chartWidth}
              height={height}
              disableZoom
              disableLabels
              disableOnHover
            />
          ) : (
            <Chart
              peakData={
                (hit.record ? hit.record.peak.peak.values : []) as Peak[]
              }
              width={chartWidth}
              height={height}
              disableZoom
              disableLabels
              disableOnHover
            />
          )}
        </td>
        <td
          style={{
            width: imageWidth,
          }}
        >
          <StructureView
            smiles={hit.record.compound.smiles}
            imageWidth={imageWidth}
            // imageHeight={height}
          />
        </td>
      </tr>
    );
  }, [
    chartWidth,
    handleOnDoubleClick,
    height,
    hit,
    imageWidth,
    label,
    reference,
  ]);

  return row;
}

export default ResultTableRow;

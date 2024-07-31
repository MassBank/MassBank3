import './ResultCard.scss';

import { CSSProperties, MouseEvent, useCallback, useMemo } from 'react';
import Hit from '../../../../../types/Hit';
import ResultInfo from './ResultInfo';

type InputProps = {
  label: string | number;
  // reference: Peak[];
  hit: Hit;
  // chartWidth: number;
  // chartHeight: number;
  imageWidth: number;
  imageHeight: number;
  onDoubleClick?: () => void;
  style?: CSSProperties;
};

function ResultCard({
  label,
  // reference,
  hit,
  // chartWidth,
  // chartHeight,
  imageWidth,
  imageHeight,
  onDoubleClick = () => {},
  style = {},
}: InputProps) {
  const cardHeader = useMemo(
    () => (
      <div className="card-header">
        <b>{`#${label}`}</b>
      </div>
    ),
    [label],
  );

  const cardBody = useMemo(
    () => (
      <div className="card-body">
        {/* <div className="chart-and-structure-preview-container">
          <Chart
            peakData={reference}
            peakData2={
              (hit.record ? hit.record.peak.peak.values : []) as Peak[]
            }
            width={chartWidth}
            height={chartHeight}
            disableZoom
            disableLabels
            disableOnHover
          />
          {hit.record &&
          hit.record.compound.smiles &&
          hit.record.compound.smiles !== '' ? (
            <StructureView
              smiles={hit.record.compound.smiles}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
            />
          ) : undefined}
        </div>
        <ResultLink hit={hit} /> */}
        <ResultInfo
          hit={hit}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          style={{
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            minHeight: style.minHeight,
            maxHeight: style.maxHeight,
            // backgroundColor: 'lightyellow',
          }}
        />
      </div>
    ),
    [hit, imageHeight, imageWidth, style],
  );

  const handleOnDoubleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      onDoubleClick();
    },
    [onDoubleClick],
  );

  return (
    <div
      className="result-card-container"
      style={style}
      onDoubleClick={handleOnDoubleClick}
    >
      {cardHeader}
      {cardBody}
    </div>
  );
}

export default ResultCard;

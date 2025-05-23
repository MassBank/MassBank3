import './ChartElement.scss';

import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ScaleLinear } from 'd3';
import Peak from '../../types/peak/Peak';
import { useHighlightData } from '../../context/highlight/useHighlightData';
import useHighlight from '../../context/highlight/Highlight';

type InputProps = {
  pd: Peak;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  showLabel?: boolean;
  strokeColour?: string;
  disableOnHover?: boolean;
};

function ChartElement({
  pd,
  xScale,
  yScale,
  showLabel = false,
  strokeColour,
  disableOnHover = false,
}: InputProps) {
  const highlight = useHighlight([pd.id]);
  const highlightData = useHighlightData();

  const [disableShowLabel, setDisableShowLabel] = useState<boolean>(false);

  useEffect(() => {
    const highlighted = highlightData.highlight.highlighted;

    if (highlighted.size > 0 && !highlighted.has(pd.id)) {
      setDisableShowLabel(true);
    } else {
      setDisableShowLabel(false);
    }
  }, [highlightData.highlight.highlighted, pd.id]);

  const xScaled = xScale(pd.mz);

  const handleOnMouseEnter = useCallback(
    (e: MouseEvent<SVGGElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!disableOnHover) {
        highlight.show();
      }
    },
    [disableOnHover, highlight],
  );

  const handleOnMouseLeave = useCallback(
    (e: MouseEvent<SVGGElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!disableOnHover) {
        highlight.hide();
      }
    },
    [disableOnHover, highlight],
  );

  const chartElement = useMemo(
    () => (
      <g
        key={'data-point-' + xScaled}
        className="entry"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        style={
          highlight.isActive
            ? { opacity: 1, stroke: 'black', strokeWidth: 2 }
            : {
                stroke: strokeColour
                  ? strokeColour
                  : pd.id === 'precursor'
                    ? 'blue'
                    : 'red',
              }
        }
      >
        <line
          x1={xScaled}
          x2={xScaled}
          y1={yScale.range()[0]}
          y2={yScale(pd.rel ?? 0)}
        />
        {highlight.isActive && (
          <circle cx={xScaled} cy={yScale(pd.rel ?? 0)} r={3} />
        )}
        {pd.id === 'precursor' ? (
          <text
            className="hover-label"
            transform={`translate(${xScale(pd.mz) - 50} ${
              pd.rel < 0 ? yScale(pd.rel ?? 0) + 20 : yScale(pd.rel ?? 0) - 10
            })`}
          >
            {'precursor: ' + pd.mz.toFixed(4)}
          </text>
        ) : (
          ((!disableShowLabel && showLabel) || highlight.isActive) && (
            <text
              className="hover-label"
              transform={`translate(${xScale(pd.mz)} ${
                pd.rel < 0 ? yScale(pd.rel ?? 0) + 20 : yScale(pd.rel ?? 0) - 10
              }) rotate(-30)`}
            >
              {pd.mz.toFixed(4)}
            </text>
          )
        )}
      </g>
    ),

    [
      disableShowLabel,
      handleOnMouseEnter,
      handleOnMouseLeave,
      highlight.isActive,
      pd.id,
      pd.mz,
      pd.rel,
      showLabel,
      strokeColour,
      xScale,
      xScaled,
      yScale,
    ],
  );

  return chartElement;
}

export default ChartElement;

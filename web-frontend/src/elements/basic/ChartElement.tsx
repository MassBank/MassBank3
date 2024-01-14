import './ChartElement.scss';

import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ScaleLinear } from 'd3';
import { useHighlight, useHighlightData } from '../../highlight/Index';
import Peak from '../../types/peak/Peak';

type InputProps = {
  pd: Peak;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  showLabel: boolean;
};

function ChartElement({ pd, xScale, yScale, showLabel }: InputProps) {
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
  }, [disableShowLabel, highlightData.highlight.highlighted, pd.id]);

  const xScaled = xScale(pd.mz);

  const handleOnMouseEnter = useCallback(
    (e: MouseEvent<SVGGElement>) => {
      e.preventDefault();
      e.stopPropagation();

      highlight.show();
    },
    [highlight],
  );

  const handleOnMouseLeave = useCallback(
    (e: MouseEvent<SVGGElement>) => {
      e.preventDefault();
      e.stopPropagation();

      highlight.hide();
    },
    [highlight],
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
            : {}
        }
      >
        <line
          x1={xScaled}
          x2={xScaled}
          y1={yScale.range()[0]}
          y2={yScale(pd.rel || 0)}
        />
        {highlight.isActive && (
          <circle cx={xScaled} cy={yScale(pd.rel || 0)} r={3} />
        )}
        {((!disableShowLabel && showLabel) || highlight.isActive) && (
          <text
            className="hover-label"
            transform={`translate(${xScale(pd.mz)} ${
              yScale(pd.rel || 0) - 10
            }) rotate(-30)`}
          >
            {pd.mz.toFixed(4)}
          </text>
        )}
      </g>
    ),

    [
      disableShowLabel,
      handleOnMouseEnter,
      handleOnMouseLeave,
      highlight.isActive,
      pd.mz,
      pd.rel,
      showLabel,
      xScale,
      xScaled,
      yScale,
    ],
  );

  return chartElement;
}

export default ChartElement;

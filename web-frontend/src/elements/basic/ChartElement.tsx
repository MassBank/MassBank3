import './ChartElement.scss';

import { MouseEvent, useCallback, useMemo } from 'react';
import PeakData from '../../types/PeakData';
import { ScaleLinear } from 'd3';
import { useHighlight } from '../../highlight/Index';

type InputProps = {
  pd: PeakData;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
};

function ChartElement({ pd, xScale, yScale }: InputProps) {
  const highlight = useHighlight([pd.id]);

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
            ? { opacity: 1, stroke: 'blue', strokeWidth: 1.5 }
            : {}
        }
      >
        <line
          x1={xScaled}
          x2={xScaled}
          y1={yScale.range()[0]}
          y2={yScale(pd.rel)}
        />
        {highlight.isActive && (
          <circle cx={xScaled} cy={yScale(pd.rel)} r={3} />
        )}
        {highlight.isActive && (
          <text
            className="hover-label"
            x={xScale(pd.mz)}
            y={yScale(pd.rel) - 20}
          >
            <tspan x={xScale(pd.mz)} y={yScale(pd.rel) - 30}>
              {'mz: ' + pd.mz}
            </tspan>
            <tspan x={xScale(pd.mz)} y={yScale(pd.rel) - 10}>
              {'intensity: ' + pd.intensity.toFixed(2)}
            </tspan>
          </text>
        )}
        {highlight.isActive && (
          <line
            x1={xScale.range()[0]}
            y1={yScale(pd.rel)}
            y2={yScale(pd.rel)}
            x2={xScale.range()[xScale.range().length - 1]}
            stroke="grey"
            strokeOpacity={0.5}
            strokeDasharray={5}
          />
        )}
      </g>
    ),

    [
      handleOnMouseEnter,
      handleOnMouseLeave,
      highlight.isActive,
      pd.intensity,
      pd.mz,
      pd.rel,
      xScale,
      xScaled,
      yScale,
    ],
  );

  return pd.rel > 0 && chartElement;
}

export default ChartElement;

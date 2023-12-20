import './ChartElement.scss';

import { MouseEvent, useCallback, useState } from 'react';
import PeakData from '../../types/PeakData';
import { ScaleBand, ScaleLinear } from 'd3';

type InputProps = {
  pd: PeakData;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number, never>;
};

function ChartElement({ pd, xScale, yScale }: InputProps) {
  const [isOnHover, setIsOnHover] = useState<boolean>(false);

  const xScaled = xScale(String(pd.mz));

  const handleOnMouseEnter = useCallback((e: MouseEvent<SVGGElement>) => {
    e.preventDefault();
    setIsOnHover(true);
  }, []);

  const handleOnMouseLeave = useCallback((e: MouseEvent<SVGGElement>) => {
    e.preventDefault();
    setIsOnHover(false);
  }, []);

  return (
    pd.relIntensity > 0 && (
      <g
        key={'data-point-' + xScaled}
        className="entry"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <line
          x1={xScaled}
          x2={xScaled}
          y1={yScale.range()[0]}
          y2={yScale(pd.relIntensity)}
        />
        {/* <circle cx={xScaled} cy={yScale(d.relIntensity)} r={3} /> */}
        {isOnHover && (
          <text
            className="hover-label"
            x={xScale(String(pd.mz))}
            y={yScale(pd.relIntensity) - 20}
          >
            <tspan x={xScale(String(pd.mz))} y={yScale(pd.relIntensity) - 40}>
              {'mz: ' + pd.mz}
            </tspan>
            <tspan x={xScale(String(pd.mz))} y={yScale(pd.relIntensity) - 20}>
              {'intensity: ' + pd.intensity.toFixed(2)}
            </tspan>
          </text>
        )}
        {/* {isOnHover && (
          <line
            x1={xScale.range()[0]}
            y1={yScale(pd.relIntensity)}
            y2={yScale(pd.relIntensity)}
            x2={xScale.range()[xScale.range().length - 1]}
            stroke="grey"
            strokeOpacity={0.5}
            strokeDasharray={5}
          />
        )} */}
      </g>
    )
  );
}

export default ChartElement;

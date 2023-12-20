import { useMemo, useRef } from 'react';
import { scaleBand, scaleLinear } from 'd3';
import PeakData from '../../types/PeakData';
import ChartElement from './ChartElement';

const MARGIN = { top: 60, right: 50, bottom: 60, left: 70 };

type InputProps = {
  peakData: PeakData[];
  width?: number;
  height?: number;
  className?: string;
};

function Chart({
  peakData,
  width = 400,
  height = 300,
  className = 'Chart',
}: InputProps) {
  const ref = useRef(null);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const integerRangeX = useMemo(() => {
    const minX = 0;
    const maxX = Math.ceil(Math.max(...peakData.map((d) => d.mz))) + 30;

    const range: number[] = [];
    for (let i = minX; i <= maxX; i++) {
      range.push(i);
    }

    return range;
  }, [peakData]);

  const integerRangeY = useMemo(() => {
    const minY = 0;
    const maxY = 1000; //Math.ceil(Math.max(...data.map((d) => d.relIntensity))) + 50;

    const range: number[] = [];
    for (let i = minY; i <= maxY; i++) {
      range.push(i);
    }

    return range;
  }, []);

  const xScale = useMemo(() => {
    const groups = peakData
      .map((d) => d.mz)
      .concat(integerRangeX)
      .sort((a, b) => a - b)
      .map((d) => String(d));

    return scaleBand().domain(groups).range([0, boundsWidth]);
  }, [boundsWidth, peakData, integerRangeX]);

  const yScale = useMemo(() => {
    const maxY = Math.max(...integerRangeY);

    return scaleLinear().domain([0, maxY]).range([boundsHeight, 0]);
  }, [boundsHeight, integerRangeY]);

  const xLabels = useMemo(
    () =>
      integerRangeX.map(
        (x) =>
          x % 50 === 0 && (
            <g key={'x_axis_label' + x}>
              <text
                x={xScale(String(x))}
                y={yScale.range()[0] + 20}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={15}
              >
                {x}
              </text>
              <line
                x1={xScale(String(x))}
                x2={xScale(String(x))}
                y1={yScale.range()[0]}
                y2={yScale.range()[0] + 10}
                stroke="black"
              />
            </g>
          ),
      ),
    [integerRangeX, xScale, yScale],
  );

  const xAxis = useMemo(() => {
    return (
      <g>
        <line
          x1={xScale.range()[0]}
          x2={xScale.range()[1]}
          y1={yScale.range()[0]}
          y2={yScale.range()[0]}
          stroke="black"
        />
        <text
          x={(xScale.range()[1] - xScale.range()[0]) / 2}
          y={yScale.range()[0] + 50}
        >
          m/z
        </text>
      </g>
    );
  }, [xScale, yScale]);

  const yAxis = useMemo(() => {
    return (
      <g>
        <line
          x1={xScale.range()[0]}
          x2={xScale.range()[0]}
          y1={yScale.range()[0]}
          y2={yScale.range()[1]}
          stroke="black"
        />
        <text
          x={xScale.range()[0] - 60}
          y={(yScale.range()[0] - yScale.range()[1]) / 2}
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(270, ${xScale.range()[0] - 60}, ${
            (yScale.range()[0] - yScale.range()[1]) / 2
          })`}
        >
          Abundance
        </text>
      </g>
    );
  }, [xScale, yScale]);

  const yLabels = useMemo(
    () =>
      integerRangeY.map(
        (y) =>
          y % 200 === 0 && (
            <g key={'x_axis_label' + y}>
              <text
                x={xScale.range()[0] - 30}
                y={yScale(y)}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={15}
              >
                {y}
              </text>
              <line
                x1={xScale('0')}
                x2={Number(xScale('0')) - 10}
                y1={yScale(y)}
                y2={yScale(y)}
                stroke="black"
              />
            </g>
          ),
      ),
    [integerRangeY, xScale, yScale],
  );

  const allShapes = useMemo(
    () =>
      peakData.map((d) => (
        <ChartElement
          key={'chart_element' + d.mz}
          pd={d}
          xScale={xScale}
          yScale={yScale}
        />
      )),
    [peakData, xScale, yScale],
  );

  return (
    <div ref={ref} className={className}>
      <svg width={width} height={height}>
        <g
          // className="entryContainer"
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {allShapes}
          {xAxis}
          {xLabels}
          {yAxis}
          {yLabels}
        </g>
      </svg>
    </div>
  );
}

export default Chart;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { brushX, scaleBand, scaleLinear, select } from 'd3';
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
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [brushXDomain, setBrushXDomain] = useState<
    { min: number; max: number } | undefined
  >();

  const filteredPeakData = useMemo(() => {
    let _peakData = peakData;
    if (brushXDomain)
      _peakData = peakData.filter(
        (pd) => pd.mz >= brushXDomain.min && pd.mz <= brushXDomain.max,
      );

    return _peakData;
  }, [brushXDomain, peakData]);

  const integerRangeX = useMemo(() => {
    const m = filteredPeakData.length <= 3 ? 2 : 10;
    const minX = Math.floor(Math.min(...filteredPeakData.map((d) => d.mz))) - m;
    const maxX = Math.ceil(Math.max(...filteredPeakData.map((d) => d.mz))) + m;

    const range: number[] = [];
    for (let i = minX; i <= maxX; i++) {
      range.push(i);
    }

    return range;
  }, [filteredPeakData]);

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
    const groups = filteredPeakData
      .map((pd) => pd.mz)
      .concat(integerRangeX)
      .sort((a, b) => a - b)
      .map((d) => String(d));

    return scaleBand().domain(groups).range([0, boundsWidth]);
  }, [filteredPeakData, integerRangeX, boundsWidth]);

  const yScale = useMemo(() => {
    const maxY = Math.max(...integerRangeY);

    return scaleLinear().domain([0, maxY]).range([boundsHeight, 0]);
  }, [boundsHeight, integerRangeY]);

  const xLabels = useMemo(() => {
    const steps = Math.floor(integerRangeX.length / 5);

    return integerRangeX.map(
      (x) =>
        x % steps === 0 && (
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
    );
  }, [integerRangeX, xScale, yScale]);

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
          Relative Abundance
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
                x1={xScale.range()[0]}
                x2={xScale.range()[0] - 10}
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
      filteredPeakData.map((d) => (
        <ChartElement
          key={'chart_element' + d.mz}
          pd={d}
          xScale={xScale}
          yScale={yScale}
        />
      )),
    [filteredPeakData, xScale, yScale],
  );

  const invertScaleBand = useCallback(
    (value: number) => {
      const domain = xScale.domain();
      const paddingOuter = Number(xScale(domain[0]));
      const eachBand = xScale.step();

      const index = Math.floor((value - paddingOuter) / eachBand);
      return domain[Math.max(0, Math.min(index, domain.length - 1))];
    },
    [xScale],
  );

  useEffect(() => {
    const svg = select(svgRef.current);
    const brush = brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('end', (e) => {
        if (e.selection) {
          const inverted: number[] = e.selection.map(invertScaleBand);
          setBrushXDomain({ min: inverted[0], max: inverted[1] });
        }
      });

    svg.select('.brush').call(brush).call(brush.move, undefined);
    svg.on('dblclick', () => setBrushXDomain(undefined));
  }, [height, invertScaleBand, width]);

  return (
    <div ref={wrapperRef} className={className}>
      <svg ref={svgRef} width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {<g className="brush" />}
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

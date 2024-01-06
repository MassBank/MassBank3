import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { brushX, scaleLinear, select } from 'd3';
import PeakData from '../../types/PeakData';
import ChartElement from './ChartElement';
import Button from './Button';

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

  const [isShowLabel, setIsShowLabel] = useState<boolean>(false);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [brushXDomains, setBrushXDomains] = useState<
    { min: number; max: number }[] | undefined
  >();

  const filteredPeakData = useMemo(() => {
    let _peakData = peakData;
    if (brushXDomains) {
      _peakData = peakData.filter(
        (pd) =>
          pd.mz >= brushXDomains[brushXDomains.length - 1].min &&
          pd.mz <= brushXDomains[brushXDomains.length - 1].max,
      );
    }

    return _peakData;
  }, [brushXDomains, peakData]);

  const xScale = useMemo(() => {
    const values = filteredPeakData.map((pd) => pd.mz);
    const minX =
      brushXDomains && brushXDomains.length > 0
        ? brushXDomains[brushXDomains.length - 1].min
        : Math.min(...values);
    const maxX =
      brushXDomains && brushXDomains.length > 0
        ? brushXDomains[brushXDomains.length - 1].max
        : Math.max(...values);

    return scaleLinear().domain([minX, maxX]).range([0, boundsWidth]);
  }, [boundsWidth, brushXDomains, filteredPeakData]);

  const yScale = useMemo(() => {
    const maxY = 1000;

    return scaleLinear().domain([0, maxY]).range([boundsHeight, 0]);
  }, [boundsHeight]);

  const xLabels = useMemo(() => {
    const min = xScale.domain()[0];
    const max = xScale.domain()[1];

    const r = Math.abs(min - max);
    const steps = 5;
    const range: number[] = [];

    const stepSize = r / steps;
    range.push(min - stepSize);
    for (let i = 0; i <= steps; i++) {
      range.push(min + i * stepSize);
    }
    range.push(max + stepSize);

    return range.map((x) => (
      <g key={'x_axis_label' + x}>
        <text
          x={xScale(x)}
          y={yScale.range()[0] + 20}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={15}
        >
          {x.toFixed(4)}
        </text>
        <line
          x1={xScale(x)}
          x2={xScale(x)}
          y1={yScale.range()[0]}
          y2={yScale.range()[0] + 10}
          stroke="black"
        />
      </g>
    ));
  }, [xScale, yScale]);

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

  const yLabels = useMemo(() => {
    const min = Math.floor(Math.min(...yScale.domain()));
    const max = Math.ceil(Math.max(...yScale.domain()));
    const range: number[] = [];
    for (let i = min; i <= max; i++) {
      range.push(i);
    }

    return range.map(
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
    );
  }, [xScale, yScale]);

  const chartElements = useMemo(
    () =>
      filteredPeakData.map((d) => (
        <ChartElement
          key={'chart_element' + d.mz}
          pd={d}
          xScale={xScale}
          yScale={yScale}
          showLabel={isShowLabel}
        />
      )),
    [filteredPeakData, isShowLabel, xScale, yScale],
  );

  const handleDoubleClick = useCallback(() => {
    const _brushXDomains = brushXDomains ? [...brushXDomains] : undefined;
    if (_brushXDomains && _brushXDomains.length > 0) {
      _brushXDomains.pop();
      if (_brushXDomains.length > 0) {
        setBrushXDomains(_brushXDomains);
      } else {
        setBrushXDomains(undefined);
      }
    } else {
      setBrushXDomains(undefined);
    }
  }, [brushXDomains]);

  useEffect(() => {
    const svg = select(svgRef.current);
    const brush = brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('end', (e) => {
        if (e.selection) {
          const inverted: number[] = e.selection.map((x) => xScale.invert(x));
          const newBrushXDomains = brushXDomains
            ? [...brushXDomains].concat({ min: inverted[0], max: inverted[1] })
            : [{ min: inverted[0], max: inverted[1] }];

          setBrushXDomains(newBrushXDomains);
        }
      });

    svg.select('.brush').call(brush).call(brush.move, undefined);
    svg.on('dblclick', handleDoubleClick);
  }, [brushXDomains, handleDoubleClick, height, width, xScale]);

  return (
    <div ref={wrapperRef} className={className}>
      <svg ref={svgRef} width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {<g className="brush" />}
          {chartElements}
          {xAxis}
          {xLabels}
          {yAxis}
          {yLabels}
        </g>
      </svg>
      <Button
        child={isShowLabel ? 'Hide Labels' : 'Show Labels'}
        onClick={() => setIsShowLabel(!isShowLabel)}
        buttonStyle={{
          border: 'black solid 1px',
          padding: '3px',
        }}
      />
    </div>
  );
}

export default Chart;

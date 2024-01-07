import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { brushX, scaleLinear, select } from 'd3';
import PeakData from '../../types/PeakData';
import ChartElement from './ChartElement';
import Button from './Button';

const MARGIN = { top: 60, right: 50, bottom: 60, left: 70 };

type InputProps = {
  peakData: PeakData[];
  // eslint-disable-next-line no-unused-vars
  onZoom: (fpd: PeakData[]) => void;
  width?: number;
  height?: number;
  className?: string;
};

function Chart({
  peakData,
  onZoom,
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

  useEffect(() => {
    onZoom(filteredPeakData);
  }, [filteredPeakData, onZoom]);

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

    const m = Math.abs(minX - maxX) / 10;

    return scaleLinear()
      .domain([minX - m, maxX + m])
      .range([0, boundsWidth]);
  }, [boundsWidth, brushXDomains, filteredPeakData]);

  const yScale = useMemo(() => {
    const maxY = 1000;

    return scaleLinear().domain([0, maxY]).range([boundsHeight, 0]);
  }, [boundsHeight]);

  function buildLabelValues(minX: number, maxX: number, stepSize: number) {
    const labelValues: number[] = [];
    let minValue = Math.floor(minX / stepSize) * stepSize;
    if (minValue < minX) {
      minValue += stepSize;
    }
    let maxValue = Math.ceil(maxX / stepSize) * stepSize;
    if (maxValue > maxX) {
      maxValue -= stepSize;
    }
    for (let i = 0; minValue + i * stepSize <= maxValue; i++) {
      labelValues.push(minValue + i * stepSize);
    }

    return labelValues;
  }

  const xLabels = useMemo(() => {
    const minX = xScale.domain()[0];
    const maxX = xScale.domain()[1];

    const range = Math.abs(minX - maxX);
    let labelValues: number[] = [];
    let precision;

    if (range > 200) {
      const stepSize = 50;
      labelValues = buildLabelValues(minX, maxX, stepSize);
      precision = 0;
    } else if (range >= 100) {
      const stepSize = 20;
      labelValues = buildLabelValues(minX, maxX, stepSize);
      precision = 0;
    } else if (range >= 50) {
      const stepSize = 10;
      labelValues = buildLabelValues(minX, maxX, stepSize);
      precision = 0;
    } else if (range >= 25) {
      const stepSize = 5;
      labelValues = buildLabelValues(minX, maxX, stepSize);
      precision = 0;
    } else if (range >= 10) {
      const stepSize = 2;
      labelValues = buildLabelValues(minX, maxX, stepSize);
      precision = 0;
    } else if (range >= 5) {
      const stepSize = 1;
      labelValues = buildLabelValues(minX, maxX, stepSize);
      precision = 0;
    } else if (range >= 1) {
      const stepSize = 0.5;
      labelValues = buildLabelValues(minX, maxX, stepSize);
      precision = 1;
    } else {
      const steps = 5;
      const stepSize = range / steps;
      labelValues = buildLabelValues(minX, maxX, stepSize);
      precision = 4;
    }

    return labelValues.map((x) => (
      <g key={'x_axis_label' + x}>
        <text
          x={xScale(x)}
          y={yScale.range()[0] + 20}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={15}
        >
          {x.toFixed(precision)}
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
    const minY = Math.floor(Math.min(...yScale.domain()));
    const maxY = Math.ceil(Math.max(...yScale.domain()));
    const range: number[] = [];
    for (let i = minY; i <= maxY; i++) {
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

    // @ts-ignore
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

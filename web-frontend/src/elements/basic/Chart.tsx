import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { brushX, scaleLinear, select } from 'd3';
import ChartElement from './ChartElement';
import Button from './Button';
import Peak from '../../types/peak/Peak';

const MARGIN = { top: 55, right: 30, bottom: 50, left: 70, button: 35 };

type InputProps = {
  peakData: Peak[];
  peakData2?: Peak[];
  // eslint-disable-next-line no-unused-vars
  onZoom: (fpd: Peak[]) => void;
  width?: number;
  height?: number;
};

function Chart({
  peakData,
  peakData2,
  onZoom,
  width = 400,
  height = 300,
}: InputProps) {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);

  const [isShowLabel, setIsShowLabel] = useState<boolean>(false);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom - MARGIN.button;

  const [brushXDomains, setBrushXDomains] = useState<
    { min: number; max: number }[] | undefined
  >();

  const getFilteredPeakData = useCallback(
    (peakDataTemp: Peak[]) => {
      let _peakData = peakDataTemp;
      if (brushXDomains) {
        _peakData = peakDataTemp.filter(
          (pd) =>
            pd.mz >= brushXDomains[brushXDomains.length - 1].min &&
            pd.mz <= brushXDomains[brushXDomains.length - 1].max,
        );
      }

      return _peakData;
    },
    [brushXDomains],
  );

  const filteredPeakData = useMemo(
    () => getFilteredPeakData(peakData),
    [getFilteredPeakData, peakData],
  );

  const filteredPeakData2 = useMemo(
    () =>
      peakData2
        ? getFilteredPeakData(peakData2).map((p) => {
            const _p: Peak = { ...p };
            _p.intensity = -1 * _p.intensity;
            _p.rel = -1 * _p.rel;

            return _p;
          })
        : undefined,
    [getFilteredPeakData, peakData2],
  );

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

    return scaleLinear()
      .domain([0, maxY])
      .range([filteredPeakData2 ? boundsHeight / 2 : boundsHeight, 0]);
  }, [boundsHeight, filteredPeakData2]);

  const yScale2 = useMemo(() => {
    const maxY = -1000;

    return scaleLinear()
      .domain([0, maxY])
      .range([boundsHeight / 2, boundsHeight]);
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
    let precision: number | undefined;

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
          y={
            filteredPeakData2 ? yScale2.range()[1] + 25 : yScale.range()[0] + 25
          }
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={15}
        >
          {x.toFixed(precision)}
        </text>
        <line
          x1={xScale(x)}
          x2={xScale(x)}
          y1={filteredPeakData2 ? yScale2.range()[1] + 5 : yScale.range()[0]}
          y2={
            filteredPeakData2 ? yScale2.range()[1] + 15 : yScale.range()[0] + 10
          }
          stroke="black"
        />
      </g>
    ));
  }, [filteredPeakData2, xScale, yScale, yScale2]);

  const xAxis = useMemo(() => {
    return (
      <g>
        <line
          x1={xScale.range()[0]}
          x2={xScale.range()[1]}
          y1={filteredPeakData2 ? yScale2.range()[0] : yScale.range()[0]}
          y2={filteredPeakData2 ? yScale2.range()[0] : yScale.range()[0]}
          stroke="black"
        />
        {filteredPeakData2 && (
          <line
            x1={xScale.range()[0]}
            x2={xScale.range()[1]}
            y1={yScale2.range()[1] + 5}
            y2={yScale2.range()[1] + 5}
            stroke="black"
          />
        )}

        <text
          x={(xScale.range()[1] - xScale.range()[0]) / 2}
          y={
            filteredPeakData2 ? yScale2.range()[1] + 45 : yScale.range()[0] + 45
          }
        >
          m/z
        </text>
      </g>
    );
  }, [filteredPeakData2, xScale, yScale, yScale2]);

  const yAxis = useMemo(() => {
    return (
      <g>
        <line
          x1={xScale.range()[0]}
          x2={xScale.range()[0]}
          y1={filteredPeakData2 ? yScale.range()[1] : yScale.range()[0]}
          y2={filteredPeakData2 ? yScale2.range()[1] : yScale.range()[1]}
          stroke="black"
        />
        <text
          x={xScale.range()[0] - 60}
          y={
            filteredPeakData2
              ? (yScale.range()[0] + yScale2.range()[0]) / 2
              : (yScale.range()[0] - yScale.range()[1]) / 2
          }
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(270, ${xScale.range()[0] - 60}, ${
            filteredPeakData2
              ? (yScale.range()[0] + yScale2.range()[0]) / 2
              : (yScale.range()[0] - yScale.range()[1]) / 2
          })`}
        >
          Relative Abundance
        </text>
      </g>
    );
  }, [filteredPeakData2, xScale, yScale, yScale2]);

  const yLabels = useMemo(() => {
    const minY = Math.floor(
      Math.min(
        ...yScale.domain(),
        ...(filteredPeakData2 ? yScale2.domain() : []),
      ),
    );
    const maxY = Math.ceil(
      Math.max(
        ...yScale.domain(),
        ...(filteredPeakData2 ? yScale2.domain() : []),
      ),
    );
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
              y={y < 0 ? yScale2(y) : yScale(y)}
              textAnchor="middle"
              alignmentBaseline="central"
              fontSize={15}
            >
              {y < 0 ? -1 * y : y}
            </text>
            <line
              x1={xScale.range()[0]}
              x2={xScale.range()[0] - 10}
              y1={y < 0 ? yScale2(y) : yScale(y)}
              y2={y < 0 ? yScale2(y) : yScale(y)}
              stroke="black"
            />
          </g>
        ),
    );
  }, [filteredPeakData2, xScale, yScale, yScale2]);

  const chartElements = useMemo(
    () =>
      filteredPeakData
        .map((d) => (
          <ChartElement
            key={'chart_element' + d.mz + '_1'}
            pd={d}
            xScale={xScale}
            yScale={yScale}
            showLabel={isShowLabel}
            strokeColour="red"
          />
        ))
        .concat(
          filteredPeakData2
            ? filteredPeakData2.map((d) => (
                <ChartElement
                  key={'chart_element' + d.mz + '_2'}
                  pd={d}
                  xScale={xScale}
                  yScale={yScale2}
                  showLabel={isShowLabel}
                  strokeColour="blue"
                />
              ))
            : [],
        ),
    [filteredPeakData, filteredPeakData2, isShowLabel, xScale, yScale, yScale2],
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
    <div
      ref={wrapperRef}
      style={{
        width: width,
        height: height,
        marginRight: 5,
      }}
    >
      <svg ref={svgRef} width={width} height={height - MARGIN.button}>
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
      <div
        style={{
          width: '100%',
          height: MARGIN.button,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          child={isShowLabel ? 'Hide Labels' : 'Show Labels'}
          onClick={() => setIsShowLabel(!isShowLabel)}
          buttonStyle={{
            border: 'black solid 1px',
            padding: '3px',
          }}
        />
        <div>
          <p style={{ marginBottom: filteredPeakData2 ? 0 : undefined }}>
            {filteredPeakData.length}/{peakData.length}
          </p>
          {peakData2 && filteredPeakData2 && (
            <p style={{ marginTop: 0 }}>
              {filteredPeakData2.length}/{peakData2.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chart;

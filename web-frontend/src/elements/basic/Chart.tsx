import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { brushX, NumberValue, scaleLinear, select } from 'd3';
import ChartElement from './ChartElement';
import Peak from '../../types/peak/Peak';
import { Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import {
  CopyOutlined,
  DownloadOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  QuestionCircleTwoTone,
  SearchOutlined,
} from '@ant-design/icons';
import FileSaver from 'file-saver';
const { saveAs } = FileSaver;
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import routes from '../../constants/routes';
import { usePropertiesContext } from '../../context/properties/properties';
import NeutralLoss from '../../types/peak/NeutralLoss';
import Slider from './Slider';
import Tooltip from './Tooltip';

const toolButtonStyle = {
  width: 20,
  border: 'none',
  boxShadow: 'none',
  backgroundColor: 'rgb(225, 231, 245)',
  marginRight: 5,
};

type InputProps = {
  peakData: Peak[];
  peakData2?: Peak[];
  neutralLossData?: NeutralLoss[];
  onFilter?: ({
    fpd1,
    nld,
    fpd2,
  }: {
    fpd1: Peak[];
    nld: NeutralLoss[];
    fpd2?: Peak[];
  }) => void;
  width?: number;
  height?: number;
  disableLabels?: boolean;
  disableZoom?: boolean;
  disableOnHover?: boolean;
  disableExport?: boolean;
};

function Chart({
  peakData,
  peakData2 = [],
  neutralLossData = [],
  onFilter = () => {},
  width = 400,
  height = 300,
  disableLabels = false,
  disableZoom = false,
  disableOnHover = false,
  disableExport = false,
}: InputProps) {
  const wrapperRef = useRef(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { baseUrl, frontendUrl } = usePropertiesContext();

  const [isShowLabel, setIsShowLabel] = useState<boolean>(false);
  const [minRelIntensity, setMinRelativeIntensity] = useState<number>(0);

  const MARGIN = useMemo(() => {
    const defaultMargin = 5;
    return {
      top: disableLabels ? defaultMargin : 55,
      right: defaultMargin,
      bottom: disableLabels ? defaultMargin : 50,
      left: disableLabels ? defaultMargin : 70,
      button: disableLabels ? defaultMargin : 35,
    };
  }, [disableLabels]);

  const boundsWidth = useMemo(
    () => width - MARGIN.right - MARGIN.left,
    [MARGIN.left, MARGIN.right, width],
  );
  const boundsHeight = useMemo(
    () => height - MARGIN.top - MARGIN.bottom - MARGIN.button,
    [MARGIN.bottom, MARGIN.button, MARGIN.top, height],
  );

  const [brushXDomains, setBrushXDomains] = useState<
    { min: number; max: number }[] | undefined
  >();

  const getFilteredPeakData = useCallback(
    (peakDataTemp: Peak[]) => {
      let _peakData = peakDataTemp.filter((pd) => pd.rel >= minRelIntensity);
      if (brushXDomains) {
        _peakData = _peakData.filter(
          (pd) =>
            pd.mz >= brushXDomains[brushXDomains.length - 1].min &&
            pd.mz <= brushXDomains[brushXDomains.length - 1].max,
        );
      }

      return _peakData;
    },
    [brushXDomains, minRelIntensity],
  );

  const filteredPeakData = useMemo(
    () => getFilteredPeakData(peakData),
    [getFilteredPeakData, peakData],
  );

  const filteredPeakData2 = useMemo(
    () =>
      peakData2 && peakData2.length > 0
        ? getFilteredPeakData(peakData2).map((p) => {
            const _p: Peak = { ...p };
            _p.intensity = -1 * _p.intensity;
            _p.rel = -1 * _p.rel;
            return _p;
          })
        : undefined,
    [getFilteredPeakData, peakData2],
  );

  const filteredNeutralLossData = useMemo(
    () =>
      neutralLossData.filter((nl) =>
        filteredPeakData.some((p) => p.id === nl.peak_id),
      ),
    [filteredPeakData, neutralLossData],
  );

  const handleOnZoom = useCallback(
    (_filteredPeakData: Peak[], _filteredPeakData2?: Peak[]) => {
      const _filteredPeakData2_temp = (_filteredPeakData2 ?? []).map((p) => {
        return {
          ...p,
          intensity: -1 * p.intensity,
          rel: -1 * p.rel,
        } as Peak;
      });
      onFilter({
        fpd1: _filteredPeakData,
        fpd2: _filteredPeakData2_temp,
        nld: filteredNeutralLossData,
      });
    },
    [filteredNeutralLossData, onFilter],
  );

  useEffect(
    () => handleOnZoom(filteredPeakData, filteredPeakData2),
    [filteredPeakData, filteredPeakData2, handleOnZoom],
  );

  const xScale = useMemo(() => {
    const values = filteredPeakData
      .map((pd) => pd.mz)
      .concat(filteredPeakData2 ? filteredPeakData2.map((pd) => pd.mz) : []);

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
  }, [boundsWidth, brushXDomains, filteredPeakData, filteredPeakData2]);

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

    if (range === 0) {
      labelValues = [minX];
      precision = 4;
    } else if (range > 200) {
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
        {filteredPeakData2 && !disableLabels && (
          <line
            x1={xScale.range()[0]}
            x2={xScale.range()[1]}
            y1={yScale2.range()[1] + 5}
            y2={yScale2.range()[1] + 5}
            stroke="black"
          />
        )}

        {disableLabels ? undefined : (
          <text
            x={(xScale.range()[1] - xScale.range()[0]) / 2}
            y={
              filteredPeakData2
                ? yScale2.range()[1] + 45
                : yScale.range()[0] + 45
            }
          >
            m/z
          </text>
        )}
      </g>
    );
  }, [disableLabels, filteredPeakData2, xScale, yScale, yScale2]);

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
        {disableLabels ? undefined : (
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
        )}
      </g>
    );
  }, [disableLabels, filteredPeakData2, xScale, yScale, yScale2]);

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
            disableOnHover={disableOnHover}
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
                  disableOnHover={disableOnHover}
                />
              ))
            : [],
        ),
    [
      disableOnHover,
      filteredPeakData,
      filteredPeakData2,
      isShowLabel,
      xScale,
      yScale,
      yScale2,
    ],
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
    if (!disableZoom) {
      const svg = select(svgRef.current);
      const brush = brushX()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on('end', (e) => {
          if (e.selection) {
            const inverted: number[] = e.selection.map((x: NumberValue) =>
              xScale.invert(x),
            );
            const newBrushXDomains = brushXDomains
              ? [...brushXDomains].concat({
                  min: inverted[0],
                  max: inverted[1],
                })
              : [{ min: inverted[0], max: inverted[1] }];

            setBrushXDomains(newBrushXDomains);
          }
        });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      svg.select('.brush').call(brush).call(brush.move, undefined);
      svg.on('dblclick', handleDoubleClick);
    }
  }, [brushXDomains, disableZoom, handleDoubleClick, height, width, xScale]);

  const handleOnDownload = useCallback(() => {
    const svg = svgRef.current;
    if (svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      saveAs(blob, 'spectrum.svg');
    }
  }, []);

  const handleOnCopy = useCallback((peaks: Peak[]) => {
    const text = peaks
      .map((p) => `${p.mz.toFixed(4)} ${p.intensity.toFixed(4)} ${p.rel}`)
      .join('\n');
    copyTextToClipboard('Peak List', text);
  }, []);

  const buildSearchUrl = useCallback(
    (peaks: Peak[]) => {
      const searchParams = new URLSearchParams();
      searchParams.set(
        'peak_list',
        peaks.map((p) => `${p.mz.toFixed(4)};${p.rel}`).join(','),
      );
      searchParams.set('peak_list_threshold', '0.8');
      const url =
        frontendUrl +
        baseUrl +
        '/' +
        routes.search.path +
        `?${searchParams.toString()}`;

      return url;
    },
    [baseUrl, frontendUrl],
  );

  const handleOnSetMinRelativeIntensity = useCallback(
    (value: number) => {
      setMinRelativeIntensity(value);
      const _filteredPeakData = peakData.filter((p) => p.rel >= value);
      const _filteredPeakData2 = peakData2
        ? peakData2
            .filter((p) => p.rel >= value)
            .map((p) => {
              const _p: Peak = { ...p };
              _p.intensity = -1 * _p.intensity;
              _p.rel = -1 * _p.rel;
              return _p;
            })
        : undefined;
      onFilter({
        fpd1: _filteredPeakData,
        fpd2: _filteredPeakData2,
        nld: filteredNeutralLossData,
      });
    },
    [filteredNeutralLossData, onFilter, peakData, peakData2],
  );

  return useMemo(
    () => (
      <Content
        ref={wrapperRef}
        style={{
          width: width,
          height: height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          userSelect: 'none',
          msUserSelect: 'none',
          MozUserSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <svg
          ref={svgRef}
          width={width}
          height={disableLabels ? height : height - MARGIN.button}
          viewBox={`0 0 ${width} ${disableLabels ? height : height - MARGIN.button}`}
        >
          <g
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
          >
            {disableZoom ? undefined : <g className="brush" />}
            {chartElements}
            {xAxis}
            {disableLabels ? undefined : xLabels}
            {yAxis}
            {disableLabels ? undefined : yLabels}
          </g>
        </svg>
        {disableLabels ? undefined : (
          <Content
            style={{
              width,
              height: MARGIN.button,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingRight: MARGIN.right,
            }}
          >
            <Content
              style={{
                width: '100%',
                height: MARGIN.button,
                marginLeft: 5,
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
              }}
            >
              <Button
                children={
                  isShowLabel ? (
                    <EyeInvisibleOutlined title="Hide peak labels" />
                  ) : (
                    <EyeOutlined title="Show peak labels" />
                  )
                }
                onClick={() => setIsShowLabel(!isShowLabel)}
                style={toolButtonStyle}
              />
              <Button
                children={
                  <DownloadOutlined title="Download current spectrum view as SVG" />
                }
                onClick={handleOnDownload}
                style={toolButtonStyle}
              />
              {!disableExport && (
                <Content
                  style={{
                    width: 80,
                    height: MARGIN.button,
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    children={
                      <CopyOutlined title="Copy peak list of current spectrum view to clipboard" />
                    }
                    onClick={() => handleOnCopy(filteredPeakData)}
                    style={toolButtonStyle}
                  />
                  <Button
                    children={
                      <a
                        href={buildSearchUrl(filteredPeakData)}
                        target="_blank"
                      >
                        <SearchOutlined title="Search similar spectra by peaks in current spectrum view" />
                      </a>
                    }
                    style={toolButtonStyle}
                  />
                </Content>
              )}
              <Content
                style={{
                  width: 150,
                  height: MARGIN.button,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 20,
                }}
              >
                <Slider
                  width={150}
                  height={MARGIN.button}
                  min={0}
                  max={999}
                  value={0}
                  onChange={handleOnSetMinRelativeIntensity}
                />
              </Content>
              {!disableZoom && (
                <Content
                  style={{
                    width: '100%',
                    height: MARGIN.button,
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    marginLeft: 20,
                    marginRight: 10,
                  }}
                >
                  <Tooltip
                    title={
                      'Select an area in the spectrum to zoom in (Click + Drag). Double-click to return to the previous zoom level. The peaks in the peak table(s) and peak count(s) will be updated accordingly. This also happens in case of changing the minimal relative intensity.'
                    }
                  >
                    <QuestionCircleTwoTone
                      style={{
                        fontSize: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </Tooltip>
                </Content>
              )}
            </Content>
            <Content
              style={{
                width: 100,
                height: MARGIN.button,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'end',
              }}
            >
              <p style={{ marginBottom: filteredPeakData2 ? 0 : undefined }}>
                {filteredPeakData.length}/{peakData.length}
              </p>
              {peakData2 && filteredPeakData2 && (
                <p style={{ marginTop: 0 }}>
                  {filteredPeakData2.length}/{peakData2.length}
                </p>
              )}
            </Content>
          </Content>
        )}
      </Content>
    ),
    [
      MARGIN.button,
      MARGIN.left,
      MARGIN.right,
      MARGIN.top,
      boundsHeight,
      boundsWidth,
      buildSearchUrl,
      chartElements,
      disableExport,
      disableLabels,
      disableZoom,
      filteredPeakData,
      filteredPeakData2,
      handleOnCopy,
      handleOnDownload,
      handleOnSetMinRelativeIntensity,
      height,
      isShowLabel,
      peakData.length,
      peakData2,
      width,
      xAxis,
      xLabels,
      yAxis,
      yLabels,
    ],
  );
}

export default Chart;

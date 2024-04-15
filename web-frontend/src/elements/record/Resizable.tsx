import './Resizable.scss';

import PeakTable from './PeakTable';
import Chart from '../basic/Chart';

import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Peak from '../../types/peak/Peak';
import Record from '../../types/Record';
import getLinkedAnnotations from '../../utils/getLinkedAnnotations';
import LinkedPeakAnnotation from '../../types/peak/LinkedPeakAnnotation';

const sidebarWidth = 10;
const defaultChartWidthRatio = 0.7;

type InputProps = {
  record: Record;
  width?: number;
  height?: number;
  style?: CSSProperties;
};

function Resizable({ record, width = 500, height = 300, style }: InputProps) {
  const ref = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  const [chartWidth, setChartWidth] = useState(0);
  const [peakTableWidth, setPeakTableWidth] = useState(0);

  useEffect(() => {
    const _chartWidth = width * defaultChartWidthRatio - sidebarWidth;
    setChartWidth(_chartWidth);
    const _peakTableWidth = width - _chartWidth;
    setPeakTableWidth(_peakTableWidth);
  }, [width]);

  const [filteredPeakData, setFilteredPeakData] = useState<Peak[]>(
    record.peak.peak.values,
  );

  const linkedAnnotations = useMemo(
    () => getLinkedAnnotations(record.peak.peak.values, record.peak.annotation),
    [record.peak],
  );

  const [filteredLinkedAnnotations, setFilteredLinkedAnnotations] =
    useState<LinkedPeakAnnotation[]>(linkedAnnotations);

  const handleOnZoom = useCallback(
    (fpd: Peak[]) => {
      setFilteredPeakData(fpd);

      const _filteredLinkedAnnotations = getLinkedAnnotations(
        fpd,
        record.peak.annotation,
      );
      setFilteredLinkedAnnotations(_filteredLinkedAnnotations);
    },
    [record.peak.annotation],
  );

  const startResizing = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.shiftKey) {
      setIsResizing(true);
    }
  }, []);

  const stopResizing = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.shiftKey && isResizing && ref && ref.current) {
        const rect: DOMRect = (
          ref.current as HTMLDivElement
        ).getBoundingClientRect();

        const _chartWidth = e.clientX - rect.left - sidebarWidth;

        setChartWidth(_chartWidth);
        setPeakTableWidth(width - _chartWidth);
      }
    },
    [isResizing, width],
  );

  const chart = useMemo(
    () => (
      <Chart
        peakData={record.peak.peak.values}
        // peakData2={record.peak.peak.values}
        onZoom={handleOnZoom}
        width={chartWidth}
        height={height}
      />
    ),
    [chartWidth, handleOnZoom, height, record.peak.peak.values],
  );

  const sidebar = useMemo(
    () => (
      <div
        className="sidebar"
        style={{
          width: sidebarWidth,
          height,
          backgroundColor: isResizing ? 'lightskyblue' : 'lightgrey',
        }}
      />
    ),
    [height, isResizing],
  );

  const peakTable = useMemo(
    () => (
      <PeakTable
        peaks={filteredPeakData}
        annotations={record.peak.annotation}
        linkedAnnotations={filteredLinkedAnnotations}
        width={peakTableWidth}
        height={height}
      />
    ),
    [
      filteredLinkedAnnotations,
      filteredPeakData,
      height,
      peakTableWidth,
      record.peak.annotation,
    ],
  );

  const resizable = useMemo(
    () => (
      <div
        ref={ref}
        className="Resizable"
        style={{ width, height, ...style }}
        onMouseDown={startResizing}
        onMouseMove={resize}
        onMouseUp={stopResizing}
      >
        {chart}
        {sidebar}
        {peakTable}
      </div>
    ),
    [
      chart,
      height,
      peakTable,
      resize,
      sidebar,
      startResizing,
      stopResizing,
      style,
      width,
    ],
  );

  return resizable;
}

export default Resizable;

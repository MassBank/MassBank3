import './Resizable.scss';

import PeakTable from './PeakTable';
import Chart from '../basic/Chart';

import {
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
  record2?: Record;
  width: number;
  height: number;
};

function Resizable({ record, record2, width, height }: InputProps) {
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

  const [filteredPeakData2, setFilteredPeakData2] = useState<
    Peak[] | undefined
  >(record2 ? record2.peak.peak.values : undefined);

  const linkedAnnotations = useMemo(
    () => getLinkedAnnotations(record.peak.peak.values, record.peak.annotation),
    [record.peak],
  );
  const linkedAnnotations2 = useMemo(
    () =>
      record2
        ? getLinkedAnnotations(
            record2.peak.peak.values,
            record2.peak.annotation,
          )
        : [],
    [record2],
  );

  const [filteredLinkedAnnotations, setFilteredLinkedAnnotations] =
    useState<LinkedPeakAnnotation[]>(linkedAnnotations);

  const [filteredLinkedAnnotations2, setFilteredLinkedAnnotations2] =
    useState<LinkedPeakAnnotation[]>(linkedAnnotations2);

  const handleOnZoom = useCallback(
    (fpd1: Peak[], fpd2?: Peak[]) => {
      setFilteredPeakData(fpd1);
      setFilteredPeakData2(fpd2);

      const _filteredLinkedAnnotations = getLinkedAnnotations(
        fpd1,
        record.peak.annotation,
      );
      setFilteredLinkedAnnotations(_filteredLinkedAnnotations);

      if (record2 && fpd2) {
        const _filteredLinkedAnnotations2 = getLinkedAnnotations(
          fpd2,
          record2.peak.annotation,
        );
        setFilteredLinkedAnnotations2(_filteredLinkedAnnotations2);
      }
    },
    [record.peak.annotation, record2],
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
        peakData2={record2 ? record2.peak.peak.values : undefined}
        onZoom={handleOnZoom}
        width={chartWidth}
        height={height}
      />
    ),
    [chartWidth, handleOnZoom, height, record.peak.peak.values, record2],
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
        style={{
          width: peakTableWidth,
          height: record2 && filteredPeakData2 ? height / 2 : height,
        }}
      />
    ),
    [
      filteredLinkedAnnotations,
      filteredPeakData,
      filteredPeakData2,
      height,
      peakTableWidth,
      record.peak.annotation,
      record2,
    ],
  );
  const peakTable2 = useMemo(
    () =>
      record2 &&
      filteredPeakData2 && (
        <PeakTable
          peaks={filteredPeakData2}
          annotations={record2.peak.annotation}
          linkedAnnotations={filteredLinkedAnnotations2}
          style={{
            width: peakTableWidth,
            height: height / 2,
          }}
        />
      ),
    [
      filteredLinkedAnnotations2,
      filteredPeakData2,
      height,
      peakTableWidth,
      record2,
    ],
  );

  const resizable = useMemo(
    () => (
      <div
        ref={ref}
        className="resizable"
        style={{ height }}
        onMouseDown={startResizing}
        onMouseMove={resize}
        onMouseUp={stopResizing}
      >
        {chart}
        {sidebar}
        <div className="peak-tables-view">
          {peakTable}
          {peakTable2}
        </div>
      </div>
    ),
    [
      chart,
      height,
      peakTable,
      peakTable2,
      resize,
      sidebar,
      startResizing,
      stopResizing,
    ],
  );

  return resizable;
}

export default Resizable;

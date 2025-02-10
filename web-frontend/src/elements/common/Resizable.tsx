import PeakTable from '../record/PeakTable';
import Chart from '../basic/Chart';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Peak from '../../types/peak/Peak';
import Record from '../../types/record/Record';
import getLinkedAnnotations from '../../utils/getLinkedAnnotations';
import LinkedPeakAnnotation from '../../types/peak/LinkedPeakAnnotation';
import { Content } from 'antd/es/layout/layout';
import { Splitter } from 'antd';

const sidebarWidth = 7;

type InputProps = {
  record: Record;
  record2?: Record;
  width: number;
  height: number;
  minChartWidth?: number;
  minPeakTableWith?: number;
  disableExport?: boolean;
};

function Resizable({
  record,
  record2,
  width,
  height,
  minChartWidth = 400,
  minPeakTableWith = 300,
  disableExport = false,
}: InputProps) {
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [peakTableWidth, setPeakTableWidth] = useState<number>(0);

  useEffect(() => {
    const _chartWidth = width - minPeakTableWith - sidebarWidth;
    setChartWidth(_chartWidth);
    const _peakTableWidth = width - _chartWidth - sidebarWidth;
    setPeakTableWidth(_peakTableWidth);
  }, [minPeakTableWith, width]);

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

  const resize = useCallback((sizes: number[]) => {
    const _chartWidth = sizes[0];
    const _peaktTableWith = sizes[1];
    setChartWidth(_chartWidth);
    setPeakTableWidth(_peaktTableWith);
  }, []);

  const chart = useMemo(
    () => (
      <Chart
        peakData={record.peak.peak.values}
        peakData2={record2 ? record2.peak.peak.values : undefined}
        onZoom={handleOnZoom}
        width={chartWidth}
        height={height}
        disableExport={disableExport}
      />
    ),
    [
      chartWidth,
      disableExport,
      handleOnZoom,
      height,
      record.peak.peak.values,
      record2,
    ],
  );

  const peakTable = useMemo(
    () => (
      <PeakTable
        peaks={filteredPeakData}
        annotations={record.peak.annotation}
        linkedAnnotations={filteredLinkedAnnotations}
        width={peakTableWidth}
        height={record2 && filteredPeakData2 ? height / 2 : height}
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
          width={peakTableWidth}
          height={height / 2}
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

  return useMemo(
    () => (
      <Splitter style={{ width, height }} onResize={resize}>
        <Splitter.Panel
          size={chartWidth}
          min={minChartWidth}
          style={{ overflow: 'hidden' }}
        >
          {chart}
        </Splitter.Panel>
        <Splitter.Panel size={peakTableWidth} min={minPeakTableWith}>
          <Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {peakTable}
            {peakTable2}
          </Content>
        </Splitter.Panel>
      </Splitter>
    ),
    [
      chart,
      chartWidth,
      height,
      minChartWidth,
      minPeakTableWith,
      peakTable,
      peakTable2,
      peakTableWidth,
      resize,
      width,
    ],
  );
}

export default Resizable;

import PeakTable from '../record/PeakTable';
import Chart from '../basic/Chart';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Peak from '../../types/peak/Peak';
import Record from '../../types/record/Record';
import { Content } from 'antd/es/layout/layout';
import { Splitter, Tabs, TabsProps } from 'antd';
import NeutralLossTable from '../record/NeutralLossTable';
import NeutralLoss from '../../types/peak/NeutralLoss';
import getRecordPeakListWithPrecursor from '../../utils/getRecordPeakListWithPrecursor';

const sidebarWidth = 7;
const tabsHeight = 55;

type InputProps = {
  record: Record;
  record2?: Record;
  width: number;
  height: number;
  minChartWidth?: number;
  minPeakTableWith?: number;
  disableExport?: boolean;
  disableNeutralLossTab?: boolean;
};

function Resizable({
  record,
  record2,
  width,
  height,
  minChartWidth = 400,
  minPeakTableWith = 400,
  disableExport = false,
  disableNeutralLossTab = false,
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
    getRecordPeakListWithPrecursor(record),
  );

  const [filteredPeakData2, setFilteredPeakData2] = useState<
    Peak[] | undefined
  >(record2 ? record2.peak.peak.values : undefined);

  const [filteredNeutralLossData, setFilteredNeutralLossData] = useState<
    NeutralLoss[]
  >(record.peak.neutral_loss);

  const handleOnFilter = useCallback(
    ({
      fpd1,
      nld,
      fpd2,
    }: {
      fpd1: Peak[];
      nld: NeutralLoss[];
      fpd2?: Peak[];
    }) => {
      setFilteredPeakData(fpd1);
      setFilteredPeakData2(fpd2);
      setFilteredNeutralLossData(nld);
    },
    [],
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
        peakData={getRecordPeakListWithPrecursor(record)}
        peakData2={record2 ? record2.peak.peak.values : undefined}
        neutralLossData={record.peak.neutral_loss}
        onFilter={handleOnFilter}
        width={chartWidth}
        height={height}
        disableExport={disableExport}
      />
    ),
    [chartWidth, disableExport, handleOnFilter, height, record, record2],
  );

  const peakTable = useMemo(() => {
    if (
      disableNeutralLossTab ||
      !filteredNeutralLossData ||
      filteredNeutralLossData.length === 0
    ) {
      return (
        <PeakTable
          peaks={filteredPeakData}
          width={peakTableWidth}
          height={record2 && filteredPeakData2 ? height / 2 : height}
        />
      );
    }
    const items: TabsProps['items'] = [
      {
        key: '1',
        label: 'Peaks (' + filteredPeakData.length + ')',
        children: (
          <PeakTable
            peaks={filteredPeakData}
            width={peakTableWidth}
            height={
              record2 && filteredPeakData2
                ? height / 2 - tabsHeight
                : height - tabsHeight
            }
          />
        ),
      },
      {
        key: '2',
        label:
          'Neural Loss Search Result (' +
          (filteredNeutralLossData?.length ?? 0) +
          ')',
        children: (
          <NeutralLossTable
            neutralLosses={filteredNeutralLossData}
            peaks={filteredPeakData}
            width={peakTableWidth}
            height={
              record2 && filteredPeakData2
                ? height / 2 - tabsHeight
                : height - tabsHeight
            }
          />
        ),
      },
    ];
    return (
      <Tabs
        defaultActiveKey="1"
        items={items}
        style={{
          width: peakTableWidth,
          height: tabsHeight,
        }}
        centered
      />
    );
  }, [
    disableNeutralLossTab,
    filteredNeutralLossData,
    filteredPeakData,
    filteredPeakData2,
    height,
    peakTableWidth,
    record2,
  ]);

  const peakTable2 = useMemo(
    () =>
      record2 &&
      filteredPeakData2 && (
        <PeakTable
          peaks={filteredPeakData2}
          width={peakTableWidth}
          height={height / 2}
        />
      ),
    [filteredPeakData2, height, peakTableWidth, record2],
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

import './PeakTable.scss';

import { useCallback, useMemo, useState } from 'react';
import { Table } from 'antd';
import { useHighlightData } from '../../context/highlight/useHighlightData';
import NeutralLoss from '../../types/peak/NeutralLoss';
import NeutralLossTableDataType from '../../types/NeutralLossTableDataType';
import Peak from '../../types/peak/Peak';
import { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<NeutralLossTableDataType> = [
  {
    title: 'Difference',
    dataIndex: 'difference',
    key: 'difference',
    align: 'center' as const,
  },
  {
    title: 'Peak 1',
    dataIndex: 'peak1',
    key: 'peak1',
    align: 'center' as const,
  },
  {
    title: 'Peak 2',
    dataIndex: 'peak2',
    key: 'peak2',
    align: 'center' as const,
  },
];

type InputProps = {
  neutralLosses: NeutralLoss[];
  peaks: Peak[];
  width: number;
  height: number;
};

function NeutralLossTable({ neutralLosses, peaks, width, height }: InputProps) {
  const highlightData = useHighlightData();
  const [activeKey, setActiveKey] = useState<string | undefined>();

  const dataSource = useMemo(
    () =>
      neutralLosses.map((nl) => {
        return {
          key: nl.peak1_id + '_' + nl.peak2_id,
          difference: nl.difference.toFixed(4),
          peak1: peaks.find((p) => p.id === nl.peak1_id)?.mz.toFixed(4) ?? '',
          peak2: peaks.find((p) => p.id === nl.peak2_id)?.mz.toFixed(4) ?? '',
        } as NeutralLossTableDataType;
      }),
    [neutralLosses, peaks],
  );

  const handleOnMouseEnter = useCallback(
    (key: string) => {
      setActiveKey(key);
      highlightData.dispatch({
        type: 'SHOW',
        payload: { convertedHighlights: new Set<string>(key.split('_')) },
      });
    },
    [highlightData],
  );

  const handleOnMouseLeave = useCallback(
    (key: string) => {
      setActiveKey(undefined);
      highlightData.dispatch({
        type: 'HIDE',
        payload: { convertedHighlights: new Set<string>(key.split('_')) },
      });
    },
    [highlightData],
  );

  return useMemo(
    () => (
      <Table<NeutralLossTableDataType>
        className="peak-table"
        style={{ width, height }}
        sticky
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        onRow={(record) => {
          return {
            onMouseEnter: () => handleOnMouseEnter(record.key.toString()),
            onMouseLeave: () => handleOnMouseLeave(record.key.toString()),
          };
        }}
        rowClassName={(record) => {
          return record.key === activeKey ? 'table-row-highlight' : '';
        }}
      />
    ),
    [
      activeKey,
      dataSource,
      handleOnMouseEnter,
      handleOnMouseLeave,
      height,
      width,
    ],
  );
}

export default NeutralLossTable;

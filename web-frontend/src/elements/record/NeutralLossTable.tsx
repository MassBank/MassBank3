import './PeakTable.scss';

import { useCallback, useMemo, useState } from 'react';
import { Table } from 'antd';
import { useHighlightData } from '../../context/highlight/useHighlightData';
import NeutralLoss from '../../types/peak/NeutralLoss';
import NeutralLossTableDataType from '../../types/NeutralLossTableDataType';
import Peak from '../../types/peak/Peak';
import { ColumnsType } from 'antd/es/table';

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
      neutralLosses
        .sort((nl1, nl2) => nl1.difference - nl2.difference)
        .map((nl) => {
          return {
            key: nl.peak_id + '_' + nl.precursor_mass,
            difference: nl.difference.toFixed(4),
            peak1: peaks.find((p) => p.id === nl.peak_id)?.mz.toFixed(4) ?? '',
            peak2: nl.precursor_mass.toFixed(4) ?? '',
          } as NeutralLossTableDataType;
        }),
    [neutralLosses, peaks],
  );

  const handleOnMouseEnter = useCallback(
    (key: string) => {
      setActiveKey(key);
      highlightData.dispatch({
        type: 'SHOW',
        payload: {
          convertedHighlights: new Set<string>([
            key.split('_')[0],
            'precursor',
          ]),
        },
      });
    },
    [highlightData],
  );

  const handleOnMouseLeave = useCallback(
    (key: string) => {
      setActiveKey(undefined);
      highlightData.dispatch({
        type: 'HIDE',
        payload: {
          convertedHighlights: new Set<string>([
            key.split('_')[0],
            'precursor',
          ]),
        },
      });
    },
    [highlightData],
  );

  return useMemo(() => {
    const columns: ColumnsType<NeutralLossTableDataType> = [
      {
        title: <label>Difference{<br />}[m/z]</label>,
        dataIndex: 'difference',
        key: 'difference',
        align: 'center' as const,
      },
      {
        title: <label>Peak{<br />}[m/z]</label>,
        dataIndex: 'peak1',
        key: 'peak1',
        align: 'center' as const,
      },
      {
        title: <label>Precursor{<br />}[m/z]</label>,
        dataIndex: 'peak2',
        key: 'peak2',
        align: 'center' as const,
      },
    ];

    return (
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
    );
  }, [
    activeKey,
    dataSource,
    handleOnMouseEnter,
    handleOnMouseLeave,
    height,
    width,
  ]);
}

export default NeutralLossTable;

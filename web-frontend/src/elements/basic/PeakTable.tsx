import Table from './Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Peak from '../../types/peak/Peak';
import PeakTableDataType from '../../types/PeakTableDataType';
import { useHighlightData } from '../../context/highlight/useHighlightData';

const columns = [
  {
    title: 'm/z',
    dataIndex: 'mz',
    key: 'mz',
    align: 'center' as const,
  },
  {
    title: 'Intensity',
    dataIndex: 'intensity',
    key: 'intensity',
    align: 'center' as const,
  },
  {
    title: 'Rel. Int.',
    dataIndex: 'rel',
    key: 'rel',
    align: 'center' as const,
  },
];

type InputProps = {
  peaks: Peak[];
  width: number;
  height: number;
};

function PeakTable({ peaks, width, height }: InputProps) {
  const highlightData = useHighlightData();
  const [activeKey, setActiveKey] = useState<string | undefined>();

  useEffect(() => {
    function setKey(value: string | undefined) {
      setActiveKey(value);
    }
    const p = peaks.find((p) => highlightData.highlight.highlighted.has(p.id));
    if (p) {
      setKey(p.id);
    } else {
      setKey(undefined);
    }
  }, [activeKey, highlightData.highlight.highlighted, peaks]);

  const dataSource = useMemo(
    () =>
      peaks.map(
        (p) =>
          ({
            key: p.id,
            mz: p.mz ? p.mz.toFixed(4) : '',
            intensity: p.intensity ? p.intensity.toFixed(2) : '',
            rel: p.rel ?? '',
          }) as PeakTableDataType,
      ),
    [peaks],
  );

  const handleOnMouseEnter = useCallback(
    (key: string) => {
      setActiveKey(key);
      highlightData.dispatch({
        type: 'SHOW',
        payload: { convertedHighlights: new Set<string>([key]) },
      });
    },
    [highlightData],
  );

  const handleOnMouseLeave = useCallback(
    (key: string) => {
      setActiveKey(undefined);
      highlightData.dispatch({
        type: 'HIDE',
        payload: { convertedHighlights: new Set<string>([key]) },
      });
    },
    [highlightData],
  );

  return useMemo(
    () => (
      <Table
        tableName="Peak Table"
        isPeakTable
        style={{ width, height }}
        columns={columns}
        dataSource={dataSource}
        onRow={(record) => {
          return {
            onMouseEnter: () => handleOnMouseEnter(record.key.toString()),
            onMouseLeave: () => handleOnMouseLeave(record.key.toString()),
          };
        }}
        rowClassName={(record) => {
          return record.key === activeKey ? 'table-row-highlight' : '';
        }}
        enableExport
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

export default PeakTable;

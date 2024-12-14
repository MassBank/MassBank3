import './PeakTable.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Peak from '../../types/peak/Peak';
import LinkedPeakAnnotation from '../../types/peak/LinkedPeakAnnotation';
import PeakAnnotation from '../../types/peak/PeakAnnotation';
import { Table } from 'antd';
import PeakTableDataType from '../../types/PeakTableDataType';
import { useHighlightData } from '../../highlight/Index';

const columns = [
  {
    title: 'mz',
    dataIndex: 'mz',
    key: 'mz',
  },
  {
    title: 'Intensity',
    dataIndex: 'intensity',
    key: 'intensity',
  },
  {
    title: 'Rel. Int.',
    dataIndex: 'rel',
    key: 'rel',
  },
];

type InputProps = {
  peaks: Peak[];
  annotations?: PeakAnnotation;
  linkedAnnotations?: LinkedPeakAnnotation[];
  width: number;
  height: number;
};

function PeakTable({ peaks, width, height }: InputProps) {
  const highlightData = useHighlightData();
  const [activeKey, setActiveKey] = useState<string | undefined>();

  useEffect(() => {
    const p = peaks.find((p) => highlightData.highlight.highlighted.has(p.id));
    if (p) {
      setActiveKey(p.id);
    } else {
      setActiveKey(undefined);
    }
  }, [activeKey, highlightData.highlight.highlighted, peaks]);

  const dataSource = useMemo(
    () =>
      peaks.map((p) => {
        return {
          key: p.id,
          mz: p.mz.toFixed(4),
          intensity: p.intensity.toFixed(1),
          rel: p.rel,
        } as PeakTableDataType;
      }),
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
      <Table<PeakTableDataType>
        style={{
          width,
          height,
          userSelect: 'none',
          overflow: 'scroll',
          textAlign: 'center',
        }}
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

export default PeakTable;

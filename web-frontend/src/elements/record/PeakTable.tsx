import './PeakTable.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Peak from '../../types/peak/Peak';
import LinkedPeakAnnotation from '../../types/peak/LinkedPeakAnnotation';
import PeakAnnotation from '../../types/peak/PeakAnnotation';
import { Table } from 'antd';
import PeakTableDataType from '../../types/PeakTableDataType';
import { useHighlightData } from '../../highlight/Index';
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import ExportableContent from '../common/ExportableContent';
import { Content } from 'antd/es/layout/layout';
import routes from '../../constants/routes';

const columns = [
  {
    title: 'mz',
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

  const handleOnCopy = useCallback(() => {
    const text = peaks.map((p) => `${p.mz} ${p.intensity} ${p.rel}`).join('\n');
    copyTextToClipboard('Peak List', text);
  }, [peaks]);

  const buildSearchUrl = useCallback(() => {
    const searchParams = new URLSearchParams();
    searchParams.set(
      'peak_list',
      peaks.map((p) => `${p.mz};${p.rel}`).join(','),
    );
    const url =
      import.meta.env.VITE_MB3_FRONTEND_URL +
      routes.search.path +
      `?${searchParams.toString()}`;

    return url;
  }, [peaks]);

  return useMemo(
    () => (
      <Table<PeakTableDataType>
        className="peak-table"
        style={{ width, height }}
        sticky
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        footer={() => (
          <Content
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ExportableContent
              width={30}
              height={30}
              mode="copy"
              title="Copy peak list to clipboard"
              onClick={handleOnCopy}
              permanentButton
              enableSearch
              searchTitle="Search similar spectra"
              searchUrl={buildSearchUrl()}
            />
          </Content>
        )}
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
      buildSearchUrl,
      dataSource,
      handleOnCopy,
      handleOnMouseEnter,
      handleOnMouseLeave,
      height,
      width,
    ],
  );
}

export default PeakTable;

import './PeakTable.scss';

import { useCallback, useMemo, useState } from 'react';
import { Button, Checkbox, CheckboxChangeEvent, Table } from 'antd';
import { useHighlightData } from '../../context/highlight/useHighlightData';
import NeutralLoss from '../../types/peak/NeutralLoss';
import NeutralLossTableDataType from '../../types/NeutralLossTableDataType';
import Peak from '../../types/peak/Peak';
import { ColumnsType } from 'antd/es/table';
import { usePropertiesContext } from '../../context/properties/properties';
import routes from '../../constants/routes';
import { SearchOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';

const selectionLimit = 20;

type InputProps = {
  neutralLosses: NeutralLoss[];
  peaks: Peak[];
  width: number;
  height: number;
};

function NeutralLossTable({ neutralLosses, peaks, width, height }: InputProps) {
  const { frontendUrl, baseUrl } = usePropertiesContext();
  const highlightData = useHighlightData();
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const buildSearchUrl = useCallback(() => {
    const nld = neutralLosses.filter((nl) =>
      selectedKeys.has(nl.peak1_id + '_' + nl.peak2_id),
    );

    const searchParams = new URLSearchParams();
    searchParams.set(
      'neutral_loss',
      nld.map((nl) => nl.difference.toFixed(4)).join(','),
    );
    searchParams.set('mass_tolerance', '0.1');
    searchParams.set('intensity', '50');
    const url =
      frontendUrl +
      baseUrl +
      routes.search.path +
      `?${searchParams.toString()}`;

    return url;
  }, [baseUrl, frontendUrl, neutralLosses, selectedKeys]);

  const renderCheckbox = useCallback(
    (_: string, record: NeutralLossTableDataType) => {
      return (
        <Checkbox
          disabled={
            selectedKeys.size >= selectionLimit && !selectedKeys.has(record.key)
          }
          title={
            selectedKeys.size >= selectionLimit && !selectedKeys.has(record.key)
              ? 'Selection limit reached'
              : `Select up to ${selectionLimit} peak differences to search for`
          }
          onChange={(e: CheckboxChangeEvent) => {
            const _selectedKeys = new Set(selectedKeys);
            if (e.target.checked) {
              setSelectedKeys(new Set(_selectedKeys.add(record.key)));
            } else {
              _selectedKeys.delete(record.key);
              setSelectedKeys(new Set(_selectedKeys));
            }
          }}
        />
      );
    },
    [selectedKeys],
  );

  const renderSelectColumnHeader = useCallback(
    () => (
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <label>Select</label>
        <Button
          size="small"
          disabled={
            selectedKeys.size === 0 || selectedKeys.size > selectionLimit
          }
        >
          <a href={buildSearchUrl()} target="_blank">
            <SearchOutlined title="Search for peak differences (neutral losses) by selected ones" />
          </a>
        </Button>
      </Content>
    ),
    [buildSearchUrl, selectedKeys],
  );

  const columns: ColumnsType<NeutralLossTableDataType> = useMemo(
    () => [
      {
        title: <label>Difference{<br />}[m/z]</label>,
        dataIndex: 'difference',
        key: 'difference',
        align: 'center' as const,
      },
      {
        title: <label>Peak 1{<br />}[m/z]</label>,
        dataIndex: 'peak1',
        key: 'peak1',
        align: 'center' as const,
      },
      {
        title: <label>Peak 2{<br />}[m/z]</label>,
        dataIndex: 'peak2',
        key: 'peak2',
        align: 'center' as const,
      },
      {
        title: renderSelectColumnHeader,
        dataIndex: 'selected',
        key: 'selected',
        align: 'center' as const,
        render: renderCheckbox,
      },
    ],
    [renderCheckbox, renderSelectColumnHeader],
  );

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
      columns,
      dataSource,
      handleOnMouseEnter,
      handleOnMouseLeave,
      height,
      width,
    ],
  );
}

export default NeutralLossTable;

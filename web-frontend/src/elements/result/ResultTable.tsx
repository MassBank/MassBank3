import Hit from '../../types/Hit';
import Peak from '../../types/peak/Peak';

import { useCallback, useMemo } from 'react';
import { Table } from 'antd';
import ResultTableDataType from '../../types/ResultTableDataType';
import ResultLink from './ResultLink';
import Chart from '../basic/Chart';
import StructureView from '../basic/StructureView';

const defaultColumns = [
  {
    title: 'Index',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Accession',
    dataIndex: 'accession',
    key: 'accession',
  },
  {
    title: 'Link',
    dataIndex: 'link',
    key: 'link',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Chart',
    dataIndex: 'chart',
    key: 'chart',
  },
  {
    title: 'Structure',
    dataIndex: 'structure',
    key: 'structure',
  },
];

type InputProps = {
  reference?: Peak[];
  hits: Hit[];
  offset: number;
  height: number;
  // eslint-disable-next-line no-unused-vars
  // onDoubleClick: (slideIndex: number) => void;
  rowHeight?: number;
  chartWidth?: number;
  imageWidth?: number;
};

function ResultTable({
  reference,
  hits,
  offset,
  height,
  // onDoubleClick,
  rowHeight = 100,
  chartWidth = 200,
  imageWidth = 200,
}: InputProps) {
  const buildChart = useCallback(
    (hit: Hit) =>
      reference && reference.length > 0 ? (
        <Chart
          peakData={reference}
          peakData2={(hit.record ? hit.record.peak.peak.values : []) as Peak[]}
          width={chartWidth}
          height={rowHeight}
          disableZoom
          disableLabels
          disableOnHover
        />
      ) : (
        <Chart
          peakData={(hit.record ? hit.record.peak.peak.values : []) as Peak[]}
          width={chartWidth}
          height={rowHeight}
          disableZoom
          disableLabels
          disableOnHover
        />
      ),
    [chartWidth, reference, rowHeight],
  );

  const buildStructure = useCallback(
    (smiles: string) => (
      <StructureView
        smiles={smiles}
        imageWidth={imageWidth}
        imageHeight={rowHeight}
      />
    ),
    [imageWidth, rowHeight],
  );

  const dataSource: ResultTableDataType[] = useMemo(() => {
    const rows: ResultTableDataType[] = [];
    hits.forEach((hit, i) => {
      const row: ResultTableDataType = {
        key: 'result-table-row_' + i + '_' + hit.score,
        index: offset + i + 1,
        score: hit.score ? hit.score.toFixed(4) : undefined,
        accession: hit.accession,
        link: <ResultLink hit={hit} />,
        title: hit.record.title,
        chart: buildChart(hit),
        structure: buildStructure(hit.record.compound.smiles),
      };

      rows.push(row);
    });

    return rows;
  }, [buildChart, buildStructure, hits, offset]);

  // const handleOnDoubleClick = useCallback(
  //   (record: ResultTableDataType) => ({
  //     onDoubleClick: () => {
  //       onDoubleClick(record.index - 1);
  //     },
  //   }),
  //   [onDoubleClick],
  // );

  const columns = useMemo(() => {
    const _columns = [...defaultColumns];

    if (hits.find((hit) => hit.score !== undefined)) {
      _columns.splice(1, 0, {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      });
    }

    return _columns;
  }, [hits]);

  return useMemo(
    () => (
      <Table<ResultTableDataType>
        style={{
          width: '100%',
          height,
          userSelect: 'none',
          overflow: 'scroll',
          textAlign: 'center',
        }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        // onRow={handleOnDoubleClick}
        sticky
      />
    ),
    [columns, dataSource, height],
  );
}

export default ResultTable;

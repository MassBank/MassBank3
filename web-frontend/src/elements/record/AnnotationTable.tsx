import './Table.scss';

import { CSSProperties, useMemo } from 'react';
import PeakAnnotation from '../../types/peak/PeakAnnotation';
import { Table } from 'antd';
import StructureView from '../basic/StructureView';
import { ColumnsType } from 'antd/es/table';
import { Content } from 'antd/es/layout/layout';

type AnnotationRow = {
  [key: string]: string;
  key: string;
};

const structureColumnWidth = 180;
const structureWidth = structureColumnWidth - 20;

type InputProps = {
  annotation: PeakAnnotation | undefined;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function AnnotationTable({ annotation, width, height }: InputProps) {
  return useMemo(() => {
    if (!annotation || !annotation.header || !annotation.values) {
      return null;
    }

    const smilesIndex = annotation.header.findIndex((h) =>
      h.toLowerCase().includes('smiles'),
    );

    const columns: ColumnsType<AnnotationRow> = annotation.header.map((h) => {
      return {
        title: h.split('_').join(' '),
        dataIndex: h,
        key: h,
        align: 'center' as const,
      };
    });

    if (smilesIndex >= 0) {
      columns.push({
        title: 'Structure',
        dataIndex: 'structure',
        key: 'structure',
        align: 'center' as const,
        width: structureColumnWidth,
        render: (value: string) => (
          <Content
            style={{
              width: structureWidth,
              height: structureWidth,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <StructureView
              smiles={value}
              imageWidth={structureWidth}
              imageHeight={structureWidth}
              disableExport
            />
          </Content>
        ),
      });
    }

    const dataSource: AnnotationRow[] = [];
    const nRows = annotation.values[0].length;
    for (let i = 0; i < nRows; i++) {
      const row: AnnotationRow = { key: `key-${i}` };
      let key = 'key-';
      let smiles: string | null = null;
      annotation?.header.forEach((h, j) => {
        if (smilesIndex >= 0 && j === smilesIndex) {
          smiles = annotation.values[j][i];
        }
        row[h] = annotation.values[j][i];
        key += annotation.values[j][i];
      });
      row.key = key;
      if (smilesIndex >= 0 && smiles) {
        row['structure'] = smiles;
      }
      dataSource.push(row);
    }

    return (
      <Table
        className="table"
        style={{ width, height }}
        sticky
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }, [annotation, height, width]);
}

export default AnnotationTable;

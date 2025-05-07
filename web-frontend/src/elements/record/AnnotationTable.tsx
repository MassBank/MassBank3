import './Table.scss';

import { CSSProperties, useMemo } from 'react';
import PeakAnnotation from '../../types/peak/PeakAnnotation';
import { Table } from 'antd';

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

    const columns = annotation.header.map((h) => {
      return {
        title: h.split('_').join(' '),
        dataIndex: h,
        key: h,
        align: 'center' as const,
      };
    });

    const dataSource: { [key: string]: string }[] = [];
    const nValues = annotation.values[0].length;
    for (let i = 0; i < nValues; i++) {
      const row: { [key: string]: string } = {};
      let key = 'key-';
      annotation?.header.forEach((h, j) => {
        row[h] = annotation.values[j][i];
        key += annotation.values[j][i];
      });
      row.key = key;
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

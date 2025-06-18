import './Table.scss';

import { Table } from 'antd';
import { CSSProperties, JSX, useMemo } from 'react';
import { splitStringAndCapitaliseFirstLetter } from '../../utils/stringUtils';
import ExportableContent from '../common/ExportableContent';
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import MassSpectrometry from '../../types/record/MassSpectrometry';

type InputProps = {
  massSpectrometry: MassSpectrometry | undefined;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function MassSpectrometryTable({
  massSpectrometry,
  width,
  height,
}: InputProps) {
  return useMemo(() => {
    if (!massSpectrometry) {
      return null;
    }

    const columns = [
      {
        title: 'Parameter',
        dataIndex: 'Parameter',
        key: 'parameter',
        align: 'center' as const,
      },
      {
        title: 'Value',
        dataIndex: 'Value',
        key: 'value',
        align: 'center' as const,
      },
    ];

    const dataSource: { [key: string]: string | JSX.Element }[] = [];

    if (massSpectrometry.focused_ion) {
      massSpectrometry.focused_ion.forEach((c, i) => {
        const split = splitStringAndCapitaliseFirstLetter(c.subtag, '_', ' ');
        dataSource.push({
          Parameter: split,
          Value: (
            <ExportableContent
              mode="copy"
              title={`Copy '${split}' to clipboard`}
              component={c.value}
              onClick={() => copyTextToClipboard(split, c.value)}
            />
          ),
          key: `key-chromatography-${i}`,
        });
      });
    }

    if (massSpectrometry.data_processing) {
      massSpectrometry.data_processing.forEach((s, i) => {
        const split = splitStringAndCapitaliseFirstLetter(s.subtag, '_', ' ');
        dataSource.push({
          Parameter: split,
          Value: (
            <ExportableContent
              mode="copy"
              title={`Copy '${split}' to clipboard`}
              component={s.value}
              onClick={() => copyTextToClipboard(split, s.value)}
            />
          ),
          key: `key-subtag-${i}`,
        });
      });
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
  }, [height, massSpectrometry, width]);
}

export default MassSpectrometryTable;

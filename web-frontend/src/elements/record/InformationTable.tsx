import './Table.scss';

import { Table } from 'antd';
import { CSSProperties, JSX, useCallback, useMemo } from 'react';
import Record from '../../types/record/Record';
import ExportableContent from '../common/ExportableContent';
import copyTextToClipboard from '../../utils/copyTextToClipboard';
import LabelWrapper from '../basic/LabelWrapper';
import NotAvailableLabel from '../basic/NotAvailableLabel';

type InformationTableType = {
  key: string;
  label: string;
  value: JSX.Element;
  copyButton?: JSX.Element;
};

const labelWidth = '300px';

type InputProps = {
  record: Record;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
};

function InformationTable({ record, width, height }: InputProps) {
  const handleOnCopy = useCallback((label: string, text: string) => {
    copyTextToClipboard(label, text);
  }, []);

  return useMemo(() => {
    const columns = [
      {
        title: 'Label',
        dataIndex: 'label',
        key: 'record-view-header-table-label',
        width: labelWidth,
        align: 'left' as const,
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'record-view-header-table-value',
        width: `calc(100% - ${labelWidth})`,
        align: 'left' as const,
      },
    ];

    const dataSource: InformationTableType[] = [];
    dataSource.push({
      key: 'record-view-general-table-authors',
      label: 'Authors',
      value: (
        <ExportableContent
          component={
            <LabelWrapper
              value={record.authors.map((a) => a.name).join(', ')}
            />
          }
          mode="copy"
          onClick={() =>
            handleOnCopy(
              'Authors',
              record.authors.map((a) => a.name).join(', '),
            )
          }
          title="Copy authors to clipboard"
        />
      ),
    });
    dataSource.push({
      key: 'record-view-general-table-publication',
      label: 'Publication',
      value:
        record.publication && record.publication !== '' ? (
          <ExportableContent
            component={<LabelWrapper value={record.publication} />}
            mode="copy"
            onClick={() => handleOnCopy('Publication', record.publication)}
            title="Copy publication to clipboard"
          />
        ) : (
          <NotAvailableLabel />
        ),
    });
    dataSource.push({
      key: 'record-view-general-table-license',
      label: 'License',
      value:
        record.license && record.license !== '' ? (
          <ExportableContent
            component={record.license}
            mode="copy"
            onClick={() => handleOnCopy('License', record.license)}
            title="Copy license to clipboard"
          />
        ) : (
          <NotAvailableLabel />
        ),
    });
    dataSource.push({
      key: 'record-view-general-table-copyright',
      label: 'Copyright',
      value:
        record.copyright && record.copyright !== '' ? (
          <ExportableContent
            component={record.copyright}
            mode="copy"
            onClick={() => handleOnCopy('Copyright', record.copyright)}
            title="Copy copyright to clipboard"
          />
        ) : (
          <NotAvailableLabel />
        ),
    });
    dataSource.push({
      key: 'record-view-general-table-date-created',
      label: 'Date (created)',
      value: record.date ? (
        <ExportableContent
          component={record.date.created}
          mode="copy"
          onClick={() => handleOnCopy('Date (created)', record.date.created)}
          title="Copy date (created) to clipboard"
        />
      ) : (
        <NotAvailableLabel />
      ),
    });
    dataSource.push({
      key: 'record-view-general-table-date-modified',
      label: 'Date (modified)',
      value: record.date ? (
        <ExportableContent
          component={record.date.modified}
          mode="copy"
          onClick={() => handleOnCopy('Date (modified)', record.date.modified)}
          title="Copy date (modified) to clipboard"
        />
      ) : (
        <NotAvailableLabel />
      ),
    });

    return (
      <Table<InformationTableType>
        style={{
          width,
          height,
        }}
        className="table"
        sticky
        pagination={false}
        showHeader={false}
        columns={columns}
        dataSource={dataSource}
      />
    );
  }, [
    handleOnCopy,
    height,
    record.authors,
    record.copyright,
    record.date,
    record.license,
    record.publication,
    width,
  ]);
}

export default InformationTable;

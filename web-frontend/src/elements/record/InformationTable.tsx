import Table from '../basic/Table';
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
    for (const [field, label] of [
      ['updated', 'Date'],
      ['created', 'Date (created)'],
      ['modified', 'Date (modified)'],
    ] as const) {
      const value = record.date?.[field];
      dataSource.push({
        key: `record-view-general-table-date-${field}`,
        label,
        value: value ? (
          <ExportableContent
            component={value}
            mode="copy"
            onClick={() => handleOnCopy(label, value)}
            title={`Copy ${label.toLowerCase()} to clipboard`}
          />
        ) : (
          <NotAvailableLabel />
        ),
      });
    }

    return (
      <Table
        tableName="Further Information Table"
        columns={columns}
        dataSource={dataSource}
        style={{ width, height }}
        showHeader={false}
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

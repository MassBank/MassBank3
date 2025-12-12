import './Table.scss';

import { Button, Table as AntDTable, TableProps } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import {
  CSSProperties,
  JSX,
  memo,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ColumnsType, ColumnType } from 'antd/es/table';
import copyTextToClipboard from '../../utils/copyTextToClipboard';

const toolButtonStyle = {
  width: 20,
  border: 'none',
  boxShadow: 'none',
  backgroundColor: 'rgb(225, 231, 245)',
};

type InputProps = {
  tableName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnsType<any>;
  dataSource: TableProps['dataSource'];
  style?: CSSProperties;
  title?: ReactNode;
  showHeader?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRow?: TableProps<any>['onRow'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowClassName?: TableProps<any>['rowClassName'];
  isPeakTable?: boolean;
  enableExport?: boolean;
};

function Table({
  tableName,
  columns,
  dataSource,
  style = { width: '100%', height: '100%' },
  title,
  showHeader = true,
  onRow,
  rowClassName,
  isPeakTable = false,
  enableExport = false,
}: InputProps) {
  const [showToolButton, setShowToolButton] = useState<boolean>(false);

  const prepareDataForExport = useCallback(() => {
    const colNames =
      '"' +
      columns
        .map((col) => {
          // in case of coming from NeutralLossTable where title is a JSX element
          if (col.title && typeof col.title === 'object') {
            return (
              (col.title as JSX.Element).props.children[0] +
              ' ' +
              (col.title as JSX.Element).props.children[2]
            );
          }
          return col.title;
        })
        .join('","') +
      '"';
    const rows = dataSource?.map((data) => {
      return (
        '"' +
        columns
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((col): col is ColumnType<any> => 'dataIndex' in col)
          .map((col) => {
            const dataIndex = col.dataIndex as string;
            // in case of being an ExportableContent component
            if (typeof data[dataIndex] === 'object') {
              // in case of being an ExportableContent component with LabelWrapper inside
              if (typeof data[dataIndex].props.component === 'object') {
                return data[dataIndex].props.component.props.value;
              }
              return data[dataIndex].props.component;
            }
            // in case of being a primitive value
            return data[dataIndex] ?? 'unknown';
          })
          .join('","') +
        '"'
      );
    });

    if (rows && rows.length > 0) {
      return [colNames, ...rows].join('\n');
    }
    return null;
  }, [columns, dataSource]);

  const handleOnCopy = useCallback(() => {
    const textToCopy = prepareDataForExport();
    if (textToCopy) {
      copyTextToClipboard(tableName, textToCopy);
    }
  }, [prepareDataForExport, tableName]);

  return useMemo(
    () => (
      <div
        style={{ width: style.width, height: style.height }}
        onMouseEnter={enableExport ? () => setShowToolButton(true) : undefined}
        onMouseLeave={enableExport ? () => setShowToolButton(false) : undefined}
      >
        <AntDTable
          className={isPeakTable ? 'peak-table' : 'table'}
          style={style}
          sticky
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          title={title ? () => title : undefined}
          showHeader={showHeader}
          onRow={onRow}
          rowClassName={rowClassName}
          footer={() => (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                children={
                  <CopyOutlined
                    title={`Copy ${tableName}'s content to clipboard (CSV format)`}
                  />
                }
                onClick={handleOnCopy}
                style={{
                  ...toolButtonStyle,
                  visibility: showToolButton ? 'visible' : 'hidden',
                  display: enableExport ? undefined : 'none',
                }}
              />
            </div>
          )}
        />
      </div>
    ),
    [
      columns,
      dataSource,
      enableExport,
      handleOnCopy,
      isPeakTable,
      onRow,
      rowClassName,
      showHeader,
      showToolButton,
      style,
      tableName,
      title,
    ],
  );
}

export default memo(Table);

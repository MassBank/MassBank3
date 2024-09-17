/* eslint-disable no-unused-vars */
import './ContentTable.scss';

import { useMemo } from 'react';
import ValueCount from '../../../../types/ValueCount';
import { splitStringAndJoin } from '../../../../utils/stringUtils';
import CheckBox from '../../../basic/CheckBox';
import Content from '../../../../types/Content';
import ContentTableRow from './ContentTableRow';

type InputProps = {
  content: Content | undefined;
  onSelect: (
    key: string,
    value: string | undefined,
    isChecked: boolean | undefined,
  ) => void;
};

function ContentTable({ content, onSelect }: InputProps) {
  const header = (
    <tr key={'content-table-header'}>
      <th>Category</th>
      <th colSpan={4}>Value</th>
    </tr>
  );

  const rows = useMemo(() => {
    if (content) {
      const keys = Object.keys(content).filter((key) => key !== 'metadata');
      const _rows: JSX.Element[] = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const totalCount = (content[key] as ValueCount[])
          .map((vc) => vc.count)
          .reduce((accu, count) => accu + count);
        const valueCounts = [...(content[key] as ValueCount[])].map((vc) => {
          return { ...vc, percentage: (vc.count / totalCount) * 100 };
        });

        let elements: JSX.Element[] = [];
        for (let k = 0; k < valueCounts.length; k++) {
          const vc = valueCounts[k];
          elements.push(
            <CheckBox
              defaultValue={vc.flag || false}
              onChange={(isChecked: boolean) =>
                onSelect(key, vc.value, isChecked)
              }
              label={
                splitStringAndJoin(vc.value, '_', ' ') + ' (' + vc.count + ')'
              }
              isCheckedOutside={vc.flag}
            />,
          );

          if ((k + 1) % 4 === 0) {
            _rows.push(
              <ContentTableRow
                key={'content-table-row-' + key + '-' + i + '-' + k}
                id={key}
                i={i}
                k={k}
                valueCounts={valueCounts}
                elements={elements}
                onSelectAll={() => onSelect(key, undefined, undefined)}
              />,
            );
            elements = [];
          } else if (k === valueCounts.length - 1) {
            _rows.push(
              <ContentTableRow
                key={'content-table-row-' + key + '-' + i + '-' + k}
                id={key}
                i={i}
                k={k}
                valueCounts={valueCounts}
                elements={elements}
                onSelectAll={() => onSelect(key, undefined, undefined)}
              />,
            );
          }
        }
      }
      return _rows;
    }
  }, [content, onSelect]);

  return (
    <div className="content-table-container">
      <table className="content-table">
        <thead>{header}</thead>
        <tbody>
          {rows}
          <tr className="auto-height" />
        </tbody>
      </table>
    </div>
  );
}

export default ContentTable;

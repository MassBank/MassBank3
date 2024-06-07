/* eslint-disable no-unused-vars */
import './ContentTable.scss';

import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import ValueCount from '../../../../types/ValueCount';
import {
  splitStringAndCapitaliseFirstLetter,
  splitStringAndJoin,
} from '../../../../utils/stringUtils';
import CheckBox from '../../../basic/CheckBox';
import Content from '../../../../types/Content';
import Button from '../../../basic/Button';
import { on } from 'events';

function buildRow(
  key: string,
  i: number,
  k: number,
  valueCounts: ValueCount[],
  elements: JSX.Element[],
  // eslint-disable-next-line no-unused-vars
  onSelectAll: (key: string) => void,
) {
  return (
    <tr key={'content-table-row-' + key + '-' + i + '-' + k}>
      {k < 4 ? (
        <td
          rowSpan={
            Math.floor(valueCounts.length / 4) +
            (valueCounts.length % 4 === 0 ? 0 : 1)
          }
        >
          {
            <div>
              <label>
                {splitStringAndCapitaliseFirstLetter(key, '_', ' ')}
              </label>
              <Button
                child={
                  valueCounts.filter((vc) => vc.flag === true).length ===
                  valueCounts.length
                    ? 'Unselect'
                    : 'Select'
                }
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();

                  onSelectAll(key);
                }}
              />
            </div>
          }
        </td>
      ) : undefined}

      {elements.map((elem, l) => (
        <td key={'elem-' + i + '_' + k + '_' + l}>{elem}</td>
      ))}
    </tr>
  );
}

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
              buildRow(key, i, k, valueCounts, elements, () =>
                onSelect(key, undefined, undefined),
              ),
            );
            elements = [];
          } else if (k === valueCounts.length - 1) {
            _rows.push(
              buildRow(key, i, k, valueCounts, elements, () =>
                onSelect(key, undefined, undefined),
              ),
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

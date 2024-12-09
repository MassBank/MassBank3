import { MouseEvent } from 'react';
import ValueCount from '../../../../types/ValueCount';
import { splitStringAndCapitaliseFirstLetter } from '../../../../utils/stringUtils';
import { Button } from 'antd';

type InputProps = {
  id: string;
  i: number;
  k: number;
  valueCounts: ValueCount[];
  elements: JSX.Element[];
  // eslint-disable-next-line no-unused-vars
  onSelectAll: (key: string) => void;
};

function ContentTableRow({
  id,
  i,
  k,
  valueCounts,
  elements,
  onSelectAll,
}: InputProps) {
  return (
    <tr key={'content-table-row-' + id + '-' + i + '-' + k}>
      {k < 4 ? (
        <td
          rowSpan={
            Math.floor(valueCounts.length / 4) +
            (valueCounts.length % 4 === 0 ? 0 : 1)
          }
        >
          {
            <div>
              <label>{splitStringAndCapitaliseFirstLetter(id, '_', ' ')}</label>
              <Button
                children={
                  valueCounts.filter((vc) => vc.flag === true).length ===
                  valueCounts.length
                    ? 'Unselect'
                    : 'Select'
                }
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();

                  onSelectAll(id);
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

export default ContentTableRow;

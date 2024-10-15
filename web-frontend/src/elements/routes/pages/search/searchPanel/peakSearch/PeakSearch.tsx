import './PeakSearch.scss';

import { MouseEvent, useCallback, useMemo, useState } from 'react';
import PeakSearchRow from './PeakSearchRow';
import Button from '../../../../../basic/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Placeholder from '../../../../../basic/Placeholder';
import { useFormContext } from 'react-hook-form';

function PeakSearch() {
  const { getValues, register, setValue } = useFormContext();
  const [peakSearchRows, setPeakSearchRows] = useState<JSX.Element[]>([
    <PeakSearchRow key="peak-search-row-0" index={0} />,
  ]);

  const handleOnDelete = useCallback(() => {
    if (peakSearchRows.length > 1) {
      const peaks = getValues('peakSearch');
      delete peaks['p' + (peakSearchRows.length - 1)];
      setValue('peakSearch', peaks);

      const rows = [...peakSearchRows];
      rows.pop();
      setPeakSearchRows(rows);
    }
  }, [getValues, peakSearchRows, setValue]);

  const handleOnAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const index = peakSearchRows.length;

      setPeakSearchRows([
        ...peakSearchRows,
        <PeakSearchRow key={'peak-search-row-' + index} index={index} />,
      ]);
    },
    [peakSearchRows],
  );

  const peakSearchTable = useMemo(() => {
    return (
      <table className="peak-search-table">
        <thead>
          <tr>
            <th />
            <th>m/z</th>
            <th />
            <th>Formula</th>
          </tr>
        </thead>
        <tbody>
          {peakSearchRows}
          <tr>
            <td />
            <td>
              <Button
                child={
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    title={'Add a new m/z value'}
                  />
                }
                onClick={handleOnAdd}
                buttonStyle={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'green',
                  fontSize: '18px',
                }}
              />
            </td>
            <td />
            <td>
              {peakSearchRows.length > 1 ? (
                <Button
                  child={
                    <FontAwesomeIcon
                      icon={faMinusCircle}
                      title={'Remove last m/z value'}
                    />
                  }
                  onClick={handleOnDelete}
                  buttonStyle={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'red',
                    fontSize: '18px',
                  }}
                />
              ) : (
                <Placeholder child="" />
              )}
            </td>
            <td />
          </tr>
          <tr>
            <td />
            <td>Mass Tolerance:</td>
            <td />
            <td>Min. Rel. Intensity</td>
            <td />
          </tr>
          <tr>
            <td />
            <td>
              <input
                placeholder="For example: 0.1"
                {...register('peakSearch.massTolerance', {
                  required: false,
                  valueAsNumber: true,
                  min: 0,
                  value: 0.1,
                })}
              />
            </td>
            <td />
            <td>
              <input
                placeholder="For example: 50"
                {...register('peakSearch.intensity', {
                  required: false,
                  valueAsNumber: true,
                  min: 0,
                  value: 50,
                })}
              />
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    );
  }, [handleOnAdd, handleOnDelete, peakSearchRows, register]);

  return <div className="peak-search">{peakSearchTable}</div>;
}

export default PeakSearch;

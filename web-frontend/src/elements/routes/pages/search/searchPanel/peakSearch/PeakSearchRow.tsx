import './PeakSearchRow.scss';

import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent } from 'react';
import calculateMolecularMass from '../../../../../../utils/mass/calculateMolecularMass';
import { useFormContext } from 'react-hook-form';

type InputProps = {
  index: number;
};

function PeakSearchRow({ index }: InputProps) {
  const { register, setValue } = useFormContext();

  const label = `peakSearch.p${index}`;

  return (
    <tr className="peak-search-row">
      <td>{`${index + 1}.`}</td>
      <td>
        <input
          type="number"
          step="any"
          {...register(label, { required: false, valueAsNumber: true, min: 0 })}
        />
      </td>
      <td>
        {<FontAwesomeIcon icon={faLeftLong} title={'Add a new m/z value'} />}
      </td>
      <td>
        <input
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            e.stopPropagation();

            const mass = calculateMolecularMass(e.target.value);
            if (mass > 0) {
              setValue(label, mass);
            } else {
              setValue(label, undefined);
            }
          }}
        />
      </td>
    </tr>
  );
}

export default PeakSearchRow;

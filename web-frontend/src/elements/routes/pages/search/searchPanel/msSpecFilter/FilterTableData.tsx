import ValueCount from '../../../../../../types/ValueCount';
import { splitStringAndJoin } from '../../../../../../utils/stringUtils';
import CheckBox from '../../../../../basic/CheckBox';
import Placeholder from '../../../../../basic/Placeholder';

type InputProps = {
  vc: ValueCount;
  // eslint-disable-next-line no-unused-vars
  onSelect: (value: string, isChecked: boolean) => void;
};

function FilterTableData({ vc, onSelect }: InputProps) {
  return (
    <td>
      {vc.value !== '' ? (
        <CheckBox
          defaultValue={vc.flag || false}
          onChange={(isChecked: boolean) => {
            onSelect(vc.value, isChecked);
          }}
          label={splitStringAndJoin(vc.value, '_', ' ')}
          isCheckedOutside={vc.flag}
        />
      ) : (
        <Placeholder child="" />
      )}
    </td>
  );
}

export default FilterTableData;

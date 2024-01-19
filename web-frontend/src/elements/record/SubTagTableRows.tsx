import SubTag from '../../types/SubTag';
import { splitStringAndCapitaliseFirstLetter } from '../../utils/stringUtils';

interface InputProps {
  subtags: SubTag[];
}

function SubTagTableRows({ subtags }: InputProps) {
  return (
    subtags &&
    subtags.map((subtag) => {
      return (
        <tr key={subtag.subtag + '-' + subtag.value}>
          <td>
            {splitStringAndCapitaliseFirstLetter(subtag.subtag, '_', ' ')}
          </td>
          <td colSpan={2} className="long-text">
            {subtag.value}
          </td>
        </tr>
      );
    })
  );
}

export default SubTagTableRows;

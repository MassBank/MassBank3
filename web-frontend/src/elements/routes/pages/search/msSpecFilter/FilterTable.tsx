import './FilterTable.scss';

import { CSSProperties, useMemo } from 'react';
import ValueCount from '../../../../../types/ValueCount';
import FilterTableData from './FilterTableData';

type InputProps = {
  filterOptions: ValueCount[];
  onSelect: (
    // eslint-disable-next-line no-unused-vars
    value: string,
    // eslint-disable-next-line no-unused-vars
    isChecked: boolean,
  ) => void;
  style?: CSSProperties;
};

function FilterTable({ filterOptions, onSelect, style }: InputProps) {
  const rows = useMemo(() => {
    const pairs: ValueCount[][] = [];
    const filterOptions2 = [...filterOptions];
    let i = 0;
    for (; i <= filterOptions2.length - 2; i = i + 2) {
      pairs.push([filterOptions2[i], filterOptions2[i + 1]]);
    }
    if (i < filterOptions2.length) {
      const vc: ValueCount = { value: '', count: 0, flag: true };
      pairs.push([filterOptions2[i], vc]);
    }
    const rows = pairs.map((pair) => {
      const vc = pair[0];
      const vc2 = pair.length === 2 ? pair[1] : undefined;
      return (
        <tr key={'ms_spec_filter_' + vc.value}>
          <FilterTableData vc={vc} onSelect={onSelect} />
          {vc2 && <FilterTableData vc={vc2} onSelect={onSelect} />}
        </tr>
      );
    });

    return rows;
  }, [filterOptions, onSelect]);

  return (
    <div>
      {
        <table className="filter-table" style={style}>
          <tbody>{rows}</tbody>
        </table>
      }
    </div>
  );
}

export default FilterTable;

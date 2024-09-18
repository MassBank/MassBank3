import './FilterTable.scss';

import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import ValueCount from '../../../../../types/ValueCount';
import FilterTableData from './FilterTableData';
import Button from '../../../../basic/Button';

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
  const [filterOptionsInner, setFilterOptionInner] = useState<ValueCount[]>(
    filterOptions ? [...filterOptions] : [],
  );

  const rows = useMemo(() => {
    const pairs: ValueCount[][] = [];
    let i = 0;
    for (; i <= filterOptionsInner.length - 2; i = i + 2) {
      pairs.push([filterOptionsInner[i], filterOptionsInner[i + 1]]);
    }
    if (i < filterOptionsInner.length) {
      const vc: ValueCount = { value: '', count: 0, flag: true };
      pairs.push([filterOptionsInner[i], vc]);
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
  }, [filterOptionsInner, onSelect]);

  const allSelected = useMemo(() => {
    if (filterOptionsInner) {
      return (
        filterOptionsInner.filter((vc) => vc.flag === true).length ===
        filterOptionsInner.length
      );
    }

    return false;
  }, [filterOptionsInner]);

  const handleOnSelectAll = useCallback(() => {
    setFilterOptionInner(
      filterOptionsInner.map((vc) => {
        return { ...vc, flag: !allSelected };
      }),
    );
    filterOptionsInner.forEach((vc) => {
      onSelect(vc.value, !allSelected);
    });
  }, [allSelected, filterOptionsInner, onSelect]);

  return (
    <div>
      <table className="filter-table" style={style}>
        <tbody>{rows}</tbody>
      </table>
      <Button
        child={allSelected ? 'Unselect' : 'Select'}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();

          handleOnSelectAll();
        }}
      />
    </div>
  );
}

export default FilterTable;

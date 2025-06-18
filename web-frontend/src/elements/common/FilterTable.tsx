import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { Button, Checkbox, Form } from 'antd';
import { Content } from 'antd/es/layout/layout';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import ValueCount from '../../types/ValueCount';
import SearchFields from '../../types/filterOptions/SearchFields';

type InputProps = {
  filterOptions: ValueCount[];
  filterName: string;
  label: string;
  height?: number;
  showCounts?: boolean;
};

function FilterTable({
  filterOptions,
  filterName,
  label,
  height = 250,
  showCounts = false,
}: InputProps) {
  const formInstance = useFormInstance<SearchFields>();
  const { setFieldValue } = formInstance;
  const [allSelected, setAllSelected] = useState<boolean>(true);

  const createOptions = useCallback(
    (_filterOptions: ValueCount[]) => {
      return _filterOptions.map((vc) => {
        return {
          label: showCounts ? (
            <Content>
              <label>{vc.value}</label>
              <label style={{ color: 'grey' }}>{' (' + vc.count + ')'}</label>
            </Content>
          ) : (
            vc.value
          ),
          value: vc.value,
          checked: vc.flag ?? false,
        };
      });
    },
    [showCounts],
  );

  const options = useMemo(
    () => createOptions(filterOptions),
    [createOptions, filterOptions],
  );

  const handleOnSelectAll = useCallback(() => {
    setFieldValue(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [filterName, label],
      allSelected ? [] : options.map((vc) => vc.value),
    );
    setAllSelected(!allSelected);
  }, [allSelected, filterName, label, options, setFieldValue]);

  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Content
          style={{
            width: '100%',
            height,
            overflow: 'scroll',
          }}
        >
          <Form.Item
            name={[filterName, label]}
            rules={[{ required: false }]}
            style={{
              width: '100%',
              height: '100%',
            }}
            initialValue={options
              .filter((vc) => vc.checked)
              .map((vc) => vc.value)}
          >
            <Checkbox.Group
              options={options}
              style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}
            />
          </Form.Item>
        </Content>
        <Button
          children={allSelected ? 'Unselect' : 'Select'}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            handleOnSelectAll();
          }}
        />
      </Content>
    ),
    [allSelected, filterName, handleOnSelectAll, height, label, options],
  );
}

export default FilterTable;

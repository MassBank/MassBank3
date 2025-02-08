import './CommonSearchPanel.scss';

import { useCallback, useEffect, useMemo } from 'react';

import type { FormProps } from 'antd';
import { Button, Form, Menu } from 'antd';
import SearchFields from '../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../types/filterOptions/ContentFilterOtions';
import { useForm } from 'antd/es/form/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Content } from 'antd/es/layout/layout';
import ValueCount from '../../types/ValueCount';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import getActiveKeysFromFormData from '../../utils/getActiveKeysFromFormData';
import defaultSearchFieldValues from '../../constants/defaultSearchFieldValues';

const submitButtonHeight = 40;

type InputProps = {
  items: ItemType<MenuItemType>[];
  initialValues: SearchFields;
  width: number;
  height: number;
  collapsed: boolean;
  propertyFilterOptions: ContentFilterOptions | undefined;
  onCollapse: (collapsed: boolean) => void;
  onSubmit: (data: SearchFields) => void;
};

function CommonSearchPanel({
  items,
  initialValues,
  width,
  height,
  collapsed,
  propertyFilterOptions,
  onCollapse,
  onSubmit,
}: InputProps) {
  const [form] = useForm<SearchFields>();
  const { setFieldValue, setFieldsValue } = form;

  useEffect(() => {
    if (initialValues) {
      setFieldsValue(initialValues);
    }
    const mapper = (vcs: ValueCount[]) => {
      return vcs.filter((vc) => vc.flag === true).map((vc) => vc.value);
    };
    setFieldValue('propertyFilterOptions', {
      contributor: mapper(propertyFilterOptions?.contributor ?? []),
      instrument_type: mapper(propertyFilterOptions?.instrument_type ?? []),
      ms_type: mapper(propertyFilterOptions?.ms_type ?? []),
      ion_mode: mapper(propertyFilterOptions?.ion_mode ?? []),
    } as SearchFields['propertyFilterOptions']);

    return () => {
      form.setFieldsValue(
        JSON.parse(JSON.stringify(defaultSearchFieldValues)) as SearchFields,
      );
    };
  }, [
    form,
    initialValues,
    propertyFilterOptions,
    setFieldValue,
    setFieldsValue,
  ]);

  const activeKeys = useMemo(
    () => getActiveKeysFromFormData(initialValues),
    [initialValues],
  );

  const handleOnSubmit: FormProps<SearchFields>['onFinish'] = useCallback(
    (values: SearchFields) => {
      onSubmit(values);
    },
    [onSubmit],
  );

  const handleOnCollapse = useCallback(() => {
    onCollapse(!collapsed);
  }, [collapsed, onCollapse]);

  return useMemo(
    () => (
      <Content
        style={{
          width,
          height,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        <Content
          style={{
            width,
            height: collapsed ? height : submitButtonHeight,
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'start',
          }}
        >
          <Button
            onClick={handleOnCollapse}
            style={{
              width: 50,
              height: submitButtonHeight,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: 'none',
              color: 'blue',
              boxShadow: 'none',
            }}
            size="large"
          >
            <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleDown} />
          </Button>
        </Content>
        <Form.Provider>
          <Form
            form={form}
            autoComplete="off"
            layout="inline"
            style={{
              width,
              height,
              backgroundColor: 'white',
              display: collapsed ? 'none' : 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              userSelect: 'none',
            }}
            initialValues={initialValues}
            onFinish={handleOnSubmit}
          >
            <Content
              style={{
                width: '100%',
                height: height - submitButtonHeight,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Menu
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'scroll',
                }}
                mode="inline"
                items={items}
                inlineIndent={10}
                defaultOpenKeys={activeKeys}
                defaultSelectedKeys={activeKeys}
              />
              <Button
                htmlType="submit"
                style={{
                  width: 150,
                  height: submitButtonHeight - 10,
                  marginTop: 5,
                  marginBottom: 5,
                  backgroundColor: 'rgb(167, 199, 254)',
                }}
              >
                Search
              </Button>
            </Content>
          </Form>
        </Form.Provider>
      </Content>
    ),
    [
      width,
      height,
      collapsed,
      handleOnCollapse,
      form,
      initialValues,
      handleOnSubmit,
      items,
      activeKeys,
    ],
  );
}

export default CommonSearchPanel;

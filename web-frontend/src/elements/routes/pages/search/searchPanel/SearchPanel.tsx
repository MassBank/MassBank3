/* eslint-disable no-unused-vars */
import './SearchPanel.scss';

import { useCallback, useMemo, useState } from 'react';

import type { FormProps, MenuProps } from 'antd';
import { Button, Form, Menu } from 'antd';
import SearchFields from '../../../../../types/filterOptions/SearchFields';
import ContentFilterOptions from '../../../../../types/filterOptions/ContentFilterOtions';
import { useForm } from 'antd/es/form/Form';
import SearchPanelMenuItems from './SearchPanelMenuItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Content } from 'antd/es/layout/layout';

const submitButtonHeight = 40;

type InputProps = {
  width: number;
  height: number;
  collapsed: boolean;
  massSpecFilterOptions: ContentFilterOptions | undefined;
  onCollapse: (collapsed: boolean) => void;
  onSubmit: (data: SearchFields) => void;
};

function SearchPanel({
  width,
  height,
  collapsed,
  massSpecFilterOptions,
  onCollapse,
  onSubmit,
}: InputProps) {
  const [form] = useForm<SearchFields>();
  const { setFieldValue } = form;

  const handleOnSubmit: FormProps<SearchFields>['onFinish'] = useCallback(
    (values: SearchFields) => {
      onCollapse(true);
      onSubmit(values);
    },
    [onCollapse, onSubmit],
  );

  const handleOnError: FormProps<SearchFields>['onFinishFailed'] = useCallback(
    (errorInfo) => {
      console.log('Failed:', errorInfo);
    },
    [],
  );

  const handleOnChangeStructure = useCallback(
    (molfile: string) => setFieldValue('structure', molfile),
    [setFieldValue],
  );

  const handleOnCollapse = useCallback(() => {
    onCollapse(!collapsed);
  }, [collapsed, onCollapse]);

  const initialValues: SearchFields = useMemo(() => {
    return {
      basicSearchFilterOptions: {
        compoundName: undefined,
        formula: undefined,
        exactMass: undefined,
        massTolerance: 0.1,
      },
      peaks: {
        similarity: {
          peakList: undefined,
          threshold: 0.8,
        },
        peaks: {
          peaks: [],
          massTolerance: 0.1,
          intensity: 50,
        },
      },
      inchi: undefined,
      splash: undefined,
      // massSpecFilterOptions,
      structure: undefined,
    };
  }, []);

  const searchPanel = useMemo(
    () => (
      <Form.Provider>
        <Form
          form={form}
          autoComplete="off"
          layout="inline"
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
          initialValues={initialValues}
          onFinish={handleOnSubmit}
          onFinishFailed={handleOnError}
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
          <Content
            style={{
              width: '100%',
              height: height - submitButtonHeight,
              display: collapsed ? 'none' : 'flex',
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
              // defaultOpenKeys={['basicSearchMenuItem']}
              mode="inline"
              items={SearchPanelMenuItems({
                massSpecFilterOptions,
                onChangeStructure: handleOnChangeStructure,
                width,
              })}
              inlineCollapsed={collapsed}
            />

            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: 150,
                height: submitButtonHeight,
              }}
            >
              Submit
            </Button>
          </Content>
        </Form>
      </Form.Provider>
    ),
    [
      form,
      width,
      height,
      initialValues,
      handleOnSubmit,
      handleOnError,
      collapsed,
      handleOnCollapse,
      massSpecFilterOptions,
      handleOnChangeStructure,
    ],
  );

  return searchPanel;
}

export default SearchPanel;

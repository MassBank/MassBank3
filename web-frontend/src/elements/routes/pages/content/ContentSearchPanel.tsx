import { useCallback, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { FormProps, useForm } from 'antd/es/form/Form';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import { Button, Form, Menu } from 'antd';
import { Content } from 'antd/es/layout/layout';
import MassSpecFilterOptionsMenuItems from '../search/searchPanel/msSpecFilter/MassSpecFilterOptionsMenuItems';
import ValueCount from '../../../../types/ValueCount';

const submitButtonHeight = 40;

type InputProps = {
  width: number;
  height: number;
  collapsed: boolean;
  content: ContentFilterOptions | undefined;
  // eslint-disable-next-line no-unused-vars
  onCollapse: (collapsed: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (newBrowseContent: SearchFields) => void;
};

function ContentSearchPanel({
  width,
  height,
  collapsed,
  content,
  onCollapse,
  onSubmit,
}: InputProps) {
  const [form] = useForm<SearchFields>();
  const { setFieldValue } = form;

  useEffect(() => {
    const mapper = (vcs: ValueCount[]) => {
      return vcs.filter((vc) => vc.flag === true).map((vc) => vc.value);
    };
    setFieldValue('massSpecFilterOptions', {
      contributor: mapper(content?.contributor || []),
      instrument_type: mapper(content?.instrument_type || []),
      ms_type: mapper(content?.ms_type || []),
      ion_mode: mapper(content?.ion_mode || []),
    } as SearchFields['massSpecFilterOptions']);
  }, [content, setFieldValue]);

  const handleOnCollapse = useCallback(() => {
    onCollapse(!collapsed);
  }, [collapsed, onCollapse]);

  const handleOnSubmit: FormProps<SearchFields>['onFinish'] = useCallback(
    (values: SearchFields) => {
      onCollapse(true);
      onSubmit(values);
    },
    [onCollapse, onSubmit],
  );

  return useMemo(
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
          onFinish={handleOnSubmit}
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
              mode="inline"
              items={MassSpecFilterOptionsMenuItems({
                massSpecFilterOptions: content,
              })}
              inlineCollapsed={collapsed}
              // defaultOpenKeys={[
              //   'massSpecFilterOptionsContributor',
              //   'massSpecFilterOptionsInstrumentType',
              //   'massSpecFilterOptionsMsType',
              //   'massSpecFilterOptionsIonMode',
              // ]}
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
    [collapsed, content, form, handleOnCollapse, handleOnSubmit, height, width],
  );
}

export default ContentSearchPanel;

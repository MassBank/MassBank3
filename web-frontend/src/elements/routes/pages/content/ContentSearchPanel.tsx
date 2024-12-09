import { useCallback, useEffect } from 'react';
import ValueCount from '../../../../types/ValueCount';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FilterTable from '../search/searchPanel/msSpecFilter/FilterTable';
import { faAngleLeft, faList } from '@fortawesome/free-solid-svg-icons';
import ContentFilterOptions from '../../../../types/filterOptions/ContentFilterOtions';
import { useForm } from 'antd/es/form/Form';
import SearchFields from '../../../../types/filterOptions/SearchFields';
import { Button, Form } from 'antd';

type InputProps = {
  width: number;
  height: number;
  collapsed: boolean;
  content: ContentFilterOptions | undefined;
  // eslint-disable-next-line no-unused-vars
  onCollapse: (collapsed: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (newBrowseContent: ContentFilterOptions) => void;
  showCounts?: boolean;
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
  const { getFieldValue, setFieldValue } = form;

  const collapseButtonHeight = 40;
  const submitButtonHeight = 40;

  useEffect(() => {
    setFieldValue('msSpecFilterOptions', {
      contributor: content?.contributor,
      instrument_type: content?.instrument_type,
      ms_type: content?.ms_type,
      ion_mode: content?.ion_mode,
    } as ContentFilterOptions);
  }, [content, setFieldValue]);

  const handleOnCollapse = useCallback(() => {
    onCollapse(!collapsed);
  }, [collapsed, onCollapse]);

  const handleOnSubmit = useCallback(
    (data: SearchFields) => {
      onSubmit(data['msSpecFilterOptions'] as ContentFilterOptions);
    },
    [onSubmit],
  );

  const handleOnSelect = useCallback(
    (filterName: string, key: string, value: string, isChecked: boolean) => {
      const newFilterOptions = { ...getFieldValue(filterName) };
      newFilterOptions[key].find((vc: ValueCount) => vc.value === value).flag =
        isChecked;

      setFieldValue(filterName, newFilterOptions);
    },
    [getFieldValue, setFieldValue],
  );

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ width, height }}
      initialValues={{ remember: true }}
      onFinish={handleOnSubmit}
      // onFinishFailed={handleOnFormError}
      autoComplete="off"
    >
      <div className="search-panel-container" style={{ width }}>
        {/* <div
          className="collapse-button-container"
          style={{ height: collapseButtonHeight }}
        >
          <Button
            onClick={handleOnCollapse}
            children={
              <FontAwesomeIcon icon={collapsed ? faList : faAngleLeft} />
            }
          />
        </div> */}
        {/* <Sidebar
            className="sidebar"
            style={{
              width,
              height: height - (collapseButtonHeight + submitButtonHeight),
              zIndex: 0,
              backgroundColor: 'orange',
            }}
            collapsed={collapsed}
            transitionDuration={0}
          >
            <Menu className="menu">
              <SubMenu label={'Contibutor'} className="submenu">
                {content && (
                  <FilterTable
                    filterOptions={content.contributor}
                    onSelect={(value, isChecked) =>
                      handleOnSelect(
                        'msSpecFilterOptions',
                        'contributor',
                        value,
                        isChecked,
                      )
                    }
                    style={{ height: '200px' }}
                    showCounts
                  />
                )}
              </SubMenu>
              <SubMenu label={'Instrument Type'} className="submenu">
                {content && (
                  <FilterTable
                    filterOptions={content.instrument_type}
                    onSelect={(value, isChecked) =>
                      handleOnSelect(
                        'msSpecFilterOptions',
                        'instrument_type',
                        value,
                        isChecked,
                      )
                    }
                    style={{ height: '200px' }}
                    showCounts
                  />
                )}
              </SubMenu>
              <SubMenu label={'MS Type'} className="submenu">
                {content && (
                  <FilterTable
                    filterOptions={content.ms_type}
                    onSelect={(value, isChecked) =>
                      handleOnSelect(
                        'msSpecFilterOptions',
                        'ms_type',
                        value,
                        isChecked,
                      )
                    }
                    showCounts
                  />
                )}
              </SubMenu>
              <SubMenu label={'Ion Mode'} className="submenu">
                {content && (
                  <FilterTable
                    filterOptions={content.ion_mode}
                    onSelect={(value, isChecked) =>
                      handleOnSelect(
                        'msSpecFilterOptions',
                        'ion_mode',
                        value,
                        isChecked,
                      )
                    }
                    showCounts
                  />
                )}
              </SubMenu>
            </Menu>
          </Sidebar> */}
        {/* <div
          className="search-button-container"
          style={{ height: collapseButtonHeight }}
        >
          {!collapsed && (
            <input type="submit" value="Search" className="submit-input" />
          )}
        </div> */}
        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ height: submitButtonHeight }}
          >
            Submit
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
}

export default ContentSearchPanel;

import { useCallback, useEffect } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import ValueCount from '../../../../types/ValueCount';
import Content from '../../../../types/Content';
import Button from '../../../basic/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Sidebar, SubMenu } from 'react-pro-sidebar';
import FilterTable from '../search/searchPanel/msSpecFilter/FilterTable';
import { faAngleLeft, faList } from '@fortawesome/free-solid-svg-icons';

type InputProps = {
  width: number;
  height: number;
  collapsed: boolean;
  content: Content | undefined;
  // eslint-disable-next-line no-unused-vars
  onCollapse: (collapsed: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (newBrowseContent: Content) => void;
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
  const formMethods = useForm();
  const { getValues, handleSubmit, setValue } = formMethods;

  const collapseButtonHeight = 40;
  const submitButtonHeight = 40;

  useEffect(() => {
    setValue('msSpecFilterOptions', {
      contributor: content?.contributor,
      instrument_type: content?.instrument_type,
      ms_type: content?.ms_type,
      ion_mode: content?.ion_mode,
    } as Content);
  }, [content, setValue]);

  const handleOnCollapse = useCallback(() => {
    onCollapse(!collapsed);
  }, [collapsed, onCollapse]);

  const handleOnSubmit = useCallback(
    (data: FieldValues) => {
      onSubmit(data['msSpecFilterOptions'] as Content);
    },
    [onSubmit],
  );

  const handleOnSelect = useCallback(
    (filterName: string, key: string, value: string, isChecked: boolean) => {
      const newFilterOptions = { ...getValues(filterName) };
      newFilterOptions[key].find((vc: ValueCount) => vc.value === value).flag =
        isChecked;

      setValue(filterName, newFilterOptions);
    },
    [getValues, setValue],
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit((data) => handleOnSubmit(data))}>
        <div className="search-panel-container" style={{ width }}>
          <div
            className="collapse-button-container"
            style={{ height: collapseButtonHeight }}
          >
            <Button
              onClick={handleOnCollapse}
              child={
                <FontAwesomeIcon icon={collapsed ? faList : faAngleLeft} />
              }
            />
          </div>
          <Sidebar
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
          </Sidebar>
          <div
            className="search-button-container"
            style={{ height: collapseButtonHeight }}
          >
            {!collapsed && (
              <input type="submit" value="Search" className="submit-input" />
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default ContentSearchPanel;

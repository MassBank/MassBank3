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
  msSpecFilterOptions: Content | undefined;
  // eslint-disable-next-line no-unused-vars
  onCollapse: (collapsed: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (newBrowseContent: Content) => void;
};

function ContentSearchPanel({
  width,
  height,
  collapsed,
  msSpecFilterOptions,
  onCollapse,
  onSubmit,
}: InputProps) {
  const formMethods = useForm();
  const { getValues, handleSubmit, setValue } = formMethods;

  const collapseButtonHeight = 40;
  const submitButtonHeight = 40;

  useEffect(() => {
    setValue('msSpecFilterOptions', {
      contributor: msSpecFilterOptions?.contributor,
      instrument_type: msSpecFilterOptions?.instrument_type,
      ms_type: msSpecFilterOptions?.ms_type,
      ion_mode: msSpecFilterOptions?.ion_mode,
    } as Content);
  }, [msSpecFilterOptions, setValue]);

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
              <SubMenu
                label={collapsed ? 'Cont' : 'Contibutor'}
                className="submenu"
              >
                {msSpecFilterOptions && (
                  <FilterTable
                    filterOptions={msSpecFilterOptions.contributor}
                    onSelect={(value, isChecked) =>
                      handleOnSelect(
                        'msSpecFilterOptions',
                        'contributor',
                        value,
                        isChecked,
                      )
                    }
                    style={{ height: '200px' }}
                  />
                )}
              </SubMenu>
              <SubMenu
                label={collapsed ? 'Inst' : 'Instrument Type'}
                className="submenu"
              >
                {msSpecFilterOptions && (
                  <FilterTable
                    filterOptions={msSpecFilterOptions.instrument_type}
                    onSelect={(value, isChecked) =>
                      handleOnSelect(
                        'msSpecFilterOptions',
                        'instrument_type',
                        value,
                        isChecked,
                      )
                    }
                    style={{ height: '200px' }}
                  />
                )}
              </SubMenu>
              <SubMenu
                label={collapsed ? 'Type' : 'MS Type'}
                className="submenu"
              >
                {msSpecFilterOptions && (
                  <FilterTable
                    filterOptions={msSpecFilterOptions.ms_type}
                    onSelect={(value, isChecked) =>
                      handleOnSelect(
                        'msSpecFilterOptions',
                        'ms_type',
                        value,
                        isChecked,
                      )
                    }
                  />
                )}
              </SubMenu>
              <SubMenu
                label={collapsed ? 'Ion' : 'Ion Mode'}
                className="submenu"
              >
                {msSpecFilterOptions && (
                  <FilterTable
                    filterOptions={msSpecFilterOptions.ion_mode}
                    onSelect={(value, isChecked) =>
                      handleOnSelect(
                        'msSpecFilterOptions',
                        'ion_mode',
                        value,
                        isChecked,
                      )
                    }
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

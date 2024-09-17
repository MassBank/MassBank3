import './SearchPanel.scss';

import { useCallback, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Button from '../../../basic/Button';
import referencePeakList from './utils/peakListExample';
import { Menu, Sidebar, SubMenu } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faBarcode,
  faChartColumn,
  faFlask,
  faList,
  faSignature,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';
import Content from '../../../../types/Content';
import FilterTable from './msSpecFilter/FilterTable';
import ValueCount from '../../../../types/ValueCount';

const peakListPattern =
  /^(\d+(\.\d+)* \d+(\.\d+)*)(\n\d+(\.\d+)* \d+(\.\d+)*)*$/;

type InputProps = {
  width: number;
  height: number;
  collapsed: boolean;
  msSpecFilterOptions: Content | undefined;
  // eslint-disable-next-line no-unused-vars
  onCollapse: (collapsed: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: FieldValues) => void;
};

function SearchPanel({
  width,
  height,
  collapsed,
  msSpecFilterOptions,
  onCollapse,
  onSubmit,
}: InputProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const errorLabelHeight = 30;
  const collapseButtonHeight = 40;
  const submitButtonHeight = 40;

  const handleOnCollapse = useCallback(() => {
    onCollapse(!collapsed);
  }, [collapsed, onCollapse]);

  const handleOnSubmit = useCallback(
    (data: FieldValues) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  useEffect(() => {
    setValue('msSpecFilterOptions', {
      contributor: msSpecFilterOptions?.contributor,
      instrument_type: msSpecFilterOptions?.instrument_type,
      ms_type: msSpecFilterOptions?.ms_type,
      ion_mode: msSpecFilterOptions?.ion_mode,
    });
  }, [msSpecFilterOptions, setValue]);

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
    <form onSubmit={handleSubmit((data) => handleOnSubmit(data))}>
      <div className="search-panel-container">
        <div
          className="collapse-button-container"
          style={{ height: collapseButtonHeight }}
        >
          <Button
            onClick={handleOnCollapse}
            child={<FontAwesomeIcon icon={collapsed ? faList : faAngleLeft} />}
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
              label={<FontAwesomeIcon icon={faSliders} />}
              suffix={collapsed ? '' : 'Basic Search'}
            ></SubMenu>
            <SubMenu
              label={<FontAwesomeIcon icon={faChartColumn} />}
              suffix={collapsed ? '' : 'Peaks'}
            >
              <SubMenu label="Similarity" className="submenu">
                <div className="input-container">
                  <textarea
                    placeholder="Enter a peak list: m/z and intensity, delimited by a space. For example:&#10;&#10;147.063 11&#10;303.05 999&#10;449.108 64&#10;465.102 588&#10;611.161 670"
                    {...register('peakListInputField', {
                      required: false,
                      pattern: peakListPattern,
                    })}
                    style={{
                      width,
                      height: 230 - errorLabelHeight,
                      resize: 'none',
                    }}
                  />
                  {errors.peakListInputField && (
                    <p
                      className="error-label"
                      style={{
                        width,
                        height: errorLabelHeight,
                      }}
                    >
                      Please enter a valid peak list.
                    </p>
                  )}
                </div>
                <Button
                  child={'Load Example'}
                  onClick={() => {
                    setValue(
                      'peakListInputField',
                      referencePeakList.join('\n'),
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                />
              </SubMenu>
              <SubMenu label="Peaks" className="submenu"></SubMenu>
              <SubMenu label="Peak Differences" className="submenu"></SubMenu>
            </SubMenu>
            <SubMenu
              label={<FontAwesomeIcon icon={faSignature} />}
              suffix={collapsed ? '' : 'InChI'}
            >
              <div className="input-container">
                <textarea
                  placeholder="InChi or InChIKey, Example:&#10;InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3 or &#10;KWILGNNWGSNMPA-UHFFFAOYSA-N"
                  {...register('inchiInputField', {
                    required: false,
                  })}
                  style={{
                    width,
                    height: 60,
                    resize: 'none',
                  }}
                />
              </div>
              <Button
                child={'Load Example'}
                onClick={() => {
                  setValue(
                    'inchiInputField',
                    'InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3',
                  );
                }}
              />
            </SubMenu>
            <SubMenu
              label={<FontAwesomeIcon icon={faBarcode} />}
              suffix={collapsed ? '' : 'SPLASH'}
            >
              <div className="input-container">
                <textarea
                  placeholder="Example:&#10;splash10-03fr-0900000000-035ec76d23650a15673b"
                  {...register('splashInputField', {
                    required: false,
                  })}
                  style={{
                    width,
                    height: 60,
                    resize: 'none',
                  }}
                />
              </div>
              <Button
                child={'Load Example'}
                onClick={() => {
                  setValue(
                    'splashInputField',
                    'splash10-03fr-0900000000-035ec76d23650a15673b',
                  );
                }}
              />
            </SubMenu>
            <SubMenu
              label={<FontAwesomeIcon icon={faFlask} />}
              suffix={collapsed ? '' : 'Mass Spectrometry'}
            >
              <SubMenu label="Contibutor" className="submenu">
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
              <SubMenu label="Instrument Type" className="submenu">
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
              <SubMenu label="MS Type" className="submenu">
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
              <SubMenu label="Ion Mode" className="submenu">
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
  );
}

export default SearchPanel;

import './SearchPanel.scss';

import { useCallback, useEffect } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import Button from '../../../../basic/Button';
import referencePeakList from './utils/peakListExample';
import { Menu, Sidebar, SubMenu } from 'react-pro-sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faBarcode,
  faChartColumn,
  faFlask,
  faList,
  faShareNodes,
  faSignature,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';
import Content from '../../../../../types/Content';
import ValueCount from '../../../../../types/ValueCount';
import FilterTable from './msSpecFilter/FilterTable';
import PeakSearch from './peakSearch/PeakSearch';
import StructureEditor from '../../../../basic/StructureEditor';

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
  const formMethods = useForm();
  const {
    getValues,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = formMethods;

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
    } as Content);
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
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit((data) => handleOnSubmit(data))}>
        <div className="search-panel-container">
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
                label={<FontAwesomeIcon icon={faSliders} />}
                suffix={collapsed ? '' : 'Basic Search'}
              >
                <div
                  className="basic-search-input-container"
                  style={{ width, height: 180 }}
                >
                  <div className="input-container">
                    <label>Compound Name</label>
                    <input
                      placeholder="For example: Rutin"
                      {...register('basicSearchFilterOptions.compoundName', {
                        required: false,
                      })}
                      style={{
                        width: width / 2 - 5,
                        height: 25,
                        resize: 'none',
                      }}
                    />
                    <Button
                      child={'Load Example'}
                      onClick={() =>
                        setValue(
                          'basicSearchFilterOptions.compoundName',
                          'Rutin',
                        )
                      }
                    />
                  </div>
                  <div className="input-container">
                    <label>Molecular Formula</label>
                    <input
                      placeholder="For example: C27H30O16"
                      {...register('basicSearchFilterOptions.formula', {
                        required: false,
                      })}
                      style={{
                        width: width / 2 - 5,
                        height: 25,
                        resize: 'none',
                      }}
                    />
                    <Button
                      child={'Load Example'}
                      onClick={() =>
                        setValue(
                          'basicSearchFilterOptions.formula',
                          'C27H30O16',
                        )
                      }
                    />
                  </div>
                  <div className="input-container">
                    <label>Exact Mass</label>
                    <input
                      placeholder="For example: 610.15338"
                      {...register('basicSearchFilterOptions.exactMass', {
                        required: false,
                        valueAsNumber: true,
                        min: 0,
                      })}
                      style={{
                        width: width / 2 - 5,
                        height: 25,
                        resize: 'none',
                      }}
                    />
                    <Button
                      child={'Load Example'}
                      onClick={() =>
                        setValue(
                          'basicSearchFilterOptions.exactMass',
                          '610.15338',
                        )
                      }
                    />
                  </div>
                  <div className="input-container">
                    <label>Mass Tolerance</label>
                    <input
                      placeholder="For example: 0.1"
                      {...register('basicSearchFilterOptions.massTolerance', {
                        required: false,
                        valueAsNumber: true,
                        min: 0,
                        value: 0.1,
                      })}
                      style={{
                        width: width / 2 - 5,
                        height: 25,
                        resize: 'none',
                      }}
                    />
                    <Button
                      child={'Load Example'}
                      onClick={() =>
                        setValue(
                          'basicSearchFilterOptions.massTolerance',
                          '0.1',
                        )
                      }
                    />
                  </div>
                </div>
              </SubMenu>
              <SubMenu
                label={<FontAwesomeIcon icon={faChartColumn} />}
                suffix={collapsed ? '' : 'Peaks'}
              >
                <SubMenu label="Similarity" className="submenu">
                  <div className="input-container">
                    <textarea
                      placeholder="Peak list: m/z and intensity, delimited by a space. For example:&#10;&#10;147.063 11&#10;303.05 999&#10;449.108 64&#10;465.102 588&#10;611.161 670"
                      {...register('similarity.peakListInputField', {
                        required: false,
                        pattern: peakListPattern,
                      })}
                      style={{
                        width,
                        height: 230 - errorLabelHeight,
                        resize: 'none',
                      }}
                    />
                    {errors['similarity.peakListInputField'] && (
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
                    onClick={() =>
                      setValue(
                        'similarity.peakListInputField',
                        referencePeakList.join('\n'),
                        {
                          shouldValidate: true,
                        },
                      )
                    }
                  />
                </SubMenu>
                <SubMenu label="Peaks" className="submenu">
                  <PeakSearch />
                </SubMenu>
                <SubMenu label="Peak Differences" className="submenu"></SubMenu>
              </SubMenu>
              <SubMenu
                label={<FontAwesomeIcon icon={faSignature} />}
                suffix={collapsed ? '' : 'InChI'}
              >
                <div className="input-container">
                  <textarea
                    placeholder="InChi or InChIKey, Example:&#10;IKGXIBQEEMLURG-NVPNHPEKSA-N"
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
                  onClick={() =>
                    setValue('inchiInputField', 'IKGXIBQEEMLURG-NVPNHPEKSA-N')
                  }
                />
              </SubMenu>
              <SubMenu
                label={<FontAwesomeIcon icon={faBarcode} />}
                suffix={collapsed ? '' : 'SPLASH'}
              >
                <div className="input-container">
                  <textarea
                    placeholder="Example:&#10;splash10-0wmi-0009506000-98ca7f7c8f3072af4481"
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
                  onClick={() =>
                    setValue(
                      'splashInputField',
                      'splash10-0wmi-0009506000-98ca7f7c8f3072af4481',
                    )
                  }
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
              <SubMenu
                label={<FontAwesomeIcon icon={faShareNodes} />}
                suffix={collapsed ? '' : 'Structure'}
              >
                <StructureEditor
                  onChange={(molfile: string) =>
                    setValue('structureInputField', molfile)
                  }
                  width={width}
                />
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

export default SearchPanel;

import './SearchPanel.scss';

import { useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Button from '../../../basic/Button';
import {
  referencePeakList,
  referenceSpectraList,
} from './utils/peakListExample';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
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

const peakListPattern =
  /^(\d+(\.\d+)* \d+(\.\d+)*)(\n\d+(\.\d+)* \d+(\.\d+)*)*$/;
const msbnkPattern =
  /^(MSBNK-[a-zA-Z0-9_]+-[a-zA-Z0-9_]+)(\nMSBNK-[a-zA-Z0-9_]+-[a-zA-Z0-9_]+)*$/;

type InputProps = {
  width: number;
  height: number;
  collapsed: boolean;
  // eslint-disable-next-line no-unused-vars
  onCollapse: (collapsed: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: FieldValues) => void;
};

function SearchPanel({
  width,
  height,
  collapsed,
  onCollapse,
  onSubmit,
}: InputProps) {
  const {
    register,
    handleSubmit,
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
          <Menu>
            <SubMenu
              label={<FontAwesomeIcon icon={faSliders} />}
              suffix={collapsed ? '' : 'Basic Search'}
            ></SubMenu>
            <SubMenu
              label={<FontAwesomeIcon icon={faChartColumn} />}
              suffix={collapsed ? '' : 'Peaks'}
            >
              <SubMenu label="Similarity">
                <SubMenu label="Peak List">
                  <div className="peak-list-input-container">
                    <textarea
                      placeholder="Enter a peak list: m/z and intensity, delimited by a space. For example:&#10;&#10;147.063 11&#10;303.05 999&#10;449.108 64&#10;465.102 588&#10;611.161 670"
                      {...register('peakListInputField', {
                        required: true,
                        pattern: peakListPattern,
                      })}
                      style={{
                        width,
                        height: height / 3 - errorLabelHeight,
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
                <SubMenu label="Reference Spectra">
                  <div className="reference-spectra-list-input-container">
                    <textarea
                      placeholder="Enter reference spectra. For example:&#10;&#10;MSBNK-IPB_Halle-PB001341&#10;MSBNK-IPB_Halle-PB006202&#10;MSBNK-IPB_Halle-PB006203&#10;MSBNK-IPB_Halle-PB001342&#10;MSBNK-IPB_Halle-PB001343"
                      {...register('referenceSpectraInputField', {
                        required: false,
                        pattern: msbnkPattern,
                      })}
                      style={{
                        width,
                        height: height / 3 - errorLabelHeight,
                        resize: 'none',
                      }}
                    />
                    {errors.referenceSpectraInputField && (
                      <p
                        className="error-label"
                        style={{
                          width,
                          height: errorLabelHeight,
                        }}
                      >
                        Please enter a valid reference spectra list.
                      </p>
                    )}
                  </div>
                  <Button
                    child={'Load Example'}
                    onClick={() => {
                      setValue(
                        'referenceSpectraInputField',
                        referenceSpectraList.join('\n'),
                        {
                          shouldValidate: true,
                        },
                      );
                    }}
                  />
                </SubMenu>
              </SubMenu>
              <MenuItem>Peaks</MenuItem>
              <MenuItem>Peak Differences</MenuItem>
            </SubMenu>

            <SubMenu
              label={<FontAwesomeIcon icon={faSignature} />}
              suffix={collapsed ? '' : 'InChiKey'}
            ></SubMenu>
            <SubMenu
              label={<FontAwesomeIcon icon={faBarcode} />}
              suffix={collapsed ? '' : 'SPLASH'}
            ></SubMenu>
            <SubMenu
              label={<FontAwesomeIcon icon={faFlask} />}
              suffix={collapsed ? '' : 'Mass Spectrometry'}
            ></SubMenu>
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

import './SearchPanel.scss';

import { useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Button from '../../../basic/Button';
import {
  referencePeakList,
  referenceSpectraList,
} from './utils/peakListExample';

const peakListPattern =
  /^(\d+(\.\d+)* \d+(\.\d+)*)(\n\d+(\.\d+)* \d+(\.\d+)*)*$/;
const msbnkPattern =
  /^(MSBNK-[a-zA-Z0-9_]+-[a-zA-Z0-9_]+)(\nMSBNK-[a-zA-Z0-9_]+-[a-zA-Z0-9_]+)*$/;

type InputProps = {
  width: number;
  height: number;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: FieldValues) => void;
};

function SearchPanel({ width, height, onSubmit }: InputProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleOnSubmit = useCallback(
    (data: FieldValues) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  const errorLabelHeight = 30;

  return (
    <form onSubmit={handleSubmit((data) => handleOnSubmit(data))}>
      <div className="search-panel-container" style={{ width, height }}>
        <div className="search-panel-container-inner">
          <div className="peak-list-input-container">
            <textarea
              placeholder="Enter a peak list: m/z and intensity, delimited by a space. For example:&#10;&#10;147.063 11&#10;303.05 999&#10;449.108 64&#10;465.102 588&#10;611.161 670"
              {...register('peakListInputField', {
                required: true,
                pattern: peakListPattern,
              })}
              style={{
                width: width / 2,
                height: height - errorLabelHeight,
                resize: 'none',
              }}
            />

            {errors.peakListInputField && (
              <p
                className="error-label"
                style={{
                  width: width / 2,
                  height: errorLabelHeight,
                }}
              >
                Please enter a valid peak list.
              </p>
            )}
          </div>
          <div className="reference-spectra-list-input-container">
            <textarea
              placeholder="Enter reference spectra. For example:&#10;&#10;MSBNK-IPB_Halle-PB001341&#10;MSBNK-IPB_Halle-PB006202&#10;MSBNK-IPB_Halle-PB006203&#10;MSBNK-IPB_Halle-PB001342&#10;MSBNK-IPB_Halle-PB001343"
              {...register('referenceSpectraInputField', {
                required: false,
                pattern: msbnkPattern,
              })}
              style={{
                width: width / 2,
                height: height - errorLabelHeight,
                resize: 'none',
              }}
            />
            {errors.referenceSpectraInputField && (
              <p
                className="error-label"
                style={{
                  width: width / 2,
                  height: errorLabelHeight,
                }}
              >
                Please enter a valid reference spectra list.
              </p>
            )}
          </div>
        </div>
        <div className="search-panel-button-container">
          <Button
            child={'Load Example'}
            onClick={() => {
              setValue('peakListInputField', referencePeakList.join('\n'), {
                shouldValidate: true,
              });
              setValue(
                'referenceSpectraInputField',
                referenceSpectraList.join('\n'),
                {
                  shouldValidate: true,
                },
              );
            }}
          />
          <input type="submit" value="Search" className="submit-input" />
        </div>
      </div>
    </form>
  );
}

export default SearchPanel;

import './SearchPanel.scss';

import { useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

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
    formState: { errors },
  } = useForm();

  const handleOnSubmit = useCallback(
    (data: FieldValues) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  const errorLabelHeight = 30;
  const peakListPattern = /^(\d+\.\d+ \d+)(\n\d+\.\d+ \d+)*$/;
  const msbnkPattern =
    /^(MSBNK-[a-zA-Z0-9_]+-[a-zA-Z0-9_]+)(\nMSBNK-[a-zA-Z0-9_]+-[a-zA-Z0-9_]+)*$/;

  return (
    <form onSubmit={handleSubmit((data) => handleOnSubmit(data))}>
      <div className="search-panel-container" style={{ width, height }}>
        <div className="search-panel-container-inner">
          <div className="peak-list-input-container">
            <textarea
              placeholder="Enter a peak list: m/z and relative intensities(0-999), delimited by a space. For example:&#10;147.063 11&#10;303.05 999&#10;449.108 64&#10;465.102 588&#10;611.161 670"
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
              placeholder="Enter reference spectra:&#10;MSBNK-IPB_Halle-PB001341&#10;MSBNK-IPB_Halle-PB006202&#10;MSBNK-IPB_Halle-PB006203&#10;MSBNK-IPB_Halle-PB001342&#10;MSBNK-IPB_Halle-PB001343"
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
        <div className="search-panel-submit-button-container">
          <input type="submit" value="Search" />
        </div>
      </div>
    </form>
  );
}

export default SearchPanel;

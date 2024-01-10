import './Input.scss';

import {
  ChangeEvent,
  CSSProperties,
  RefObject,
  useCallback,
  useMemo,
} from 'react';

type InputProps = {
  type: React.HTMLInputTypeAttribute;
  onChange: Function;
  defaultValue?: string | number;
  label?: string;
  min?: number;
  max?: number;
  inputWidth?: string;
  className?: string;
  placeholder?: string;
  style?: CSSProperties;
  fontStyle?: CSSProperties;
  ref?: RefObject<HTMLInputElement>;
};

function Input({
  type,
  onChange,
  defaultValue,
  label,
  min,
  max,
  inputWidth = '80px',
  className = 'Input',
  placeholder = '',
  style,
  fontStyle,
  ref,
}: InputProps) {
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (type === 'file') {
        onChange(e.target.files);
      } else {
        onChange(e.target.value);
      }
    },
    [onChange, type],
  );

  return useMemo(
    () => (
      <div className={className}>
        {label && <label style={fontStyle}>{`${label}`}</label>}
        <input
          ref={ref}
          type={type}
          onChange={handleOnChange}
          defaultValue={defaultValue}
          placeholder={placeholder}
          min={min}
          max={max}
          style={
            {
              ...style,
              ...fontStyle,
              '--inputWidth': inputWidth,
            } as React.CSSProperties
          }
        />
      </div>
    ),
    [
      className,
      defaultValue,
      fontStyle,
      handleOnChange,
      inputWidth,
      label,
      max,
      min,
      placeholder,
      ref,
      style,
      type,
    ],
  );
}

export default Input;

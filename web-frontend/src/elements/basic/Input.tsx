import './Input.scss';

import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  RefObject,
  useCallback,
  useMemo,
} from 'react';

type InputProps = {
  type: React.HTMLInputTypeAttribute;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  onKeyDown: () => void;
  defaultValue?: string | number;
  label?: string;
  min?: number;
  max?: number;
  inputWidth?: string;
  className?: string;
  placeholder?: string;
  style?: CSSProperties;
  fontStyle?: CSSProperties;
};

function Input({
  type,
  onChange,
  onKeyDown,
  defaultValue,
  label,
  min,
  max,
  inputWidth = '80px',
  className = 'Input',
  placeholder = '',
  style,
  fontStyle,
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

  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onKeyDown();
      }
    },
    [onKeyDown],
  );

  return useMemo(
    () => (
      <div className={className}>
        {label && <label style={fontStyle}>{`${label}`}</label>}
        <input
          type={type}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
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
      handleOnKeyDown,
      inputWidth,
      label,
      max,
      min,
      placeholder,
      style,
      type,
    ],
  );
}

export default Input;

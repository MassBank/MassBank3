import './Input.scss';

import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type InputProps = {
  type: React.HTMLInputTypeAttribute;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  onKeyDown?: () => void;
  value?: string | number;
  label?: string;
  min?: number;
  max?: number;
  step?: number | 'any';
  className?: string;
  placeholder?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  fontStyle?: CSSProperties;
};

function Input({
  type,
  onChange,
  onKeyDown = () => {},
  value,
  label,
  min,
  max,
  step = 'any',
  className = 'Input',
  placeholder = '',
  style = { width: '100%' },
  inputStyle = { width: '100%' },
  fontStyle,
}: InputProps) {
  const [internalValue, setInternalValue] = useState<
    string | number | undefined
  >(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setInternalValue(e.target.value);
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
      <div className={className} style={style}>
        {label && <label style={fontStyle}>{`${label}`}</label>}
        <input
          type={type}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          value={internalValue}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          style={
            {
              ...inputStyle,
              ...fontStyle,
            } as React.CSSProperties
          }
        />
      </div>
    ),
    [
      className,
      fontStyle,
      handleOnChange,
      handleOnKeyDown,
      inputStyle,
      internalValue,
      label,
      max,
      min,
      placeholder,
      step,
      style,
      type,
    ],
  );
}

export default Input;

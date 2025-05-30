import { useCallback, useEffect, useMemo, useState } from 'react';
import type { InputNumberProps, SliderSingleProps } from 'antd';
import { Slider as SliderAntD } from 'antd';
import { Content } from 'antd/es/layout/layout';

type InputProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  width?: number;
  height?: number;
};

function Slider({
  min,
  max,
  value,
  width = 150,
  height,
  onChange,
}: InputProps) {
  const [inputValue, setInputValue] = useState(1);

  const handleOnChange: InputNumberProps['onChange'] = useCallback(
    (newValue: unknown) => {
      setInputValue(newValue as number);
      onChange(newValue as number);
    },
    [onChange],
  );

  useEffect(() => {
    if (value >= min && value <= max) {
      setInputValue(value);
    } else {
      setInputValue(min);
    }
  }, [max, min, value]);

  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (
    value,
  ) => `Minimal relative intensity: ${value}`;

  return useMemo(
    () => (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
        }}
      >
        <SliderAntD
          min={min}
          max={max}
          onChange={handleOnChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
          style={{ width }}
          tooltip={{ formatter }}
        />
      </Content>
    ),
    [handleOnChange, height, inputValue, max, min, width],
  );
}

export default Slider;

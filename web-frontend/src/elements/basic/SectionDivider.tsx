import { Divider as DividerAntD, DividerProps } from 'antd';
import { CSSProperties } from 'react';

type InputProps = {
  label: string;
  componentStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  orientation?: DividerProps['orientation'];
};

function SectionDivider({
  label,
  componentStyle = {},
  labelStyle = {},
  orientation = 'left',
}: InputProps) {
  return (
    <DividerAntD
      style={{
        color: 'rgb(5, 109, 220)',
        borderColor: 'rgb(5, 109, 220)',
        marginTop: 30,
        marginBottom: 30,
        ...componentStyle,
      }}
      orientation={orientation}
    >
      <p
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          color: 'rgb(5, 109, 220)',
          ...labelStyle,
        }}
      >
        {label}
      </p>
    </DividerAntD>
  );
}

export default SectionDivider;

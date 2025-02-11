import { CSSProperties, useMemo } from 'react';

type InputProps = {
  value: string;
  style?: CSSProperties;
};

function LabelWrapper({
  value,
  style = {
    textWrap: 'pretty',
  },
}: InputProps) {
  return useMemo(() => <label style={style}>{value}</label>, [style, value]);
}

export default LabelWrapper;

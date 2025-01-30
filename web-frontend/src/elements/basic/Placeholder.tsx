import './Placeholder.scss';

import { CSSProperties, JSX } from 'react';

type InputProps = {
  child: string | JSX.Element;
  style?: CSSProperties;
};

function Placeholder({ child, style }: InputProps) {
  return (
    <div className="placeholder" style={style}>
      {child}
    </div>
  );
}

export default Placeholder;

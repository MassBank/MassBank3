import './Button.scss';

import { CSSProperties, MouseEvent, useCallback, useMemo } from 'react';

type InputProps = {
  // eslint-disable-next-line no-unused-vars
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  child: string | JSX.Element;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  style?: CSSProperties;
  buttonStyle?: CSSProperties;
};

function Button({
  onClick = () => {},
  child = '',
  className = 'Button',
  disabled = false,
  type = 'button',
  title = '',
  style,
  buttonStyle,
}: InputProps) {
  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    },
    [onClick],
  );

  return useMemo(
    () => (
      <div className={className} style={style}>
        <button
          onClick={handleOnClick}
          disabled={disabled}
          type={type}
          title={title}
          style={buttonStyle}
        >
          {child}
        </button>
      </div>
    ),
    [
      buttonStyle,
      child,
      className,
      disabled,
      handleOnClick,
      style,
      title,
      type,
    ],
  );
}

export default Button;

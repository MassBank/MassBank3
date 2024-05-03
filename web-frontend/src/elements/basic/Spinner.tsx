import './Spinner.scss';
import Button from './Button';
import { CSSProperties, MouseEvent, useEffect, useMemo, useState } from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';

type InputProps = {
  // eslint-disable-next-line no-unused-vars
  onClickCancel?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  classNameButton?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
  buttonStyle?: CSSProperties;
  showTimer?: boolean;
  spinnerWidth?: number;
  spinnerHeight?: number;
};

function Spinner({
  onClickCancel = () => {},
  className = 'Spinner',
  classNameButton,
  buttonText = 'Cancel',
  buttonDisabled = false,
  buttonStyle,
  showTimer,
  spinnerWidth = 100,
  spinnerHeight = 100,
  ...props
}: InputProps) {
  const [timer, setTimer] = useState<{
    totalSeconds: number;
    seconds: number;
    minutes: number;
  }>({
    totalSeconds: 0,
    seconds: 0,
    minutes: 0,
  });

  useEffect(() => {
    if (showTimer) {
      const timeout = setTimeout(function () {
        const totalSeconds = timer.totalSeconds + 1;
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60);
        setTimer({ totalSeconds, seconds, minutes });
      }, 1000);

      // clear timeout if the component is unmounted
      return () => clearTimeout(timeout);
    }
  }, [showTimer, timer]);

  return useMemo(
    () => (
      <div className={className}>
        <MagnifyingGlass
          width={spinnerWidth}
          height={spinnerHeight}
          {...props}
        />
        {showTimer && (
          <p
            style={{ marginTop: 10 }}
          >{`${timer.minutes} min : ${timer.seconds} s`}</p>
        )}
        {buttonText && onClickCancel && (
          <Button
            child={buttonText}
            onClick={onClickCancel}
            className={classNameButton}
            disabled={buttonDisabled}
            style={{
              ...(buttonDisabled
                ? {
                    border: 'none',
                    backgroundColor: 'transparent',
                    display: 'none',
                  }
                : undefined),
              ...buttonStyle,
            }}
          />
        )}
      </div>
    ),
    [
      buttonDisabled,
      buttonStyle,
      buttonText,
      className,
      classNameButton,
      onClickCancel,
      props,
      showTimer,
      spinnerHeight,
      spinnerWidth,
      timer.minutes,
      timer.seconds,
    ],
  );
}

export default Spinner;

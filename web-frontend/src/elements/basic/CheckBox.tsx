import './CheckBox.scss';
import {
  CSSProperties,
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type InputProps = {
  defaultValue: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (isChecked: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  isCheckedOutside?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

function CheckBox({
  defaultValue,
  onChange,
  isCheckedOutside,
  label,
  className = 'CheckBox',
  style,
}: InputProps) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultValue);

  useEffect(() => {
    if (isCheckedOutside !== undefined) {
      setIsChecked(isCheckedOutside);
    }
  }, [isCheckedOutside]);

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // e.preventDefault();
      e.stopPropagation();

      setIsChecked(!isChecked);
      onChange(!isChecked);
    },
    [isChecked, onChange],
  );

  return useMemo(
    () => (
      <div className={className} style={style}>
        <input type="checkbox" checked={isChecked} onChange={handleOnChange} />
        <label>{label}</label>
      </div>
    ),
    [className, handleOnChange, isChecked, label, style],
  );
}

export default CheckBox;

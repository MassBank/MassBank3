import { MouseEvent } from 'react';
import DownloadFormat from '../../types/DownloadFormat';
import { CSSProperties } from 'react';

type InputProps = {
  label: string;
  format: DownloadFormat;
  onDownload: (format: DownloadFormat) => void;
  labelStyle?: CSSProperties;
};

function DownloadOptionLabel({
  label,
  format,
  onDownload,
  labelStyle = {},
}: InputProps) {
  return (
    <label
      onClick={(e: MouseEvent<HTMLLabelElement>) => {
        e.preventDefault();
        onDownload(format);
      }}
      style={{
        width: 100,
        marginLeft: 10,
        marginRight: 10,
        ...labelStyle,
      }}
    >
      {label}
    </label>
  );
}

export default DownloadOptionLabel;

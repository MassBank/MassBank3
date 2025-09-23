import { MenuProps } from 'antd';
import DownloadOptionLabel from './DownloadOptionLabel';
import DownloadFormat from '../../types/DownloadFormat';

type InputProps = {
  onDownload: (format: DownloadFormat) => void;
};

function DownloadMenuItems({ onDownload }: InputProps) {
  const items: MenuProps['items'] = [
    {
      key: '0_nist_msp_download',
      label: (
        <DownloadOptionLabel
          label="NIST MSP"
          format="nist_msp"
          onDownload={onDownload}
        />
      ),
    },
    {
      key: '1_riken_msp_download',
      label: (
        <DownloadOptionLabel
          label="RIKEN MSP"
          format="riken_msp"
          onDownload={onDownload}
        />
      ),
    },
  ];

  return items;
}

export default DownloadMenuItems;

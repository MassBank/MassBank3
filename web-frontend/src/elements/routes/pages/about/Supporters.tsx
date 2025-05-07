import { Content } from 'antd/es/layout/layout';
import { memo } from 'react';

import denbiLogo from '../../../../assets/deNBI.png';
import eawagLogo from '../../../../assets/EAWAG_logo.png';
import uniLuxLogo from '../../../../assets/UniLu-LCSB_Logo.png';
import ipbLogo from '../../../../assets/IPB.png';
import normanLogo from '../../../../assets/NORMAN.png';
import fnrLogo from '../../../../assets/fnr_logo.png';
import hbm4euLogo from '../../../../assets/HBM4EU_logo.png';
import nfdi4chemLogo from '../../../../assets/nfdi4chem_logo.png';
import ufzLogo from '../../../../assets/UFZ.png';

const logos = [
  denbiLogo,
  eawagLogo,
  fnrLogo,
  ipbLogo,
  normanLogo,
  ufzLogo,
  uniLuxLogo,
  hbm4euLogo,
  nfdi4chemLogo,
];

function Supporters() {
  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridGap: 10,
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {logos.map((logo, i) => (
          <img src={logo} style={{ width: 200 }} key={'supporter-logo-' + i} />
        ))}
      </Content>
    </Content>
  );
}

export default memo(Supporters);

import { Content } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';
import { memo } from 'react';

import nfdi4chemLogo from '../../assets/nfdi4chem_logo.png';

function AcknowledgementNFDI4Chem() {
  return (
    <Content
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img src={nfdi4chemLogo} style={{ height: 250 }} alt="NFDI4Chem logo" />
      <Paragraph style={{ fontWeight: 'bolder' }}>
        This project is funded by the DFG (
        {
          <a
            href="https://www.dfg.de/de"
            target="_blank"
            style={{ color: 'black', textDecoration: 'underline' }}
          >
            Deutsche Forschungsgesellschaft
          </a>
        }
        ) under the NFDI4Chem (
        {
          <a
            href="https://www.nfdi4chem.de/"
            target="_blank"
            style={{ color: 'black', textDecoration: 'underline' }}
          >
            National Research Data Infrastructure for Chemistry
          </a>
        }
        ) project. <br />
        Project number: 441958208.
      </Paragraph>
    </Content>
  );
}

export default memo(AcknowledgementNFDI4Chem);

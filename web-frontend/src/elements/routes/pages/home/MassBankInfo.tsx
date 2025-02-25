import { memo } from 'react';
import { Content } from 'antd/es/layout/layout';
import Typography from 'antd/es/typography';
const { Paragraph } = Typography;
import massbankLogo from '../../../../assets/logo.svg';

function MassBankInfo() {
  return (
    <Content
      style={{
        width: '100%',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      <img
        src={massbankLogo}
        style={{
          height: 70,
          marginTop: 10,
          marginBottom: 40,
        }}
        key={'massbank-logo-overview'}
      />
      <Paragraph
        style={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        Welcome to MassBank, an open source mass spectral library for the
        identification of small chemical molecules of metabolomics, exposomics
        and environmental relevance.
      </Paragraph>
    </Content>
  );
}

export default memo(MassBankInfo);

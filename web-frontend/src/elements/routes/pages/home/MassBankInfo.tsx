import { memo, useMemo } from 'react';
import { Content } from 'antd/es/layout/layout';
import massbankLogo from '../../../../assets/logo.svg';
import { usePropertiesContext } from '../../../../context/properties/properties';
import FreeText from '../../../basic/FreeText';

function MassBankInfo() {
  const { homepageIntroText } = usePropertiesContext();

  return useMemo(
    () => (
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
          key="massbank-logo-overview"
          alt="MassBank logo"
        />
        {<FreeText text={homepageIntroText} />}
      </Content>
    ),
    [homepageIntroText],
  );
}

export default memo(MassBankInfo);

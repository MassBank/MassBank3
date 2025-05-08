import { memo, useMemo } from 'react';
import { Content } from 'antd/es/layout/layout';
import Typography from 'antd/es/typography';
const { Paragraph, Text } = Typography;
import massbankLogo from '../../../../assets/logo.svg';
import { usePropertiesContext } from '../../../../context/properties/properties';

function splitAndAddLineBreaks(str: string) {
  const split = str.split('\n');

  return split.length === 1 ? (
    <Text>
      {split[0]}
      <br />
    </Text>
  ) : (
    split.map((subStr, i) => (
      <Text key={i + '_' + subStr}>
        {subStr}
        <br />
      </Text>
    ))
  );
}
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
          key={'massbank-logo-overview'}
        />
        <Paragraph
          style={{
            width: '100%',
            textAlign: 'center',
          }}
        >
          {splitAndAddLineBreaks(homepageIntroText)}
        </Paragraph>
      </Content>
    ),
    [homepageIntroText],
  );
}

export default memo(MassBankInfo);

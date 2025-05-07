import { Content } from 'antd/es/layout/layout';
import { useMemo } from 'react';
import { usePropertiesContext } from '../../../../context/properties/properties';
import Paragraph from 'antd/es/typography/Paragraph';

function Imprint() {
  const { distributorText, distributorUrl } = usePropertiesContext();

  return useMemo(
    () => (
      <Content style={{ padding: 20 }}>
        <Paragraph>{distributorText}</Paragraph>
        <Paragraph>
          Visit the{' '}
          {
            <a
              href={distributorUrl}
              target="_blank"
              style={{ textDecoration: 'underline', color: 'black' }}
            >
              distributor's website
            </a>
          }{' '}
          for more information.
        </Paragraph>
      </Content>
    ),
    [distributorText, distributorUrl],
  );
}

export default Imprint;

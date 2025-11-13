import { useMemo } from 'react';
import { Content } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';

function CitationText() {
  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          padding: 20,
        }}
      >
        <Paragraph
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ width: '100%', textAlign: 'left' }}>
            Please cite MassBank using the following reference:
          </Text>
          <br />
          <Text
            style={{
              width: '100%',
              textAlign: 'left',
              paddingLeft: 30,
            }}
          >
            Steffen Neumann, René Meier, Michael Wenk, Anjana Elapavalore,
            Takaaki Nishioka, Tobias Schulze, Michael Stravs, Hiroshi Tsugawa,
            Fumio Matsuda, Emma L Schymanski, MassBank: an open and FAIR mass
            spectral data resource, Nucleic Acids Research, 2025;, gkaf1193,{' '}
            <a href="https://doi.org/10.1093/nar/gkaf1193" target="_blank">
              https://doi.org/10.1093/nar/gkaf1193
            </a>
          </Text>
        </Paragraph>
      </Content>
    ),
    [],
  );
}

export default CitationText;

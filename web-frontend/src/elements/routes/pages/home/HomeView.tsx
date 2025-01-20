import Layout, { Content, Header } from 'antd/es/layout/layout';
import { useRef } from 'react';
import AccessionSearchInputField from '../../../common/AccessionSearchInputField';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import { Helmet } from 'react-helmet';

const accessionSearchInputFieldHeight = 50;

function HomeView() {
  const ref = useRef(null);
  const { height } = useContainerDimensions(ref);

  return (
    <>
      <Helmet>
        <title>MassBank Europe</title>
        <meta
          name="google-site-verification"
          content="4aoZgYg2lHeh7TlOxtyVzjHa3YJirrsEHPqwSU3luoU"
        />
      </Helmet>
      <Layout
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Header
          style={{
            width: '100%',
            height: accessionSearchInputFieldHeight,
            padding: 0,
          }}
        >
          <AccessionSearchInputField
            width="100%"
            height={accessionSearchInputFieldHeight}
          />
        </Header>
        <Content
          style={{
            width: '100%',
            height: height - accessionSearchInputFieldHeight,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p style={{ fontWeight: 'bold', fontSize: 18 }}>
            Welcome to MassBank!
          </p>
          <p style={{ textAlign: 'center' }}>
            MassBank is a community effort and you are invited to contribute.
            Please refer to our contributor documentation and get in touch via
            github or email.
          </p>
        </Content>
      </Layout>
    </>
  );
}

export default HomeView;

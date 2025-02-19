import Layout, { Content, Header } from 'antd/es/layout/layout';
import { useRef } from 'react';
import useContainerDimensions from '../../../../utils/useContainerDimensions';
import AccessionSearchInputField from '../../../common/AccessionSearchInputField';
import News from '../../../common/News';
import SectionDivider from '../../../basic/SectionDivider';
import accessionSearchInputFieldHeight from '../../../../constants/accessionSearchInputFieldHeight';

function HomeView() {
  const ref = useRef(null);
  const { height } = useContainerDimensions(ref);

  return (
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
          display: 'block',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'scroll',
        }}
      >
        <Content style={{ width: '100%', textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold', fontSize: 18 }}>
            Welcome to MassBank!
          </p>
          <p>
            MassBank is a community effort and you are invited to contribute.
            Please refer to our contributor documentation and get in touch via
            github or email.
          </p>
        </Content>
        <SectionDivider label="News" />
        <News />
      </Content>
    </Layout>
  );
}

export default HomeView;

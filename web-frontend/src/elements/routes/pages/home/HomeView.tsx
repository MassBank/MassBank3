import Layout, { Content } from 'antd/es/layout/layout';
import { useMemo, useRef } from 'react';
import News from '../../../common/News';
import SectionDivider from '../../../basic/SectionDivider';
import AcknowledgementNFDI4Chem from '../../../common/AcknowledgementNFDI4Chem';
import Segmented from '../../../basic/Segmented';
import QuickSearch from './QuickSearch';
import { Typography } from 'antd';
const { Paragraph, Title } = Typography;

function HomeView() {
  const ref = useRef(null);

  return useMemo(() => {
    const elements: JSX.Element[] = [];
    elements.push(
      <Typography style={{ textAlign: 'center' }}>
        <Title>Welcome to MassBank</Title>
        <Paragraph>
          MassBank is a community effort and you are invited to contribute.
          Please refer to our contributor documentation and get in touch via
          github or email.
        </Paragraph>
      </Typography>,
    );
    elements.push(
      <Content>
        <SectionDivider label="Quick Search" />
        <QuickSearch />
      </Content>,
    );
    elements.push(
      <Content>
        <SectionDivider label="Latest News" />
        <News />
      </Content>,
    );
    elements.push(
      <Content>
        <SectionDivider label="Funding" />
        <AcknowledgementNFDI4Chem />
      </Content>,
    );

    const elementLabels = ['Welcome', 'Quick Search', 'Latest News', 'Funding'];

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
        <Segmented elements={elements} elementLabels={elementLabels} />
      </Layout>
    );
  }, []);
}

export default HomeView;

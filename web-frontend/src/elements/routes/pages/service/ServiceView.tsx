import Layout, { Content } from 'antd/es/layout/layout';
import { useMemo } from 'react';
import Segmented from '../../../basic/Segmented';
import SectionDivider from '../../../basic/SectionDivider';
import ServiceStatusView from './ServiceStatusView';
import Validation from './Validation';

function ServiceView() {
  return useMemo(() => {
    const serviceStatus = (
      <Content>
        <SectionDivider label="Service Status" />
        <ServiceStatusView />
      </Content>
    );
    const validation = (
      <Content>
        <SectionDivider label="Validation" />
        <Validation />
      </Content>
    );

    const elements = [serviceStatus, validation];

    const elementLabels = ['Service Status', 'Validation'];
    return (
      <Layout
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Content
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Segmented elements={elements} elementLabels={elementLabels} />
        </Content>
      </Layout>
    );
  }, []);
}

export default ServiceView;

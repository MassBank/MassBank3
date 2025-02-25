import { useMemo } from 'react';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import SectionDivider from '../../../basic/SectionDivider';
import ServiceStatusView from './ServiceStatusView';
import Segmented from '../../../basic/Segmented';
import Imprint from './Imprint';
import Acknowledgement from './Acknowledgement';
import InfoText from './InfoText';
import Supporters from './Supporters';

function AboutView() {
  const elements = useMemo(() => {
    const infoText = <InfoText />;

    const serviceStatus = (
      <Content>
        <SectionDivider label="Service Status" />
        <ServiceStatusView />
      </Content>
    );

    const acknowledgement = (
      <Content>
        <SectionDivider label="Acknowledgement" />
        <Acknowledgement />
      </Content>
    );

    const supporters = (
      <Content>
        <SectionDivider label="Supporters" />
        <Supporters />
      </Content>
    );

    const imprint = (
      <Content>
        <SectionDivider label="Imprint" />
        <Imprint />
      </Content>
    );

    return [infoText, serviceStatus, acknowledgement, supporters, imprint];
  }, []);

  const elementLabels = useMemo(
    () => [
      'Information',
      'Service Status',
      'Acknowledgement',
      'Supporters',
      'Imprint',
    ],
    [],
  );

  return useMemo(
    () => (
      <Layout
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Segmented elements={elements} elementLabels={elementLabels} />
      </Layout>
    ),
    [elementLabels, elements],
  );
}

export default AboutView;

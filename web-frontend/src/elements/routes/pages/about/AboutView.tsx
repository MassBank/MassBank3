import { useMemo, useRef } from 'react';
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
  const ref = useRef(null);

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

    return [infoText, serviceStatus, supporters, acknowledgement, imprint];
  }, []);

  const elementLabels = useMemo(
    () => [
      'Information',
      'Service Status',
      'Supporters',
      'Acknowledgement',
      'Imprint',
    ],
    [],
  );

  return useMemo(
    () => (
      <Layout
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Segmented
          elements={elements}
          elementLabels={elementLabels}
          width="100%"
          height="100%"
        />
      </Layout>
    ),
    [elementLabels, elements],
  );
}

export default AboutView;

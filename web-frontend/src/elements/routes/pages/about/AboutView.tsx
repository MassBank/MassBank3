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
import Text from 'antd/es/typography/Text';

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

    const accessibilty = (
      <Content>
        <SectionDivider label="Accessibility" />
        <Content style={{ width: '100%', padding: 20 }}>
          <Text>
            These websites are currently in a re-design process to make it
            accessible to all users. The aim is to follow the Web Content
            Accessibility Guidelines (WCAG 2.1/2.2 AA) to ensure that all
            people, including those with disabilities, are able to use this
            service without restriction.
          </Text>
        </Content>
      </Content>
    );

    const imprint = (
      <Content>
        <SectionDivider label="Imprint" />
        <Imprint />
      </Content>
    );

    return [
      infoText,
      serviceStatus,
      acknowledgement,
      supporters,
      accessibilty,
      imprint,
    ];
  }, []);

  const elementLabels = useMemo(
    () => [
      'Information',
      'Service Status',
      'Acknowledgement',
      'Supporters',
      'Accessibilty',
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

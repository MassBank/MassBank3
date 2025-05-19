import Layout, { Content } from 'antd/es/layout/layout';
import { memo } from 'react';
import News from '../../../common/News';
import SectionDivider from '../../../basic/SectionDivider';
import AcknowledgementNFDI4Chem from '../../../common/AcknowledgementNFDI4Chem';
import Segmented from '../../../basic/Segmented';
import QuickSearch from './QuickSearch';
import MassBankInfo from './MassBankInfo';
import FeaturesOverview from './FeaturesOverview';
import { usePropertiesContext } from '../../../../context/properties/properties';
import FreeText from '../../../basic/FreeText';

function HomeView() {
  const {
    homepageNewsSectionText,
    homepageFundingSectionText,
    homepageAdditionalSectionName,
    homepageAdditionalSectionText,
  } = usePropertiesContext();

  const elements: JSX.Element[] = [];
  elements.push(<MassBankInfo />);
  elements.push(
    <Content>
      <SectionDivider label="Features" />
      <FeaturesOverview />
    </Content>,
  );
  elements.push(
    <Content>
      <SectionDivider label="Quick Search" />
      <QuickSearch />
    </Content>,
  );

  if (homepageNewsSectionText !== '') {
    if (homepageNewsSectionText !== 'disabled') {
      elements.push(
        <Content>
          <SectionDivider label="Latest News" />
          <FreeText
            text={homepageNewsSectionText}
            style={{ textAlign: 'left' }}
          />
        </Content>,
      );
    }
  } else {
    elements.push(
      <Content>
        <SectionDivider label="Latext News" />
        <News />
      </Content>,
    );
  }

  if (homepageFundingSectionText !== '') {
    if (homepageFundingSectionText !== 'disabled') {
      elements.push(
        <Content>
          <SectionDivider label="Funding" />
          <FreeText
            text={homepageFundingSectionText}
            style={{ textAlign: 'left' }}
          />
        </Content>,
      );
    }
  } else {
    elements.push(
      <Content>
        <SectionDivider label="Funding" />
        <AcknowledgementNFDI4Chem />
      </Content>,
    );
  }

  if (
    homepageAdditionalSectionName !== '' &&
    homepageAdditionalSectionText !== ''
  ) {
    elements.push(
      <Content>
        <SectionDivider label={homepageAdditionalSectionName} />
        <FreeText
          text={homepageAdditionalSectionText}
          style={{ textAlign: 'left' }}
        />
      </Content>,
    );
  }

  const elementLabels = [
    'MassBank',
    'Features',
    'Quick Search',
    'Latest News',
    'Funding',
  ];

  return (
    <Layout
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
}

export default memo(HomeView);

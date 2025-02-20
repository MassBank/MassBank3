import { useMemo, useRef } from 'react';
import { Layout, List, Typography } from 'antd';
const { Paragraph, Text } = Typography;
import { Content } from 'antd/es/layout/layout';
import useContainerDimensions from '../../../../utils/useContainerDimensions';

import denbiLogo from '../../../../assets/deNBI.png';
import eawagLogo from '../../../../assets/EAWAG_logo.png';
import uniLuxLogo from '../../../../assets/UniLu-LCSB_Logo.png';
import ipbLogo from '../../../../assets/IPB.png';
import normanLogo from '../../../../assets/NORMAN.png';
import fnrLogo from '../../../../assets/fnr_logo.png';
import hbm4euLogo from '../../../../assets/HBM4EU_logo.png';
import nfdi4chemLogo from '../../../../assets/nfdi4chem_logo.png';
import ufzLogo from '../../../../assets/UFZ.png';
import SectionDivider from '../../../basic/SectionDivider';
import ServiceStatusView from './ServiceStatusView';
import Segmented from '../../../basic/Segmented';
import Imprint from './Imprint';

const logos = [
  denbiLogo,
  eawagLogo,
  fnrLogo,
  ipbLogo,
  normanLogo,
  ufzLogo,
  uniLuxLogo,
  hbm4euLogo,
  nfdi4chemLogo,
];

function AboutView() {
  const ref = useRef(null);
  const { width } = useContainerDimensions(ref);

  const elements = useMemo(() => {
    const infoText = (
      <Content style={{ padding: 10 }}>
        <Paragraph>
          MassBank is an open source mass spectral library for the
          identification of small chemical molecules of metabolomics, exposomics
          and environmental relevance. The vast majority of MassBank contents
          now features high-resolution mass spectrometry data, although all
          kinds of mass spectral data are accepted. A range of search options
          are available for browsing the data. The MassBank library is based on
          text file records containing the record metadata and the mass spectral
          information in the{' '}
          {
            <a
              href="https://github.com/MassBank/MassBank-web/blob/main/Documentation/MassBankRecordFormat.md"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              MassBank record format
            </a>
          }
          . All data is archived on{' '}
          {
            <a
              href="https://github.com/MassBank/MassBank-data"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              GitHub
            </a>
          }{' '}
          and{' '}
          {
            <a
              href="https://zenodo.org/records/14221628"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              {' '}
              Zenodo
            </a>
          }
          ; the code is also on{' '}
          {
            <a
              href="https://github.com/MassBank/MassBank3"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              GitHub
            </a>
          }
          . The MassBank library can be downloaded in different{' '}
          {
            <a
              href="https://github.com/MassBank/MassBank-data/releases"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              file formats
            </a>
          }{' '}
          such as text records, database files (sql) and MSP files.
        </Paragraph>
        <Paragraph>
          MassBank is maintained and developed by the{' '}
          {
            <a
              href="https://github.com/MassBank"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              MassBank consortium
            </a>
          }{' '}
          and is supported by the{' '}
          {
            <a
              href="https://www.norman-network.net/"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              NORMAN Association
            </a>
          }
          ,{' '}
          {
            <a
              href="https://www.fnr.lu/"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              FNR
            </a>
          }{' '}
          and{' '}
          {
            <a
              href="https://www.nfdi4chem.de/"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              NFDI4Chem
            </a>
          }
          . The main sustainers and developers of MassBank and related tools are
          the team of Steffen Neumann (
          {
            <a
              href="https://www.ipb-halle.de/en/research/program-center-metacom/research-groups/computational-plant-biochemistry"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              Leibniz Institute of Plant Biochemistry, Halle/Saale, Germany
            </a>
          }
          ), Michael Stravs (
          {
            <a
              href="https://www.eawag.ch/en/about-us/portrait/organisation/staff/profile/michael-stravs/show/"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              Swiss Federal Institute of Aquatic Science and Technology, EAWAG,
              Dübendorf, Switzerland
            </a>
          }
          ), Emma Schymanski (
          <a
            href="https://www.uni.lu/lcsb-en/people/emma-schymanski/"
            target="_blank"
            style={{ color: 'black', textDecoration: 'underline' }}
          >
            Luxembourg Centre for Systems Biomedicine, University of Luxembourg,
            LCSB, Belvaux, Luxembourg
          </a>
          ) and the Helmholtz Centre for Environmental Research, Leipzig,
          Germany.
        </Paragraph>
      </Content>
    );

    const data: JSX.Element[] = [
      <Content>
        <a
          href="https://cdk.github.io/"
          target="_blank"
          style={{ color: 'black', textDecoration: 'underline' }}
        >
          CDK
        </a>
        <br />
        <label>
          Willighagen, E.L., Mayfield, J.W., Alvarsson, J. et al. The Chemistry
          Development Kit (CDK) v2.0: atom typing, depiction, molecular
          formulas, and substructure searching. J Cheminform 9, 33 (2017).
        </label>{' '}
        <a href="https://doi.org/10.1186/s13321-017-0220-4" target="_blank">
          https://doi.org/10.1186/s13321-017-0220-4
        </a>
      </Content>,
      <Content>
        <a
          href="https://github.com/matchms"
          target="_blank"
          style={{ color: 'black', textDecoration: 'underline' }}
        >
          matchms
        </a>
        <br />
        <label>
          Huber et al., (2020). matchms - processing and similarity evaluation
          of mass spectrometry data.. Journal of Open Source Software, 5(52).
          2411.
        </label>{' '}
        <a href="https://doi.org/10.21105/joss.02411" target="_blank">
          https://doi.org/10.21105/joss.02411
        </a>
      </Content>,
      <Content>
        <a
          href="https://github.com/epam/Indigo/tree/master/bingo"
          target="_blank"
          style={{ color: 'black', textDecoration: 'underline' }}
        >
          Bingo
        </a>
        <br />
        <label>
          Pavlov, D., Rybalkin, M. & Karulin, B. Bingo from SciTouch LLC:
          chemistry cartridge for Oracle database. J Cheminform 2 (Suppl 1), F1
          (2010).
        </label>{' '}
        <a href="https://doi.org/10.1186/1758-2946-2-S1-F1" target="_blank">
          https://doi.org/10.1186/1758-2946-2-S1-F1
        </a>
      </Content>,
      <Content>
        <a
          href="https://github.com/cheminfo/openchemlib-js"
          target="_blank"
          style={{ color: 'black', textDecoration: 'underline' }}
        >
          OpenChemLib JS
        </a>
        <br />
        <label>
          Zasso, M., Patiny, L., Sander, T., & Rufener, C. openchemlib-js:
          library to manipulate chemical structures and reactions in JavaScript
          [Computer software].
        </label>{' '}
        <a href="https://doi.org/10.5281/zenodo.5139988" target="_blank">
          https://doi.org/10.5281/zenodo.5139988
        </a>
      </Content>,
    ];

    const acknowledgement = (
      <Content>
        <SectionDivider label="Acknowledgement" />
        <Paragraph style={{ padding: 10 }}>
          <Text
            style={{
              fontWeight: 'bolder',
              marginLeft: 20,
            }}
          >
            Standing on the shoulder of giants, we would like to acknowledge
            some of the dependencies used in the MassBank system:
          </Text>
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item style={{ border: 'none' }}>{item}</List.Item>
            )}
          />
        </Paragraph>
      </Content>
    );

    const supporters = (
      <Content>
        <SectionDivider label="Supporters" />
        <Content
          style={{
            width: '100%',
            display: 'grid',
            gridGap: 10,
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}
        >
          {logos.map((logo, i) => (
            <img
              src={logo}
              style={{ width: width / 5 }}
              key={'supporter-logo-' + i}
            />
          ))}
        </Content>
      </Content>
    );

    const serviceStatus = (
      <Content>
        <SectionDivider label="Service Status" />
        <ServiceStatusView />
      </Content>
    );

    const imprint = (
      <Content>
        <SectionDivider label="Imprint" />
        <Imprint />
      </Content>
    );

    return [infoText, supporters, acknowledgement, serviceStatus, imprint];
  }, [width]);

  const elementLabels = useMemo(
    () => [
      'Information',
      'Supporters',
      'Acknowledgement',
      'Service Status',
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

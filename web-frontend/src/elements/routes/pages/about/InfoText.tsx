import { Content } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';
import { memo } from 'react';

import massbankLogo from '../../../../assets/logo_without_subtext.svg';

function InfoText() {
  return (
    <Content
      style={{
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={massbankLogo}
        style={{ width: 300, marginTop: 10, marginBottom: 10 }}
        key={'massbank-logo-overview'}
        alt="MassBank logo"
      />
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
          ), Emma Schymanski (
          <a
            href="https://www.uni.lu/lcsb-en/people/emma-schymanski/"
            target="_blank"
            style={{ color: 'black', textDecoration: 'underline' }}
          >
            Luxembourg Centre for Systems Biomedicine, University of Luxembourg,
            LCSB, Belvaux, Luxembourg
          </a>
          ) and the{' '}
          {
            <a
              href="https://www.ufz.de/"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              Helmholtz Centre for Environmental Research, Leipzig, Germany
            </a>
          }
          .
        </Paragraph>
        <Paragraph>
          Furthermore, MassBank is a service for{' '}
          {
            <a
              href="https://elixir-europe.org/about-us/who-we-are/nodes/germany"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              ELIXIR-DE
            </a>
          }
          .
        </Paragraph>
        <Paragraph>
          Technical issues and ideas can be reported via{' '}
          {
            <a
              href="https://github.com/MassBank/MassBank3"
              target="_blank"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              GitHub
            </a>
          }
          . In case of general questions contact us via{' '}
          {
            <a
              href="mailto:massbank@massbank.eu"
              style={{ color: 'black', textDecoration: 'underline' }}
            >
              massbank@massbank.eu
            </a>
          }
          .
        </Paragraph>
      </Content>
    </Content>
  );
}

export default memo(InfoText);

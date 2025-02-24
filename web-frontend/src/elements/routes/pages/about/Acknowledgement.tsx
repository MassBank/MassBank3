import { memo } from 'react';
import Typography from 'antd/es/typography';
const { Paragraph, Text } = Typography;
import List from 'antd/es/list';
import { Content } from 'antd/es/layout/layout';

import nfdi4chemLogo from '../../../../assets/nfdi4chem_logo.png';

function Acknowledgement() {
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
        Development Kit (CDK) v2.0: atom typing, depiction, molecular formulas,
        and substructure searching. J Cheminform 9, 33 (2017).
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
        Huber et al., (2020). matchms - processing and similarity evaluation of
        mass spectrometry data.. Journal of Open Source Software, 5(52). 2411.
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
        Zasso, M., Patiny, L., Sander, T., & Rufener, C. openchemlib-js: library
        to manipulate chemical structures and reactions in JavaScript [Computer
        software].
      </label>{' '}
      <a href="https://doi.org/10.5281/zenodo.5139988" target="_blank">
        https://doi.org/10.5281/zenodo.5139988
      </a>
    </Content>,
  ];

  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
        alignItems: 'center',
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
        <img src={nfdi4chemLogo} style={{ height: 300 }} />
        <Paragraph style={{ fontWeight: 'bolder' }}>
          <Text>
            This project is funded by the DFG (
            {
              <a
                href="https://www.dfg.de/de"
                target="_blank"
                style={{ color: 'black', textDecoration: 'underline' }}
              >
                Deutsche Forschungsgesellschaft
              </a>
            }
            ) under the NFDI4Chem (
            {
              <a
                href="https://www.nfdi4chem.de/"
                target="_blank"
                style={{ color: 'black', textDecoration: 'underline' }}
              >
                National Research Data Infrastructure for Chemistry
              </a>
            }
            ) project. <br />
            Project number: 441958208.
          </Text>
        </Paragraph>
      </Content>
      <Paragraph style={{ padding: 10, marginTop: 40 }}>
        <Text
          style={{
            fontWeight: 'bolder',
            marginLeft: 20,
          }}
        >
          Standing on the shoulder of giants, we would like to acknowledge some
          of the dependencies used in the MassBank system:
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
}

export default memo(Acknowledgement);

import { CSSProperties, memo } from 'react';
import Typography from 'antd/es/typography';
const { Paragraph, Text } = Typography;
import List, { ListItemMetaProps } from 'antd/es/list';
import { Content } from 'antd/es/layout/layout';
import AcknowledgementNFDI4Chem from '../../../common/AcknowledgementNFDI4Chem';

const linkStyle: CSSProperties = {
  color: 'black',
  textDecoration: 'underline',
  fontSize: 16,
};

function Acknowledgement() {
  const data: ListItemMetaProps[] = [
    {
      title: (
        <a href="https://cdk.github.io/" target="_blank" style={linkStyle}>
          CDK
        </a>
      ),
      description: (
        <>
          <label>
            Willighagen, E.L., Mayfield, J.W., Alvarsson, J. et al. The
            Chemistry Development Kit (CDK) v2.0: atom typing, depiction,
            molecular formulas, and substructure searching. J Cheminform 9, 33
            (2017).
          </label>{' '}
          <a
            href="https://doi.org/10.1186/s13321-017-0220-4"
            target="_blank"
            style={linkStyle}
          >
            https://doi.org/10.1186/s13321-017-0220-4
          </a>
        </>
      ),
    },
    {
      title: (
        <a href="https://github.com/matchms" target="_blank" style={linkStyle}>
          matchms
        </a>
      ),
      description: (
        <>
          <label>
            Huber et al., (2020). matchms - processing and similarity evaluation
            of mass spectrometry data.. Journal of Open Source Software, 5(52).
            2411.
          </label>{' '}
          <a
            href="https://doi.org/10.21105/joss.02411"
            target="_blank"
            style={linkStyle}
          >
            https://doi.org/10.21105/joss.02411
          </a>
        </>
      ),
    },
    {
      title: (
        <a
          href="https://github.com/epam/Indigo/tree/master/bingo"
          target="_blank"
          style={linkStyle}
        >
          Bingo
        </a>
      ),
      description: (
        <>
          <label>
            Pavlov, D., Rybalkin, M. & Karulin, B. Bingo from SciTouch LLC:
            chemistry cartridge for Oracle database. J Cheminform 2 (Suppl 1),
            F1 (2010).
          </label>{' '}
          <a
            href="https://doi.org/10.1186/1758-2946-2-S1-F1"
            target="_blank"
            style={linkStyle}
          >
            https://doi.org/10.1186/1758-2946-2-S1-F1
          </a>
        </>
      ),
    },
    {
      title: (
        <a
          href="https://github.com/cheminfo/openchemlib-js"
          target="_blank"
          style={linkStyle}
        >
          OpenChemLib JS
        </a>
      ),
      description: (
        <>
          <label>
            Zasso, M., Patiny, L., Sander, T., & Rufener, C. openchemlib-js:
            library to manipulate chemical structures and reactions in
            JavaScript [Computer software].
          </label>{' '}
          <a
            href="https://doi.org/10.5281/zenodo.5139988"
            target="_blank"
            style={linkStyle}
          >
            https://doi.org/10.5281/zenodo.5139988
          </a>
        </>
      ),
    },
  ];

  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <AcknowledgementNFDI4Chem />
      <Paragraph style={{ padding: 10, marginTop: 40 }}>
        <Text
          style={{
            fontWeight: 'bolder',
            padding: 10,
          }}
        >
          Standing on the shoulder of giants, we would like to acknowledge some
          of the dependencies used in the MassBank system:
        </Text>
        <List
          style={{ padding: 10 }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item.Meta title={item.title} description={item.description} />
          )}
        />
      </Paragraph>
    </Content>
  );
}

export default memo(Acknowledgement);

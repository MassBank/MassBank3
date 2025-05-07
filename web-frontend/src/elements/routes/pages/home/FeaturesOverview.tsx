import { List } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { CheckCircleOutlined } from '@ant-design/icons';
import { memo } from 'react';
import spectrumWithStructureImage from '../../../../assets/spectrum_with_molecule.svg';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';

function FeaturesOverview() {
  const data: string[] = [
    'Compound Search',
    'Spectral Search',
    'Structure Search',
    'MassBank API',
  ];

  return (
    <Content
      style={{
        width: '100%',
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paragraph
        style={{
          width: 350,
          marginRight: 70,
        }}
      >
        <Text>
          The MassBank system provides a variety of functionalities to access,
          filter and search for data within its knowledge base. The following
          key features are available.
        </Text>
      </Paragraph>
      <List
        grid={{ column: 2 }}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            style={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              border: 'none',
              marginTop: 10,
              fontWeight: 'bolder',
            }}
          >
            <CheckCircleOutlined
              style={{ color: 'green', fontSize: 20, marginRight: 10 }}
            />
            {item}
          </List.Item>
        )}
        style={{
          width: 400,
          height: 250,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 50,
        }}
      />
      <img
        src={spectrumWithStructureImage}
        style={{
          maxHeight: 300,
          maxWidth: '40%',
        }}
      />
    </Content>
  );
}

export default memo(FeaturesOverview);

import { Content } from 'antd/es/layout/layout';
import { memo } from 'react';
import Typography from 'antd/es/typography';
const { Paragraph, Text } = Typography;
import { List } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

function Accessibility() {
  const data: string[] = [
    'Use alternative text for images and icons',
    'Provide keyboard navigation support',
    'Sufficient color contrast for text and background (except for placeholder values in input fields)',
  ];

  return (
    <Content
      style={{
        width: '100%',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paragraph style={{ width: '100%', textAlign: 'left' }}>
        <Text>
          These websites are currently in a re-design process to make it
          accessible to all users. The aim is to follow the Web Content
          Accessibility Guidelines (WCAG 2.1/2.2 AA) to ensure that all people,
          including those with disabilities, are able to use this service
          without restriction.
        </Text>
        <br />
        <br />
        <Text>
          The following features have been implemented so far to improve
          accessibility:
        </Text>
      </Paragraph>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              border: 'none',
            }}
          >
            <CheckCircleOutlined
              style={{ color: 'green', fontSize: 20, marginRight: 10 }}
            />
            {item}
          </List.Item>
        )}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'left',
        }}
      />
    </Content>
  );
}

export default memo(Accessibility);

import { Content } from 'antd/es/layout/layout';

function NewsView() {
  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2>News View</h2>
    </Content>
  );
}

export default NewsView;

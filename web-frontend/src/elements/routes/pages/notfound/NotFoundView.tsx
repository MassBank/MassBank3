import { Content } from 'antd/es/layout/layout';

function NotFoundView() {
  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2>404: Page Not Found</h2>
    </Content>
  );
}

export default NotFoundView;

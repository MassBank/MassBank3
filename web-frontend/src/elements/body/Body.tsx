import { Content } from 'antd/es/layout/layout';
import Routes from '../routes/Routes';

function Body() {
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
      <Routes />
    </Content>
  );
}

export default Body;

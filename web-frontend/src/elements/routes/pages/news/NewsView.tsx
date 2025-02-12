import { Content } from 'antd/es/layout/layout';
import News from '../../../common/News';

function NewsView() {
  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'scroll',
      }}
    >
      <News />
    </Content>
  );
}

export default NewsView;

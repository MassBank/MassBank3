import { Content } from 'antd/es/layout/layout';
import News from '../../../common/News';
import { Layout } from 'antd';
import { useMemo } from 'react';

function NewsView() {
  return useMemo(
    () => (
      <Layout
        style={{
          width: '100%',
          height: '100%',
        }}
      >
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
      </Layout>
    ),
    [],
  );
}

export default NewsView;

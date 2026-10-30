import { useMemo } from 'react';
import { Content } from 'antd/es/layout/layout';
import { Layout } from 'antd';
import Segmented from '../../../basic/Segmented';
import SectionDivider from '../../../basic/SectionDivider';

const newsUrl =
  'https://massbank.github.io/MassBank-documentation/news.html';
const newsArchiveUrl =
  'https://massbank.github.io/MassBank-documentation/news_archive.html';

function NewsView() {
  const segmented = useMemo(() => {
    const elements = [
      <Content
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <SectionDivider label="Latest" />
        <Content style={{ padding: 10, fontSize: 16 }}>
          <a href={newsUrl} target="_blank" rel="noopener noreferrer">
            Read the latest MassBank news
          </a>
        </Content>
      </Content>,
      <Content
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <SectionDivider label="Archive" />
        <Content style={{ padding: 10, fontSize: 16 }}>
          <a href={newsArchiveUrl} target="_blank" rel="noopener noreferrer">
            Browse the MassBank news archive
          </a>
        </Content>
      </Content>,
    ];
    const elementLabels = ['Latest', 'Archive'];

    return <Segmented elements={elements} elementLabels={elementLabels} />;
  }, []);

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
          }}
        >
          {segmented}
        </Content>
      </Layout>
    ),
    [segmented],
  );
}

export default NewsView;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Content } from 'antd/es/layout/layout';
import { Layout, Spin } from 'antd';
import Segmented from '../../../basic/Segmented';
import SectionDivider from '../../../basic/SectionDivider';

const templateUrlNews =
  'https://massbank.github.io/MassBank-documentation/news.html';
const templateUrlNewsArchive =
  'https://massbank.github.io/MassBank-documentation/news_archive.html';

function NewsView() {
  const ref = useRef(null);
  const [htmlTemplateNews, setHtmlTemplateNews] = useState<string>('');
  const [htmlTemplateNewsArchive, setHtmlTemplateNewsArchive] =
    useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchHtml = useCallback(async () => {
    setIsFetching(true);

    let response = await fetch(templateUrlNews);
    let html = await response.text();
    setHtmlTemplateNews(html);

    response = await fetch(templateUrlNewsArchive);
    html = await response.text();
    setHtmlTemplateNewsArchive(html);

    setIsFetching(false);
  }, []);

  useEffect(() => {
    fetchHtml();
  }, [fetchHtml]);

  const segmented = useMemo(() => {
    const elements = [
      <Content
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <SectionDivider label="Latest" />
        <Content
          style={{
            padding: 10,
            fontSize: 16,
          }}
          dangerouslySetInnerHTML={{ __html: htmlTemplateNews }}
        />
      </Content>,
      <Content
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <SectionDivider label="Archive" />
        <Content
          style={{
            padding: 10,
            fontSize: 16,
          }}
          dangerouslySetInnerHTML={{ __html: htmlTemplateNewsArchive }}
        />
      </Content>,
    ];
    const elementLabels = ['Latest', 'Archive'];

    return isFetching ? (
      <Spin
        size="large"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        spinning={isFetching}
      />
    ) : (
      <Segmented elements={elements} elementLabels={elementLabels} />
    );
  }, [htmlTemplateNews, htmlTemplateNewsArchive, isFetching]);

  return useMemo(
    () => (
      <Layout
        ref={ref}
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

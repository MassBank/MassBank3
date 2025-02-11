import { Content } from 'antd/es/layout/layout';
import { useCallback, useEffect, useState } from 'react';

const templateUrl =
  'https://massbank.github.io/MassBank-documentation/news.html';

function NewsView() {
  const [htmlTemplate, setHtmlTemplate] = useState<string>('');

  const fetchHtml = useCallback(async () => {
    const response = await fetch(templateUrl);
    const html = await response.text();
    setHtmlTemplate(html);
  }, []);

  useEffect(() => {
    fetchHtml();
  }, [fetchHtml]);

  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'scroll',
      }}
      dangerouslySetInnerHTML={{ __html: htmlTemplate }}
    />
  );
}

export default NewsView;

import { Content } from 'antd/es/layout/layout';
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const templateUrl =
  'https://massbank.github.io/MassBank-documentation/news.html';

type InputProps = {
  styles?: CSSProperties;
};

function News({ styles = {} }: InputProps) {
  const [htmlTemplate, setHtmlTemplate] = useState<string>('');

  const fetchHtml = useCallback(async () => {
    const response = await fetch(templateUrl);
    const html = await response.text();
    setHtmlTemplate(html);
  }, []);

  useEffect(() => {
    fetchHtml();
  }, [fetchHtml]);

  return useMemo(
    () => (
      <Content
        style={{
          width: '100%',
          height: '100%',
          padding: 10,
          fontSize: 16,
          ...styles,
        }}
        dangerouslySetInnerHTML={{ __html: htmlTemplate }}
      />
    ),
    [htmlTemplate, styles],
  );
}

export default News;

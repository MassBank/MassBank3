import { Spin } from 'antd';
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
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchHtml = useCallback(async () => {
    setIsFetching(true);

    const response = await fetch(templateUrl);
    const html = await response.text();
    setHtmlTemplate(html);

    setIsFetching(false);
  }, []);

  useEffect(() => {
    fetchHtml();
  }, [fetchHtml]);

  return useMemo(
    () =>
      isFetching ? (
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
    [htmlTemplate, isFetching, styles],
  );
}

export default News;

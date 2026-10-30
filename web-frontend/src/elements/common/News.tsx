import { Content } from 'antd/es/layout/layout';
import { CSSProperties } from 'react';

const newsUrl =
  'https://massbank.github.io/MassBank-documentation/news.html';

type InputProps = {
  styles?: CSSProperties;
};

function News({ styles = {} }: InputProps) {
  return (
    <Content
      style={{
        width: '100%',
        height: '100%',
        padding: 10,
        fontSize: 16,
        ...styles,
      }}
    >
      <a href={newsUrl} target="_blank" rel="noopener noreferrer">
        Read the latest MassBank news
      </a>
    </Content>
  );
}

export default News;

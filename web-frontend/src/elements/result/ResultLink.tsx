import Hit from '../../types/Hit';
import { Content } from 'antd/es/layout/layout';
import { CSSProperties } from 'react';

type InputProps = {
  hit: Hit;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
};

function ResultLink({ hit, width = '100%', height = '100%' }: InputProps) {
  const url =
    (((process.env.REACT_APP_MB3_FRONTEND_URL as string) +
      process.env.REACT_APP_MB3_BASE_URL) as string) +
    'recordDisplay?id=' +
    hit.accession;

  return (
    hit.record && (
      <Content
        style={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <a
          className="link"
          href={hit.accession && hit.accession !== '' ? url : '?'}
          target="_blank"
        >
          <label style={{ cursor: 'pointer' }}>{hit.accession}</label>
        </a>
      </Content>
    )
  );
}

export default ResultLink;

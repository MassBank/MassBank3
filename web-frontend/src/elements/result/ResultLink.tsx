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
    import.meta.env.VITE_MB3_FRONTEND_URL +
    import.meta.env.VITE_MB3_BASE_URL +
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

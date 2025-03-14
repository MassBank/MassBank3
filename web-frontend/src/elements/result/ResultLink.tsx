import Hit from '../../types/Hit';
import { Content } from 'antd/es/layout/layout';
import { CSSProperties, useMemo } from 'react';
import { usePropertiesContext } from '../../context/properties/properties';
import routes from '../../constants/routes';
import SearchFields from '../../types/filterOptions/SearchFields';

type InputProps = {
  hit: Hit;
  searchFormData?: SearchFields;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
};

function ResultLink({ hit, width = '100%', height = '100%' }: InputProps) {
  const { baseUrl, frontendUrl } = usePropertiesContext();

  const url = useMemo(() => {
    const _url =
      frontendUrl + baseUrl + routes.accession.path + '?id=' + hit.accession;
    if (hit.peakPairs && hit.peakPairs.length > 0) {
      return _url + '&neutralLossPeakPairs=' + hit.peakPairs.join(',');
    }
    return _url;
  }, [baseUrl, frontendUrl, hit.accession, hit.peakPairs]);

  return useMemo(
    () =>
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
      ),
    [height, hit.accession, hit.record, url, width],
  );
}

export default ResultLink;

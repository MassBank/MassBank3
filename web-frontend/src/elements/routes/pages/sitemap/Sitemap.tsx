import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchData from '../../../../utils/fetchData';
import SearchResult from '../../../../types/SearchResult';
import Hit from '../../../../types/Hit';
import xmlFormat from 'xml-formatter';

const nRecords = 40000;
const prefixUrl =
  import.meta.env.VITE_MB3_FRONTEND_URL + import.meta.env.VITE_MB3_BASE_URL;

function Sitemap() {
  const navigate = useNavigate();
  const params = useParams();
  const [xml, setXml] = useState<string | null>(null);

  const buildSitemap = useCallback(
    async (index: number) => {
      const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/search';
      const searchResult = (await fetchData(url)) as SearchResult;
      const hits: Hit[] = searchResult.data ? (searchResult.data as Hit[]) : [];

      if (index * nRecords >= hits.length) {
        navigate({ pathname: import.meta.env.VITE_MB3_BASE_URL + 'notFound' });
      }

      const lastmod = new Date().toISOString();

      const xmlHeader =
        '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      const xmlFooter = '</urlset>';
      const xmlContent: string[] = [xmlHeader];
      hits.slice(index * nRecords, (index + 1) * nRecords).forEach((hit) => {
        xmlContent.push(
          `<url><loc>${prefixUrl}recordDisplay?id=${hit.accession}</loc><lastmod>${lastmod}</lastmod></url>`,
        );
      });
      xmlContent.push(xmlFooter);

      setXml(xmlFormat(xmlContent.join('')));
    },
    [navigate],
  );

  useEffect(() => {
    const index = params.index?.split('.')[0];
    if (index) {
      buildSitemap(parseInt(index));
    }
  }, [buildSitemap, params.index]);

  return <pre>{xml}</pre>;
}

export default Sitemap;

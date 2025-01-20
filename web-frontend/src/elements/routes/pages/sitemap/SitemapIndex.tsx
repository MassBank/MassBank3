import { useCallback, useEffect, useState } from 'react';
import Hit from '../../../../types/Hit';
import SearchResult from '../../../../types/SearchResult';
import fetchData from '../../../../utils/fetchData';
import xmlFormat from 'xml-formatter';

const nRecords = 40000;
const prefixUrl =
  import.meta.env.VITE_MB3_FRONTEND_URL + import.meta.env.VITE_MB3_BASE_URL;

function SitemapIndex() {
  const [xml, setXml] = useState<string | null>(null);

  const buildSitemap = useCallback(async () => {
    const url = import.meta.env.VITE_MB3_API_URL + '/v1/records/search';
    const searchResult = (await fetchData(url)) as SearchResult;
    const hits: Hit[] = searchResult.data ? (searchResult.data as Hit[]) : [];

    const lastmod = new Date().toISOString();

    const urlSets: string[] = [
      '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];
    const n = Math.ceil(hits.length / nRecords);
    for (let i = 0; i < n; i++) {
      urlSets.push(
        `<sitemap><loc>${prefixUrl}sitemap/${i}.xml</loc><lastmod>${lastmod}</lastmod></sitemap>`,
      );
    }
    urlSets.push('</sitemapindex>');

    setXml(xmlFormat(urlSets.join('')));
  }, []);

  useEffect(() => {
    buildSitemap();
  }, [buildSitemap]);

  return <pre>{xml}</pre>;
}

export default SitemapIndex;

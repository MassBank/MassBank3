import fs from 'node:fs/promises';
import express, { Request, Response } from 'express';
import { ViteDevServer } from 'vite';
import axios from 'axios';
import xmlFormat from 'xml-formatter';
import Hit from './src/types/Hit';
import SearchResult from './src/types/SearchResult';
import fetchData from './src/utils/request/fetchData';
import PropertiesContextProps from './src/types/PropertiesContextProps';
import Metadata from './src/types/Metadata';

// Constants
const port = 3000;
const host = '0.0.0.0';

const isProduction = process.env.NODE_ENV === 'production';
const backendUrl = process.env.VITE_MB3_API_URL ?? 'http://localhost:8081';
const frontendUrl =
  process.env.VITE_MB3_FRONTEND_URL ?? 'http://localhost:8080';
const baseUrl = process.env.VITE_MB3_BASE_URL ?? '/MassBank3/';
const exportServiceUrl =
  process.env.VITE_EXPORT_SERVICE_URL ?? 'http://localhost:8083';
const version = process.env.VITE_MB3_VERSION ?? '0.4.0 (beta)';
const googleSearchConsoleKey = process.env.VITE_GOOGLE_SEARCH_CONSOLE_KEY ?? '';
const backendUrlInternal =
  process.env.VITE_MB3_API_URL_INTERNAL ?? 'http://mb3server:8080';
const exportServiceUrlInternal =
  process.env.VITE_EXPORT_SERVICE_URL_INTERNAL ?? 'http://export-service:8080';

console.log('\n');
console.log('isProduction', process.env.NODE_ENV === 'production');
console.log('port', port);
console.log('host', host);
console.log('baseUrl', baseUrl);
console.log('frontendUrl', frontendUrl);
console.log('version', version);
console.log('backendUrl', backendUrl);
console.log('backendUrlInternal', backendUrlInternal);
console.log('exportServiceUrl', exportServiceUrl);
console.log('exportServiceUrlInternal', exportServiceUrlInternal);
console.log('googleSearchConsoleKey', googleSearchConsoleKey);
console.log('\n');

// Create http server
const app = express();

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite: ViteDevServer;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(baseUrl, sirv('./dist/client', { extensions: [] }));
}

const buildRecordMetadata = async (_accession: string) => {
  const url = `${exportServiceUrlInternal}/metadata/${_accession}`;

  const resp = await axios.get(url, {
    headers: {
      Accept: 'application/ld+json',
    },
  });
  if (resp.status === 200) {
    const data = await resp.data;
    if (data) {
      const json =
        '[' +
        (data as object[]).map((d) => JSON.stringify(d, null, 2)).join(',\n') +
        ']';

      return json;
    }
  }

  return '';
};

async function getLastmodDate() {
  let url = backendUrlInternal + '/v1/metadata';
  const searchResultMetadata: Metadata | undefined = await fetchData(url);
  const timestampMetadata = searchResultMetadata?.timestamp;
  url = exportServiceUrlInternal + '/version';
  const searchResultExportServiceVersion: string | undefined =
    await fetchData(url);
  const timestampExportService = searchResultExportServiceVersion
    ?.split(',')[1]
    .trim();

  const dateMetadata = timestampMetadata
    ? new Date(timestampMetadata).toISOString()
    : undefined;
  const dateExportService = timestampExportService
    ? new Date(timestampExportService).toISOString()
    : undefined;

  let lastmodDate = new Date().toISOString();
  if (dateMetadata && dateExportService) {
    lastmodDate =
      dateMetadata > dateExportService ? dateMetadata : dateExportService;
  } else if (dateMetadata) {
    lastmodDate = dateMetadata;
  } else if (dateExportService) {
    lastmodDate = dateExportService;
  }
  return lastmodDate;
}

// Create router for base URL
const baseRouter = express.Router();
app.use(baseUrl, baseRouter);

const nRecords = 40000;
const prefixUrl = frontendUrl + baseUrl;

// serve sitemap index for search engines
baseRouter.get('/robots.txt', async (req: Request, res: Response) => {
  try {
    const content = `User-agent: *\nAllow: /\n\nSitemap: ${prefixUrl}sitemap.xml`;

    res.status(200).set({ 'Content-Type': 'text/plain' }).send(content);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// serve sitemap index for search engines
baseRouter.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const url: string = backendUrlInternal + '/v1/records/count';
    const searchResultRecordCount: number | undefined = await fetchData(url);
    const hitsCount: number = searchResultRecordCount
      ? searchResultRecordCount
      : 0;

    const lastmodDate = await getLastmodDate();

    const urlSets: string[] = [
      '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];
    const n = Math.ceil(hitsCount / nRecords);
    for (let i = 0; i < n; i++) {
      urlSets.push(
        `<sitemap><loc>${prefixUrl}sitemap_${i}.xml</loc><lastmod>${lastmodDate}</lastmod></sitemap>`,
      );
    }
    urlSets.push('</sitemapindex>');
    const xml = xmlFormat(urlSets.join(''));

    res.status(200).set({ 'Content-Type': 'application/xml' }).send(xml);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// serve individual sitemaps for search engines
baseRouter.get(/\/sitemap_\d+\.xml/, async (req: Request, res: Response) => {
  try {
    const index = Number(req.originalUrl.split('_')[1].split('.')[0]);

    const url = backendUrlInternal + '/v1/records/search';
    const searchResult = (await fetchData(url)) as SearchResult;
    const hits: Hit[] = searchResult.data ? (searchResult.data as Hit[]) : [];

    if (index * nRecords >= hits.length) {
      res.sendStatus(404);
      return;
    }

    const lastmodDate = await getLastmodDate();

    const xmlHeader =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const xmlFooter = '</urlset>';
    const xmlContent: string[] = [xmlHeader];
    hits.slice(index * nRecords, (index + 1) * nRecords).forEach((hit) => {
      xmlContent.push(
        `<url><loc>${prefixUrl}RecordDisplay?id=${hit.accession}</loc><lastmod>${lastmodDate}</lastmod></url>`,
      );
    });
    xmlContent.push(xmlFooter);
    const xml = xmlFormat(xmlContent.join(''));

    res.status(200).set({ 'Content-Type': 'application/xml' }).send(xml);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// serve index.html for all other routes
baseRouter.use(/(.*)/, async (req: Request, res: Response) => {
  try {
    let template: string;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      const url = req.originalUrl.replace(baseUrl, '');
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('./src/ServerApp.tsx')).render;
    } else {
      // Cached production assets
      const templateHtml = isProduction
        ? await fs.readFile('./dist/client/index.html', 'utf-8')
        : '';
      template = templateHtml;
      render = (await import('./dist/server/ServerApp.js')).render;
    }

    const path = req.originalUrl.split('?')[0];
    const props = {
      baseUrl,
      backendUrl,
      frontendUrl,
      exportServiceUrl,
      version,
    } as PropertiesContextProps;
    const rendered = await render({
      path,
      props,
    });

    const googleSearchConsoleMeta = `<meta name="google-site-verification" content="${googleSearchConsoleKey}"></meta>`;
    rendered.head = rendered.head
      ? rendered.head.concat('\n').concat(googleSearchConsoleMeta)
      : googleSearchConsoleMeta;

    const pageRoute = path.replace(baseUrl, '');
    if (
      (pageRoute === 'recordDisplay' || pageRoute === 'RecordDisplay') &&
      req.query.id
    ) {
      const metadata = await buildRecordMetadata(req.query.id as string);
      const metadataScript = `<script type="application/ld+json">${metadata}</script>`;
      rendered.head = rendered.head
        ? rendered.head.concat('\n').concat(metadataScript)
        : metadataScript;
    }

    const initDataScript = `<script> window.__INITIAL_DATA__ = ${JSON.stringify(props)}; </script>`;
    rendered.html = rendered.html
      ? rendered.html.concat('\n').concat(initDataScript)
      : initDataScript;

    // console.log('rendered', rendered);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '');

    // console.log('html', html);

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server started at http://${host}:${port}`);
});

import fs from 'node:fs/promises';
import express, { Request, Response } from 'express';
import axios from 'axios';
import xmlFormat from 'xml-formatter';
import Hit from './src/types/Hit';
import SearchResult from './src/types/SearchResult';
import fetchData from './src/utils/request/fetchData';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { PropertiesContextProps } from './src/context/properties/propertiesContext';

// Constants

const port = 3000;
const host = '0.0.0.0';

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(process.env.REACT_APP_MB3_API_URL);
console.log(process.env.REACT_APP_MB3_FRONTEND_URL);
console.log(process.env.REACT_APP_EXPORT_SERVICE_URL);
console.log(process.env.REACT_APP_GOOGLE_SEARCH_CONSOLE_KEY);

const backendUrl = process.env.REACT_APP_MB3_API_URL ?? 'http://localhost:8081';
const frontendUrl =
  process.env.REACT_APP_MB3_FRONTEND_URL ?? 'http://localhost:8080';
const baseUrl = process.env.REACT_APP_MB3_BASE_URL ?? '/MassBank3/';
const exportServiceUrl =
  process.env.REACT_APP_EXPORT_SERVICE_URL ?? 'http://localhost:8083';
const version = process.env.REACT_APP_MB3_VERSION ?? '0.4.0 (beta)';

console.log('isProduction', process.env.NODE_ENV === 'production');
console.log('frontendUrl', frontendUrl);
console.log('exportServiceUrl', exportServiceUrl);
console.log('backendUrl', backendUrl);
console.log('version', version);
console.log('port', port);
console.log('host', host);
console.log('baseUrl', baseUrl);

async function createServer() {
  // Create http server
  const app = express();

  // Create router for base URL
  // const baseRouter = express.Router();
  // app.use(baseUrl, baseRouter);

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // baseRouter.use(vite.middlewares);
  app.use(vite.middlewares);

  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  // baseRouter.use(compression());
  app.use(compression());
  // baseRouter.use(
  //   baseUrl,
  //   sirv(resolve(__dirname, './dist/client'), { extensions: [] }),
  // );
  app.use(
    baseUrl,
    sirv(resolve(__dirname, './dist/client'), { extensions: [] }),
  );

  // baseRouter.use(
  //   'assets',
  //   express.static(resolve(__dirname, './dist/client/assets')),
  // );
  // app.use('/static', express.static('dist'));

  const buildRecordMetadata = async (_accession: string) => {
    const url = `${exportServiceUrl}/metadata/${_accession}`;

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
          (data as object[])
            .map((d) => JSON.stringify(d, null, 2))
            .join(',\n') +
          ']';

        return json;
      }
    }

    return '';
  };

  const nRecords = 40000;
  const prefixUrl = frontendUrl + baseUrl;

  // serve sitemap index for search engines
  app.get('/sitemap.xml', async (req: Request, res: Response) => {
    console.log('/sitemap.xml');

    try {
      const url = backendUrl + '/v1/records/search';

      console.log('prefixUrl', prefixUrl);
      console.log('url', url);

      const searchResult = (await fetchData(url)) as SearchResult;
      const hits: Hit[] = searchResult.data ? (searchResult.data as Hit[]) : [];

      const lastmod = new Date().toISOString();

      const urlSets: string[] = [
        '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ];
      const n = Math.ceil(hits.length / nRecords);
      for (let i = 0; i < n; i++) {
        urlSets.push(
          `<sitemap><loc>${prefixUrl}sitemap_${i}.xml</loc><lastmod>${lastmod}</lastmod></sitemap>`,
        );
      }
      urlSets.push('</sitemapindex>');
      const xml = xmlFormat(urlSets.join(''));

      res.status(200).set({ 'Content-Type': 'application/xml' }).send(xml);
    } catch (e) {
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  // serve individual sitemaps for search engines
  app.get(/\/sitemap_\d+\.xml/, async (req: Request, res: Response) => {
    console.log(req.originalUrl);

    try {
      const index = Number(req.originalUrl.split('_')[1].split('.')[0]);

      const url = backendUrl + '/v1/records/search';
      const searchResult = (await fetchData(url)) as SearchResult;
      const hits: Hit[] = searchResult.data ? (searchResult.data as Hit[]) : [];

      if (index * nRecords >= hits.length) {
        res.sendStatus(404);
        return;
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
      const xml = xmlFormat(xmlContent.join(''));

      res.status(200).set({ 'Content-Type': 'application/xml' }).send(xml);
    } catch (e) {
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  // serve index.html for all other routes
  app.use(/(.*)/, async (req: Request, res: Response) => {
    try {
      console.log('orig. url: "' + req.originalUrl + '"');
      // const url = req.originalUrl.split('?')[0];
      const url = req.originalUrl;
      console.log('url: "' + url + '"');
      const path = req.url.split('?')[0];
      console.log('path: "' + path + '"');

      // Cached production assets
      const templateHtml = await fs.readFile(
        resolve(__dirname, './dist/client/index.html'),
        'utf-8',
      );

      // templateHtml = await vite.transformIndexHtml(url, templateHtml);

      const render = (
        await import(resolve(__dirname, './dist/server/ServerApp.js'))
      ).render;

      const rendered = await render({
        path,
        props: {
          baseUrl,
          backendUrl,
          frontendUrl,
          exportServiceUrl,
          version,
        } as PropertiesContextProps,
      });

      const googleSearchConsoleMeta = `<meta name="google-site-verification" content=${process.env.REACT_APP_GOOGLE_SEARCH_CONSOLE_KEY}/>`;
      rendered.head = rendered.head
        ? rendered.head.concat(googleSearchConsoleMeta)
        : googleSearchConsoleMeta;

      if (
        (path === 'recordDisplay' || path === 'RecordDisplay') &&
        req.query.id
      ) {
        const metadata = await buildRecordMetadata(req.query.id as string);
        const metaDataScript = `<script type="application/ld+json">${metadata}</script>`;
        rendered.head = rendered.head
          ? rendered.head.concat(metaDataScript)
          : metaDataScript;
      }

      const html = templateHtml
        .replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-html-->`, rendered.html ?? '');

      // console.log('html', html);

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (e) {
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
}

createServer();

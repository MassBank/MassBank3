import fs from 'node:fs/promises';
import { readFileSync } from 'fs';
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
const backendUrl =
  process.env.MB3_API_URL && process.env.MB3_API_URL.trim().length > 0
    ? process.env.MB3_API_URL.replace(/\/$/, '')
    : 'http://localhost:8081/MassBank-api';
const frontendUrl = process.env.MB3_FRONTEND_URL ?? 'http://localhost:8080';
const frontendBaseUrl =
  process.env.MB3_FRONTEND_BASE_URL &&
  process.env.MB3_FRONTEND_BASE_URL.trim().length > 0
    ? process.env.MB3_FRONTEND_BASE_URL.replace(/\/$/, '')
    : '/MassBank3';
const exportServiceUrl =
  process.env.EXPORT_SERVICE_URL ?? 'http://localhost:8083';
const version = process.env.MB3_VERSION ?? '0.4.0 (beta)';
const pathToHtmlHeadFile = process.env.HTML_HEAD_FILE ?? '';
const pathToHtmlBodyFile = process.env.HTML_BODY_FILE ?? '';
const backendUrlInternal =
  process.env.MB3_API_URL_INTERNAL &&
  process.env.MB3_API_URL_INTERNAL.trim().length > 0
    ? process.env.MB3_API_URL_INTERNAL.replace(/\/$/, '')
    : 'http://mb3server:8080/MassBank-api';
const exportServiceUrlInternal =
  process.env.EXPORT_SERVICE_URL_INTERNAL ?? 'http://export-service:8080';
const distributorText =
  process.env.DISTRIBUTOR_TEXT ??
  'This website is hosted and distributed by ...';
const distributorUrl = process.env.DISTRIBUTOR_URL ?? '';
const browserTabTitle =
  process.env.MB3_FRONTEND_BROWSER_TAB_TITLE ?? 'MassBank3';
const homepageIntroText =
  process.env.MB3_FRONTEND_HOMEPAGE_INTRO_TEXT ?? 'Welcome to MassBank3!';
const homepageNewsSectionText =
  process.env.MB3_FRONTEND_HOMEPAGE_NEWS_SECTION_TEXT ?? '';
const homepageFundingSectionText =
  process.env.MB3_FRONTEND_HOMEPAGE_FUNDING_SECTION_TEXT ?? '';
const homepageAdditionalSectionName =
  process.env.MB3_FRONTEND_HOMEPAGE_ADDITIONAL_SECTION_NAME ?? '';
const homepageAdditionalSectionText =
  process.env.MB3_FRONTEND_HOMEPAGE_ADDITIONAL_SECTION_TEXT ?? '';

console.log('\n');
console.log('isProduction:', process.env.NODE_ENV === 'production');
console.log('port:', port);
console.log('host:', host);
console.log('baseUrl:', frontendBaseUrl);
console.log('frontendUrl:', frontendUrl);
console.log('version:', version);
console.log('backendUrl:', backendUrl);
console.log('backendUrlInternal:', backendUrlInternal);
console.log('exportServiceUrl:', exportServiceUrl);
console.log('exportServiceUrlInternal:', exportServiceUrlInternal);
console.log('pathToHtmlHeadFile:', pathToHtmlHeadFile);
console.log('pathToHtmlBodyFile:', pathToHtmlBodyFile);
console.log('distributorText:', distributorText);
console.log('distributorUrl:', distributorUrl);
console.log('browserTabTitle:', browserTabTitle);
console.log('homepageIntroText:', homepageIntroText);
console.log('homepageNewsSectionText:', homepageNewsSectionText);
console.log('homepageFundingSectionText:', homepageFundingSectionText);
console.log('homepageAdditionalSectionName:', homepageAdditionalSectionName);
console.log('homepageAdditionalSectionText:', homepageAdditionalSectionText);
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
  app.use(frontendBaseUrl, sirv('./dist/client', { extensions: [] }));
}

const buildRecordMetadata = async (_accession: string) => {
  try {
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
          (data as object[])
            .map((d) => JSON.stringify(d, null, 2))
            .join(',\n') +
          ']';

        return json;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // console.error('buildRecordMetadata failed', e);
  }

  return null;
};

async function getLastmodDate() {
  let url = backendUrlInternal + '/metadata';
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

// Create router for redirecting to the frontend with base URL in case slash is missing
// const redirectRouter = express.Router();
// const regex = new RegExp(`^${frontendBaseUrl}$`);
// app.use(regex, redirectRouter);
// redirectRouter.get('', async (req: Request, res: Response) => {
//   const redirectUrl = frontendUrl + frontendBaseUrl + '/';
//   res.redirect(redirectUrl);
// });

// Create router for base URL
const baseRouter = express.Router();
app.use(frontendBaseUrl + '/', baseRouter);

const nRecords = 40000;
const prefixUrl = frontendUrl + frontendBaseUrl;

// serve sitemap index for search engines
baseRouter.get('/robots.txt', async (req: Request, res: Response) => {
  try {
    const content = `User-agent: *\nAllow: /\n\nSitemap: ${prefixUrl}/sitemap.xml`;

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
    const url: string = backendUrlInternal + '/records/count';
    const searchResultRecordCount: number | undefined = await fetchData(url);
    const hitsCount: number = searchResultRecordCount
      ? searchResultRecordCount
      : 0;

    const lastmodDate = await getLastmodDate();

    const xmlContent: string[] = [
      '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];

    const n = Math.ceil(hitsCount / nRecords);
    for (let i = 0; i < n; i++) {
      xmlContent.push(
        `<sitemap><loc>${prefixUrl}/sitemap_${i}.xml</loc><lastmod>${lastmodDate}</lastmod></sitemap>`,
      );
    }
    xmlContent.push(
      `<sitemap><loc>${prefixUrl}/sitemap_misc.xml</loc></sitemap>`,
    );
    xmlContent.push('</sitemapindex>');
    const xml = xmlFormat(xmlContent.join(''));

    res.status(200).set({ 'Content-Type': 'application/xml' }).send(xml);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

baseRouter.get('/sitemap_misc.xml', async (req: Request, res: Response) => {
  try {
    const xmlHeader =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const xmlContent: string[] = [xmlHeader];
    xmlContent.push(
      `<url><loc>${prefixUrl}</loc><changefreq>weekly</changefreq></url>`,
    );
    xmlContent.push(
      `<url><loc>${prefixUrl}/search</loc><changefreq>weekly</changefreq></url>`,
    );
    xmlContent.push(
      `<url><loc>${prefixUrl}/content</loc><changefreq>weekly</changefreq></url>`,
    );
    xmlContent.push(
      `<url><loc>${prefixUrl}/news</loc><changefreq>weekly</changefreq></url>`,
    );
    xmlContent.push(
      `<url><loc>${prefixUrl}/about</loc><changefreq>weekly</changefreq></url>`,
    );

    xmlContent.push('</urlset>');
    const xml = xmlFormat(xmlContent.join(''));

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

    const url = backendUrlInternal + '/records/search';
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
        `<url><loc>${prefixUrl}/RecordDisplay?id=${hit.accession}</loc><lastmod>${lastmodDate}</lastmod></url>`,
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
      const url = req.originalUrl.replace(frontendBaseUrl, '');
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
      baseUrl: frontendBaseUrl,
      backendUrl,
      frontendUrl,
      exportServiceUrl,
      version,
      distributorText,
      distributorUrl,
      homepageIntroText,
      homepageNewsSectionText,
      homepageFundingSectionText,
      homepageAdditionalSectionName,
      homepageAdditionalSectionText,
    } as PropertiesContextProps;
    const rendered = await render({
      path,
      props,
    });

    const tabTitle = `<title>${browserTabTitle}</title>`;
    const noFollowLinksMeta = `<meta name="robots" content="nofollow"></meta>`;
    rendered.head = rendered.head
      ? rendered.head
          .concat('\n\t')
          .concat(tabTitle)
          .concat('\n\t')
          .concat(noFollowLinksMeta)
      : noFollowLinksMeta;
    if (pathToHtmlHeadFile && pathToHtmlHeadFile.trim().length > 0) {
      const customHeadConfiguration = readFileSync(pathToHtmlHeadFile, 'utf-8');
      rendered.head = rendered.head
        ? rendered.head.concat('\n\t').concat(customHeadConfiguration)
        : customHeadConfiguration;
    }

    const pageRoute = path.replace(frontendBaseUrl, '');
    if (
      (pageRoute === 'recordDisplay' || pageRoute === 'RecordDisplay') &&
      req.query.id
    ) {
      const metadata = await buildRecordMetadata(req.query.id as string);
      if (metadata) {
        const metadataScript = `<script type="application/ld+json">${metadata}</script>`;
        rendered.head = rendered.head
          ? rendered.head.concat('\n\t').concat(metadataScript)
          : metadataScript;
      }
    }

    const initDataScript = `<script> window.__INITIAL_DATA__ = ${JSON.stringify(props)}; </script>`;
    rendered.html = rendered.html
      ? rendered.html.concat('\n').concat(initDataScript)
      : initDataScript;

    if (pathToHtmlBodyFile && pathToHtmlBodyFile.trim().length > 0) {
      const customBodyConfiguration = readFileSync(pathToHtmlBodyFile, 'utf-8');
      rendered.html = rendered.html
        ? rendered.html.concat('\n\t').concat(customBodyConfiguration)
        : customBodyConfiguration;
    }

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
  console.log(`Server started at http://${host}:${port}${frontendBaseUrl}`);
});

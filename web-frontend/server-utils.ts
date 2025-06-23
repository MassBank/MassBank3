import axios from 'axios';
import Metadata from './src/types/Metadata';
import fetchData from './src/utils/request/fetchData';

const buildRecordMetadata = async (
  accession: string,
  exportServiceUrlInternal: string,
) => {
  try {
    const url = `${exportServiceUrlInternal}/metadata/${accession}`;
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

async function getLastmodDate(
  backendUrlInternal: string,
  exportServiceUrlInternal: string,
) {
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

export { buildRecordMetadata, getLastmodDate };

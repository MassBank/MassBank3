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

function convertMassBank2QueryParams(
  inputParams: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams();
  // Map the old Result.jsp parameters to the new search parameters
  if (inputParams.has('compound')) {
    const compoundName = inputParams.get('compound')?.trim() ?? '';
    if (compoundName.length > 0) {
      params.set('compound_name', compoundName);
    }
  }
  if (inputParams.has('mz')) {
    const mzValue = inputParams.get('mz')?.trim() ?? '';
    if (mzValue.length > 0) {
      params.set('exact_mass', mzValue);
    }
  }
  if (inputParams.has('tol')) {
    const tolerance = inputParams.get('tol')?.trim() ?? '0.1';
    if (tolerance.length > 0) {
      params.set('mass_tolerance', tolerance);
    } else {
      params.set('mass_tolerance', '0.1'); // default value
    }
  }
  if (inputParams.has('formula')) {
    const formula = inputParams.get('formula')?.trim() ?? '';
    if (formula.length > 0) {
      params.set('formula', formula);
    }
  }
  if (inputParams.has('inchikey')) {
    const inchiKey = inputParams.get('inchikey')?.trim() ?? '';
    if (inchiKey.length > 0) {
      params.set('inchi_key', inchiKey);
    }
  }
  if (inputParams.has('splash')) {
    const splash = inputParams.get('splash')?.trim() ?? '';
    if (splash.length > 0) {
      params.set('splash', splash);
    }
  }
  // peak search (not similiarity search)
  if (inputParams.has('mz0')) {
    const mzValues: string[] = [];
    for (let i = 0; i < 6; i++) {
      const mzKey = `mz${i}`;
      if (inputParams.has(mzKey) && inputParams.get(mzKey)?.trim() !== '') {
        mzValues.push(inputParams.get(mzKey) ?? '');
      }
    }
    if (mzValues.length > 0) {
      params.set('peaks', mzValues.join(','));
    }
  }
  if (inputParams.has('int')) {
    const intensity = inputParams.get('int')?.trim() ?? '50';
    if (intensity.length > 0) {
      params.set('intensity', intensity);
    } else {
      params.set('intensity', '50'); // default value
    }
  }
  // instrument types
  if (inputParams.has('inst')) {
    const instrumentTypes = inputParams.get('inst')?.trim() ?? '';
    if (instrumentTypes.length > 0) {
      params.set('instrument_type', instrumentTypes);
    }
  }
  // MS types
  if (inputParams.has('ms')) {
    const msTypes = inputParams.get('ms')?.trim() ?? '';
    if (msTypes.length > 0) {
      params.set('ms_type', msTypes);
    }
  }
  // ion mode
  if (inputParams.has('ion')) {
    const ionMode = inputParams.get('ion')?.trim() ?? '';
    if (ionMode.length > 0) {
      if (ionMode === '1') {
        params.set('ion_mode', 'POSITIVE');
      } else if (ionMode === '-1') {
        params.set('ion_mode', 'NEGATIVE');
      } else if (ionMode === '0') {
        params.set('ion_mode', 'POSITIVE,NEGATIVE');
      }
    }
  }

  return params;
}

export { buildRecordMetadata, convertMassBank2QueryParams, getLastmodDate };

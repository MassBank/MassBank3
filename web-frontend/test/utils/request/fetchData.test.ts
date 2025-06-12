import { expect, test } from 'vitest';
import fetchData from '../../../src/utils/request/fetchData';
import buildSearchParams from '../../../src/utils/request/buildSearchParams';
import ContentFilterOptions from '../../../src/types/filterOptions/ContentFilterOtions';

const backendUrl = 'http://localhost:8081/MassBank-api';

test('fetchData: filter/browse without searchParams', async () => {
  const url = backendUrl + '/filter/browse';
  const data = await fetchData(url);
  expect(data).toBeDefined();
  expect(data).toHaveProperty('contributor');
  expect(data).toHaveProperty('instrument_type');
  expect(data).toHaveProperty('ms_type');
  expect(data).toHaveProperty('ion_mode');
});

test('fetchData: filter/browse with searchParams', async () => {
  const browseOptions: ContentFilterOptions = {
    contributor: [{ value: 'AAFC' }],
    instrument_type: [{ value: 'LC-ESI-ITFT' }],
    ms_type: [{ value: 'MS2' }],
    ion_mode: [{ value: 'POSITIVE' }],
  };
  const searchParams = buildSearchParams(browseOptions);
  console.log(searchParams);

  const url = backendUrl + '/filter/browse';
  const data = await fetchData(url, searchParams);
  console.log(data);

  expect(data).toBeDefined();
  expect(data).toHaveProperty('contributor');
  expect(data).toHaveProperty('instrument_type');
  expect(data).toHaveProperty('ms_type');
  expect(data).toHaveProperty('ion_mode');
  // contributor
  expect(data.contributor).toEqual(
    expect.arrayContaining([{ value: 'AAFC', count: expect.any(Number) }]),
  );
  expect(data.contributor).not.toEqual(
    expect.arrayContaining([{ value: 'IPB', count: expect.any(Number) }]),
  );
  // instrument type
  expect(data.instrument_type).toEqual(
    expect.arrayContaining([
      { value: 'LC-ESI-ITFT', count: expect.any(Number) },
    ]),
  );
  expect(data.contributor).not.toEqual(
    expect.arrayContaining([
      { value: 'LC-ESI-QTOF', count: expect.any(Number) },
    ]),
  );
  // ms type
  expect(data.ms_type).toEqual(
    expect.arrayContaining([{ value: 'MS2', count: expect.any(Number) }]),
  );
  expect(data.ms_type).not.toEqual(
    expect.arrayContaining([{ value: 'MS', count: expect.any(Number) }]),
  );
  // ion mode
  expect(data.ion_mode).toEqual(
    expect.arrayContaining([{ value: 'POSITIVE', count: expect.any(Number) }]),
  );
  expect(data.ion_mode).not.toEqual(
    expect.arrayContaining([{ value: 'NEGATIVE', count: expect.any(Number) }]),
  );
});

test('fetchData: metadata', async () => {
  const url = backendUrl + '/metadata';
  const metadata = await fetchData(url);

  expect(metadata).toBeDefined();
  expect(metadata).toHaveProperty(['version']);
  expect(metadata).toHaveProperty(['git_commit']);
  expect(metadata).toHaveProperty(['timestamp']);
  expect(metadata).toHaveProperty(['spectra_count']);
  expect(metadata).toHaveProperty(['compound_count']);
  expect(metadata).toHaveProperty(['compound_class']);
  expect(metadata).toHaveProperty(['compound_class_chemont']);
});

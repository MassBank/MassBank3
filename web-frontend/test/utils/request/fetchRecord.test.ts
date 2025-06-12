import { expect, expectTypeOf, test } from 'vitest';
import fetchRecord from '../../../src/utils/request/fetchRecord';
import Record from '../../../src/types/record/Record';

test('fetchRecord with MSBNK-AAFC-AC000001', async () => {
  const accession = 'MSBNK-AAFC-AC000001';
  const backendUrl = 'http://localhost:8081/MassBank-api';
  const record = await fetchRecord(accession, backendUrl);

  expectTypeOf(record).toEqualTypeOf<Record | undefined>();
  expect(record).toBeDefined();
  expect(record).toHaveProperty('accession');
  expect(record).toHaveProperty('title');
  expect(record).toHaveProperty('date');
  expect(record).toHaveProperty('authors');
  expect(record).toHaveProperty('license');
  expect(record).toHaveProperty('publication');
  expect(record).toHaveProperty('compound');
  expect(record).toHaveProperty('species');
  expect(record).toHaveProperty('acquisition');
  expect(record).toHaveProperty('mass_spectrometry');
  expect(record).toHaveProperty('peak');

  expect(record?.accession).toBe(accession);
  expect(record?.title).toBe(
    'Mellein; LC-ESI-ITFT; MS2; CE: 10; R=17500; [M+H]+',
  );
  expect(record?.peak).toBeDefined();
  expect(record?.peak.numPeak).toBe(5);
  expect(record?.peak.splash).toBe(
    'splash10-03fr-0900000000-035ec76d23650a15673b',
  );
});

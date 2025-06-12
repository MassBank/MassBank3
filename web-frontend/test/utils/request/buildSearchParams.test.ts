import { expect, expectTypeOf, test } from 'vitest';
import buildSearchParams from '../../../src/utils/request/buildSearchParams';
import SearchParams from '../../../src/types/SearchParams';
import ContentFilterOptions from '../../../src/types/filterOptions/ContentFilterOtions';

test('buildSearchParams with undefined content filter options', () => {
  const searchParams = buildSearchParams(undefined);
  expectTypeOf(searchParams).toEqualTypeOf<SearchParams>();
  expect(searchParams).toEqual({});
});

test('buildSearchParams with defined and empty content filter options', () => {
  const contentFilterOptions: ContentFilterOptions = {
    contributor: [{ value: 'AAFC' }],
    instrument_type: [],
    ms_type: [{ value: 'MS2' }],
    ion_mode: [],
  };
  const searchParams = buildSearchParams(contentFilterOptions);
  expectTypeOf(searchParams).toEqualTypeOf<SearchParams>();
  expect(searchParams).toEqual({
    contributor: ['AAFC'],
    ms_type: ['MS2'],
  });
});

test('buildSearchParams with solely defined content filter options', () => {
  const contentFilterOptions: ContentFilterOptions = {
    contributor: [{ value: 'AAFC' }, { value: 'IPB_Halle', count: 1 }],
    instrument_type: [{ value: 'LC-ESI-ITFT' }],
    ms_type: [{ value: 'MS2' }],
    ion_mode: [{ value: 'POSITIVE' }],
  };
  const searchParams = buildSearchParams(contentFilterOptions);
  expectTypeOf(searchParams).toEqualTypeOf<SearchParams>();
  expect(searchParams).toEqual({
    contributor: ['AAFC,IPB_Halle'],
    instrument_type: ['LC-ESI-ITFT'],
    ms_type: ['MS2'],
    ion_mode: ['POSITIVE'],
  });
});

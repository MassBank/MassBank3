import { expect, expectTypeOf, test } from 'vitest';
import buildSearchUrl from '../../src/utils/buildSearchUrl';

test('buildSearchUrl', () => {
  const label = 'compound_name';
  const value = 'rutin';
  const baseUrl = '/MassBank-api';
  const frontendUrl = 'http://localhost:8081';

  const url = buildSearchUrl(label, value, baseUrl, frontendUrl);
  expect(url).toBeDefined();
  expectTypeOf(url).toEqualTypeOf<string>();
  expect(url).toBe(frontendUrl + baseUrl + '/search?' + label + '=' + value);
});

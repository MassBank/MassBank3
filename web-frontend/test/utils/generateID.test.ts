import { expect, expectTypeOf, test } from 'vitest';
import generateID from '../../src/utils/generateID';

test('generateID test', () => {
  const id = generateID();
  expectTypeOf(id).toEqualTypeOf<string>();
  expect(id).toHaveLength(8);
});

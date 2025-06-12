import { expect, expectTypeOf, test } from 'vitest';
import getAtomCounts from '../../src/utils/getAtomCounts';

test('getAtomCounts C6H12O6 test', () => {
  const formula = 'C6H12O6';
  const counts = getAtomCounts(formula);

  expectTypeOf(counts).toEqualTypeOf<{ [atomType: string]: number }>();
  expect(counts).toEqual({
    C: 6,
    H: 12,
    O: 6,
  });
});

test('getAtomCounts CF2BrBH8Cl test', () => {
  const formula = 'CF2BrBH8Cl';
  const counts = getAtomCounts(formula);

  expectTypeOf(counts).toEqualTypeOf<{ [atomType: string]: number }>();
  expect(counts).toEqual({
    C: 1,
    F: 2,
    Br: 1,
    B: 1,
    H: 8,
    Cl: 1,
  });
});

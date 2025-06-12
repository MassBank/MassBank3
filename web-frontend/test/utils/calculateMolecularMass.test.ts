import { expect, expectTypeOf, test } from 'vitest';
import calculateMolecularMass from '../../src/utils/calculateMolecularMass';

test('calculateMolecularMass benzene', () => {
  const formula = 'C6H6';
  const mass = calculateMolecularMass(formula);
  expectTypeOf(mass).toEqualTypeOf<number>();
  expect(mass).toBeCloseTo(78.047, 3);
});

test('calculateMolecularMass glucose', () => {
  const formula = 'C6H12O6';
  const mass = calculateMolecularMass(formula);
  expectTypeOf(mass).toEqualTypeOf<number>();
  expect(mass).toBeCloseTo(180.063, 3);
});

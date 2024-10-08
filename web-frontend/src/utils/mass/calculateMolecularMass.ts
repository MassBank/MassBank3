import getAtomCounts from '../getAtomCounts';
import atomicMass from './atomicMass';

/**
 * Calculates the molecular mass of a chemical formula.
 * The molecular mass is the sum of the atomic masses of all the atoms in the formula.
 *
 * @param {string} formula - The chemical formula.
 * @returns {number} The molecular mass of the chemical formula.
 */
function calculateMolecularMass(formula: string): number {
  let mass = 0;
  const atomCounts = getAtomCounts(formula);

  for (const atom in atomCounts) {
    mass += atomCounts[atom] * atomicMass[atom];
  }

  return mass;
}

export default calculateMolecularMass;

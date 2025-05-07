/**
 * Returns the number of atoms per atom type for a given molecular formula.
 *
 * @param {string} mf
 */
function getAtomCounts(mf: string): { [atomType: string]: number } {
  const elements: Array<string> | null = mf ? mf.match(/[A-Z][a-z]{0,1}/g) : [];
  const counts: { [atomType: string]: number } = {};

  if (elements) {
    elements.forEach((elem) => {
      const regex = new RegExp(`(${elem}\\d+)`, 'g');
      const match = regex.exec(mf);
      let count = 1;
      if (match) {
        count = Number(match[0].split(elem)[1]);
      }
      counts[elem] = count;
    });
  }

  return counts;
}

export default getAtomCounts;

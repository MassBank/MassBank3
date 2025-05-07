import ClassificationData from '../types/ClassificationData';
import Metadata from '../types/Metadata';

function buildClassificationData(
  data: Metadata['compound_class_chemont'],
): ClassificationData {
  const hashmapCounts: Map<string, number> = new Map();
  const hashmapParents: Map<string, string> = new Map();
  const hashmapChildren: Map<string, string[]> = new Map();
  const hashmapLevels: Map<string, number> = new Map();
  const labels: string[] = [];

  data.forEach((d) => {
    const split = d.name.split('; ');
    const keys = split.slice(1);

    keys.forEach((key, i) => {
      if (hashmapCounts.has(key)) {
        hashmapCounts.set(key, hashmapCounts.get(key)! + d.count);
      } else {
        labels.push(key);
        hashmapCounts.set(key, d.count);
      }
      if (!hashmapParents.has(key)) {
        if (i > 0) {
          hashmapParents.set(key, keys[i - 1]);
        } else {
          hashmapParents.set(key, '');
        }
      }
      if (i < keys.length - 1) {
        if (!hashmapChildren.has(key)) {
          hashmapChildren.set(key, []);
        }
        if (!hashmapChildren.get(key)!.includes(keys[i + 1])) {
          hashmapChildren.get(key)!.push(keys[i + 1]);
        }
      }
      if (!hashmapLevels.has(key)) {
        hashmapLevels.set(key, i);
      }
    });
  });
  const parents: string[] = [];
  const values: number[] = [];
  labels.forEach((label) => {
    parents.push(hashmapParents.get(label) || '');
    values.push(hashmapCounts.get(label) || 0);
  });

  return {
    labels,
    parents,
    values,
    hashmapParents,
    hashmapChildren,
    hashmapLevels,
  };
}

export default buildClassificationData;

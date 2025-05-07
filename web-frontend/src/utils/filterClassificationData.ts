import ClassificationData from '../types/ClassificationData';

function filterClassificationData(
  selectedLabel: string,
  data: ClassificationData,
) {
  const selectedLevel = data.hashmapLevels.get(selectedLabel);
  if (selectedLevel === undefined) {
    return data;
  }
  const selectedLabels: string[] = [];
  const selectedParents: string[] = [];
  const selectedValues: number[] = [];

  const rootIndex = data.labels.findIndex((label) => label === selectedLabel);
  selectedLabels.push(data.labels[rootIndex]);
  selectedParents.push('');
  selectedValues.push(data.values[rootIndex]);

  const children = data.hashmapChildren.get(selectedLabel);
  if (children !== undefined) {
    // max level 1 (superclass)
    children.forEach((child) => {
      const childIndex = data.labels.findIndex((label) => label === child);
      if (childIndex !== -1) {
        selectedLabels.push(data.labels[childIndex]);
        selectedParents.push(data.parents[childIndex]);
        selectedValues.push(data.values[childIndex]);
      }
      const grandChildren = data.hashmapChildren.get(child);
      if (grandChildren !== undefined) {
        // max level 2 (class)
        grandChildren.forEach((grandChild) => {
          const grandChildIndex = data.labels.findIndex(
            (label) => label === grandChild,
          );
          if (grandChildIndex !== -1) {
            selectedLabels.push(data.labels[grandChildIndex]);
            selectedParents.push(data.parents[grandChildIndex]);
            selectedValues.push(data.values[grandChildIndex]);
          }
          const grandGrandChildren = data.hashmapChildren.get(grandChild);
          if (grandGrandChildren !== undefined) {
            // max level 3 (subclass)
            grandGrandChildren.forEach((grandGrandChild) => {
              const grandGrandChildIndex = data.labels.findIndex(
                (label) => label === grandGrandChild,
              );
              if (grandGrandChildIndex !== -1) {
                selectedLabels.push(data.labels[grandGrandChildIndex]);
                selectedParents.push(data.parents[grandGrandChildIndex]);
                selectedValues.push(data.values[grandGrandChildIndex]);
              }
            });
          }
        });
      }
    });
  }

  const selectedData: ClassificationData = {
    labels: selectedLabels,
    parents: selectedParents,
    values: selectedValues,
    hashmapParents: data.hashmapParents,
    hashmapChildren: data.hashmapChildren,
    hashmapLevels: data.hashmapLevels,
  };

  return selectedData;
}

export default filterClassificationData;

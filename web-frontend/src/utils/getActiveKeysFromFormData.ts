import SearchFields from '../types/filterOptions/SearchFields';

function getActiveKeysFromFormData(formData: SearchFields) {
  const keys: string[] = [];

  if (formData.compoundSearchFilterOptions) {
    let isActive = false;
    Object.keys(formData.compoundSearchFilterOptions).forEach((key) => {
      if (
        formData.compoundSearchFilterOptions &&
        formData.compoundSearchFilterOptions[key] !== undefined &&
        ((typeof formData.compoundSearchFilterOptions[key] === 'string' &&
          formData.compoundSearchFilterOptions[key].length > 0) ||
          (typeof formData.compoundSearchFilterOptions[key] === 'number' &&
            key !== 'massTolerance'))
      ) {
        keys.push('compoundSearchFilterOptions.' + key);
        isActive = true;
        if (key === 'inchi' || key === 'structure') {
          keys.push('compoundSearchFilterOptions.' + key + '.menuItem');
        }
      }
    });
    if (isActive) {
      keys.push('compoundSearchFilterOptions');
    }
  }

  if (formData.spectralSearchFilterOptions) {
    let isActive = false;
    Object.keys(formData.spectralSearchFilterOptions).forEach((key) => {
      if (key === 'splash') {
        if (
          formData.spectralSearchFilterOptions &&
          formData.spectralSearchFilterOptions[key] &&
          formData.spectralSearchFilterOptions[key].length > 0
        ) {
          keys.push('spectralSearchFilterOptions.' + key);
          keys.push('spectralSearchFilterOptions.' + key + '.menuItem');
          isActive = true;
        }
      } else {
        if (
          formData.spectralSearchFilterOptions &&
          formData.spectralSearchFilterOptions[key]
        ) {
          Object.keys(formData.spectralSearchFilterOptions[key]).forEach(
            (key2) => {
              if (
                formData.spectralSearchFilterOptions &&
                formData.spectralSearchFilterOptions[key] &&
                formData.spectralSearchFilterOptions[key][key2] &&
                formData.spectralSearchFilterOptions[key][key2].length > 0
              ) {
                keys.push('spectralSearchFilterOptions.' + key);
                keys.push('spectralSearchFilterOptions.' + key + '.menuItem');

                keys.push('spectralSearchFilterOptions.' + key + '.' + key2);
                keys.push(
                  'spectralSearchFilterOptions.' +
                    key +
                    '.' +
                    key2 +
                    '.menuItem',
                );
                isActive = true;
              }
            },
          );
        }
      }
    });

    if (isActive) {
      keys.push('spectralSearchFilterOptions');
    }
  }

  if (formData.propertyFilterOptions) {
    let isActive = false;
    Object.keys(formData.propertyFilterOptions).forEach((key) => {
      if (
        formData.propertyFilterOptions &&
        formData.propertyFilterOptions[key].length > 0
      ) {
        keys.push(`propertyFilterOptions.${key}`);
        isActive = true;
      }
    });
    if (isActive) {
      keys.push(`propertyFilterOptions`);
    }
  }

  return keys;
}

export default getActiveKeysFromFormData;

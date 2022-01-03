import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export const updateDict =
  (prev, saveAsync) =>
  (field, value, save = false, nested = '') => {
    let dataCopy = cloneDeep(prev);
    if (nested) {
      const nestedLayers = nested.split('.');
      const nestedData = nestedLayers
        .reverse()
        .reduce((acc, v) => ({ [v]: acc }), { [field]: value });
      dataCopy = merge(dataCopy, nestedData);
    } else {
      dataCopy[field] = value;
    }
    if (save) {
      saveAsync(dataCopy);
    }
    return dataCopy;
  };

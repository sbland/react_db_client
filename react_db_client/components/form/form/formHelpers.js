// import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export const validateInput = () => {};

export /**
 *
 *
 * @param {*} headings
 * @param {*} editData
 * @param {*} data
 * @returns ValidationData{
 *    isValid: <BOOLEAN>
 *    missingFields: <ARRAY>
 * }
 */
const validateSubmit = (headings, editData, data) => {
  const validationData = {
    isValid: true,
  };
  const requiredFields = headings.filter((h) => h.required).map((h) => h.uid);
  const mergedData = merge(data, editData);
  // check all required fields are entered
  validationData.missingFields = requiredFields.filter((field) => mergedData[field] == null);

  // Check valid
  if (validationData.missingFields.length > 0) validationData.isValid = false;

  return validationData;
};

import { evaluate } from 'mathjs';
import comparisons from '../../../GenericConstants/comparisons';
import filterTypes from '../../../GenericConstants/filterTypes';
import { RowErrors } from '../errorTypes';

const generateRowUid = () => `row_${Date.now()}`;

export const generateNewRowData = (headings, inputData = {}) => {
  const uid = generateRowUid();
  const newRowData = headings.reduce(
    (acc, h) => {
      const headingUid = h.uid;
      if (headingUid === 'uid') return acc;
      if (inputData[headingUid]) {
        // data already provided
        return acc;
      }
      acc[headingUid] = h.defaultValue || undefined;
      return acc;
    },
    { ...inputData, uid }
  );
  return newRowData;
};

export const calculateColumnTotals = (tableData, columnIds) => {
  const result = {};
  columnIds.forEach((col) => {
    let sum = 0;
    tableData.forEach((row) => {
      if (typeof row[col] === 'number') {
        sum += row[col];
      }
      if (typeof row[col] === 'string' && row[col].match(/^[0-9.]*$/)) {
        sum += Number(row[col]);
      }
    });
    result[col] = sum;
  });
  return result;
};

export const replaceColumnIdsInExpression = (pattern, rowData) => {
  // 2. replace variables in pattern
  let patternReplaced = pattern;
  let invalid = false;

  const colMatches = Array.from(new Set(pattern.match(/(\$[A-Za-z0-9]+)/g)));
  colMatches.forEach((match) => {
    const reg = new RegExp(`(\\${match})(?=[^a-zA-Z0-9]|$)`, 'g');
    const val = rowData[match.replace('$', '')];
    if (
      val === undefined ||
      val === null ||
      val === 'INVALID' ||
      Number.isNaN(Number(val)) ||
      val === ''
    )
      invalid = true;
    patternReplaced = patternReplaced.replace(reg, val);
  });
  // 3. Evaluate for row
  return !invalid ? patternReplaced : false;
};

export const evaluateRow = (pattern, rowData) => {
  if (!pattern) throw Error('Missing pattern');
  const patternReplaced = replaceColumnIdsInExpression(pattern, rowData);
  const result = patternReplaced ? evaluate(patternReplaced) : 'INVALID';
  return result;
};

const stringContains = (val, searchTerm) => val.search(new RegExp(searchTerm)) !== -1;

/**
 * Evaluate a string operator
 *
 * @param {*} field
 * @param {*} operator
 * @param {*} target
 * @param {*} rowData
 * @returns
 */
export const evaluateStrRow = (field, operator, target, invert, rowData) => {
  // 2. replace variables in pattern
  if (!field) throw Error('Missing field');
  if (!operator) throw Error('Missing operator');
  if (!target) throw Error('Missing target');

  const value = rowData[field];
  if (value === undefined || value === null) return 'INVALID';

  let result = null;

  // 3. Evaluate for row
  switch (operator) {
    case comparisons.equals:
      result = value === target;
      break;
    case comparisons.contains:
      result = stringContains(value, target);
      break;
    default:
      throw Error('Invalid operator');
  }

  if (result === null) return 'ERROR';

  return invert === true ? !result : result;
};

// eslint-disable-next-line no-unused-vars
export const assignDefaultValues = (data, headings) => {
  throw Error('Not Implemented');
};

export const evaluateExpressionColumns = (data, headingsDataList) =>
  data.map((rowData) => {
    const rowOut = { ...rowData };
    headingsDataList.forEach((headingData) => {
      const { uid: headingUid, evaluateType } = headingData;
      if (evaluateType === 'number') {
        const { expression } = headingData;
        if (!expression) throw Error('Missing expression');
        rowOut[headingUid] = evaluateRow(expression, rowOut);
      }
      if (evaluateType === 'string') {
        const { field, target, invert, operator } = headingData;
        if (!operator) throw Error('Missing operator');
        rowOut[headingUid] = evaluateStrRow(field, operator, target, invert, rowOut);
      }
    });
    return rowOut;
  });

export const sortTableData = (data, sortBy) => {
  // 3. If sort by is set then sort rows
  // TODO: Why does copying inside the sort by if statement cause tests to fail?
  const copiedData = data.slice(); // potentially heavy action!
  if (sortBy) {
    const { heading, direction, map, type, natural } = sortBy;
    copiedData.sort((a, b) => {
      const aVal = a[heading];
      const bVal = b[heading];

      // Send invalid values to back
      if (aVal === '' || aVal === null || aVal === undefined || aVal === 'INVALID') return 1;
      if (bVal === '' || bVal === null || bVal === undefined || bVal === 'INVALID') return -1;

      if (type === filterTypes.number) {
        return Number(aVal) - Number(bVal);
      }
      // TODO: Add checks for other filterTypes
      if (map) {
        // If using custom map compare index in map
        if (map.indexOf(aVal) < map.indexOf(bVal)) return direction ? -1 : 1;
        if (map.indexOf(aVal) > map.indexOf(bVal)) return direction ? 1 : -1;
      }
      if (natural) {
        // TODO: Could optimize this by using Intl.Collator
        const language = 'en';
        const compare = aVal.localeCompare(bVal, language, { numeric: true });
        return direction ? compare : -compare;
      }
      if (aVal > bVal) return direction ? 1 : -1;
      if (aVal < bVal) return direction ? -1 : 1;
      return 0;
    });
  }
  return copiedData;
};

export const checkIsDuplicate = (evaluatedData, rowData, rowIndex) => (h) => {
  const cellData = rowData[h.uid];
  const duplicateItem = evaluatedData.findIndex(
    (rowJ, j) => j !== rowIndex && rowJ[h.uid] === cellData
  );
  const isDuplicateItem = duplicateItem !== -1;
  return isDuplicateItem;
};

export const checkIsMissing = (evaluatedData, rowData, _rowIndex) => (h) => {
  const cellData = rowData[h.uid];
  return !cellData;
};

export const validateRow = (evaluatedData, uniqueHeadings, requiredHeadings) => (row, i) => {
  /* NOTE: Only the first error is returned */
  /* Handle unique headings */
  const duplicateHeading = uniqueHeadings.find(checkIsDuplicate(evaluatedData, row, i));
  if (duplicateHeading) {
    const invalidMessage = {
      text: `Duplicate ${duplicateHeading.label}`,
      type: RowErrors.DUPLICATE,
    };
    return [true, invalidMessage];
  }
  /* Handle required headings */
  const missingRequired = requiredHeadings.find(checkIsMissing(evaluatedData, row, i));
  if (missingRequired) {
    const invalidMessage = {
      text: `Missing ${missingRequired.label}`,
      type: RowErrors.MISSING,
    };
    return [true, invalidMessage];
  }

  return [false, null];
};

export const validateRows = (headings, data) => {
  const uniqueHeadings = headings.filter((h) => h.unique);
  const requiredHeadings = headings.filter((h) => h.required);
  return data.map(validateRow(data, uniqueHeadings, requiredHeadings)).reduce(
    (acc, v) =>
      acc
        ? [
            [...acc[0], v[0]],
            [...acc[1], v[1]],
          ]
        : [[v[0]], [v[1]]],
    [[], []]
  );
};

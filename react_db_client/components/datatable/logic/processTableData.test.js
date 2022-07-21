import { comparisons, filterTypes } from '@react_db_client/constants.client-types';

import {
  demoTableData,
  demoHeadingsData,
} from '@samnbuk/react_db_client.components.datatable.extras';

import {
  evaluateExpressionColumns,
  generateNewRowData,
  sortTableData,
  replaceColumnIdsInExpression,
} from './processTableData';

Date.now = jest.fn().mockImplementation(() => 0);

describe('Process Table Data', () => {
  describe('sorting', () => {
    test('should sort alphabetically', () => {
      const sortByHeading = 'name';
      const tableData = Object.keys(demoTableData).map((k) => demoTableData[k]);
      const processedData = sortTableData(tableData, { heading: sortByHeading, direction: 1 });

      const values = processedData.map((item) => item[sortByHeading]);
      const expectedFilteredData = ['Bar', 'C', 'Foo', 'Foobar', ''];
      expect(values).toEqual(expectedFilteredData);
    });
    test('should sort alphabetically - reversed', () => {
      const sortByHeading = 'name';
      const tableData = Object.keys(demoTableData).map((k) => demoTableData[k]);
      const processedData = sortTableData(tableData, { heading: sortByHeading, direction: 0 });

      const values = processedData.map((item) => item[sortByHeading]);
      const expectedFilteredData = ['Foobar', 'Foo', 'C', 'Bar', ''];
      expect(values).toEqual(expectedFilteredData);
    });
    test('should sort alphabetically - natural numbers', () => {
      /* E.g. "44a" should come after "4a" */
      const sortByHeading = 'natid';
      const tableData = Object.keys(demoTableData).map((k) => demoTableData[k]);
      const processedData = sortTableData(tableData, {
        heading: sortByHeading,
        direction: 1,
        natural: true,
      });

      const values = processedData.map((item) => item[sortByHeading]);
      const expectedFilteredData = ['10a', '50a', '100a', undefined, undefined];
      expect(values).toEqual(expectedFilteredData);
    });
    test('should sort alphabetically - natural numbers - reversed', () => {
      /* E.g. "44a" should come after "4a" */
      const sortByHeading = 'natid';
      const tableData = Object.keys(demoTableData).map((k) => demoTableData[k]);
      const processedData = sortTableData(tableData, {
        heading: sortByHeading,
        direction: 0,
        natural: true,
      });

      const values = processedData.map((item) => item[sortByHeading]);
      const expectedFilteredData = ['100a', '50a', '10a', undefined, undefined];
      expect(values).toEqual(expectedFilteredData);
    });
    test('should sort numerical', () => {
      const sortByHeading = 'count';
      const tableData = Object.keys(demoTableData).map((k) => demoTableData[k]);
      const sortObject = { heading: sortByHeading, direction: 1, type: filterTypes.number };
      const processedData = sortTableData(tableData, sortObject);

      const values = processedData.map((item) => item[sortByHeading]);
      const expectedFilteredData = [3, 3, '99', undefined, undefined];
      expect(values).toEqual(expectedFilteredData);
    });

    test('should sort numerical - reversed', () => {
      const sortByHeading = 'count';
      const tableData = Object.keys(demoTableData).map((k) => demoTableData[k]);
      const processedData = sortTableData(tableData, { heading: sortByHeading, direction: 0 });

      const values = processedData.map((item) => item[sortByHeading]);
      const expectedFilteredData = ['99', 3, 3, undefined, undefined];
      expect(values).toEqual(expectedFilteredData);
    });
    test('should sort by custom mapping', () => {
      const sortByHeading = 'name';
      const customSortMap = ['Foo', 'C', 'Bar', 'Foobar'];
      const tableData = Object.keys(demoTableData).map((k) => demoTableData[k]);
      const processedData = sortTableData(tableData, {
        heading: sortByHeading,
        direction: 1,
        map: customSortMap,
      });

      const values = processedData.map((item) => item[sortByHeading]);
      const expectedFilteredData = ['Foo', 'C', 'Bar', 'Foobar', ''];
      expect(values).toEqual(expectedFilteredData);
    });
  });
  describe('Evaluation', () => {
    test('should evaluate simple addition expression column', () => {
      const headings = [
        {
          uid: 'expressionb',
          label: 'Expression',
          type: 'number',
          evaluateType: 'number',
          expression: '$count * $multiplier',
        },
        ...demoHeadingsData,
      ];
      const tableData = [
        {
          uid: 'a',
          name: 'Foo',
          count: 3,
          multiplier: 2,
        },
      ];
      const evaluatedData = evaluateExpressionColumns(tableData, headings);
      expect(evaluatedData[0].expressionb).toEqual(3 * 2);
    });
    test('should evaluate string check', () => {
      const headings = [
        {
          uid: 'expressionb',
          label: 'Expression',
          type: 'string',
          evaluateType: 'string',
          field: 'name',
          operator: comparisons.equals,
          target: 'Foo',
        },
        ...demoHeadingsData,
      ];

      const tableData = [
        {
          uid: 'a',
          name: 'Foo',
          count: 3,
          multiplier: 2,
        },
      ];
      const evaluatedData = evaluateExpressionColumns(tableData, headings);
      expect(evaluatedData[0].expressionb).toEqual(true);
    });
  });

  describe('Creating new rows', () => {
    test('should create a new row with defaults applied', () => {
      const headings = [
        { uid: 1, defaultValue: 10 },
        { uid: 2, defaultValue: 99 },
        { uid: 3 },
        { uid: 'uid' },
      ];
      const newRowData = generateNewRowData(headings);
      expect(newRowData).toEqual({
        1: 10,
        2: 99,
        3: undefined,
        uid: 'row_0',
      });
    });
    test('should create a new row with input data applied', () => {
      const headings = [{ uid: 1, defaultValue: 10 }, { uid: 2, defaultValue: 99 }, { uid: 3 }];
      const inputData = { 3: 33 };
      const newRowData = generateNewRowData(headings, inputData);
      expect(newRowData).toEqual({
        1: 10,
        2: 99,
        3: 33,
        uid: 'row_0',
      });
    });
  });
  describe('replaceColumnIdsInExpression', () => {
    const pattern = '$count * $multiplier';
    test('should replace column ids in pattern', () => {
      const demoRowData = {
        uid: 'a',
        count: 4,
        multiplier: 10,
      };
      const patternOut = replaceColumnIdsInExpression(pattern, demoRowData);
      expect(patternOut).toEqual('4 * 10');
    });
    test('should return invalid if column does not exist', () => {
      const demoRowData = {
        uid: 'a',
        count: 4,
      };
      const patternOut = replaceColumnIdsInExpression(pattern, demoRowData);
      expect(patternOut).toEqual(false);
    });
    test('should return invalid if column data is empty', () => {
      const demoRowData = {
        uid: 'a',
        count: 4,
        multiplier: '',
      };
      const patternOut = replaceColumnIdsInExpression(pattern, demoRowData);
      expect(patternOut).toEqual(false);
    });
  });
  describe('Evaluate Row', () => {
    // TODO: Test this
    // const pattern = '$count * $multiplier';
    // evaluateRow(pattern, [])
  });
});

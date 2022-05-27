import { filterTypes } from '@react_db_client/constants.client-types';

import { sanitizeCellData, stringifyData, formatValue } from './stringify-data';

describe('Stringify Data', () => {
  describe('formatValue', () => {
    test('should formatValue', () => {
      const v = 4321.456;
      expect(formatValue(v, 0.01)).toEqual(4321.46);
      expect(formatValue(v, 0.1)).toEqual(4321.5);
      expect(formatValue(v, 100)).toEqual(4300.0);
      expect(formatValue(v, 1)).toEqual(4321);
      expect(formatValue(4321, 1)).toEqual(4321);
    });
  });
  describe('sanitizeValue', () => {
    const options = [
      ['hello', filterTypes.text, 'hello'],
      ['hello', filterTypes.number, 'Invalid', { step: 0.1 }],
      ['43.1234', filterTypes.number, 43.1, { step: 0.1 }],
      [undefined, filterTypes.number, 0, { step: 0.1 }],
      [null, filterTypes.number, 0, { step: 0.1 }],
      [undefined, filterTypes.string, ''],
      [null, filterTypes.string, ''],
      [12345, filterTypes.number, 12345.0, { step: 0.1 }],
    ];
    options.forEach(([v, type, out, args]) => {
      test(`should sanitize value ${v} with column type ${type}`, () => {
        const vout = sanitizeCellData(v, { label: 'Name', type, ...args });
        expect(vout).toEqual(out);
      });
    });
    test('should handle column data being undefined', () => {
      const vout = sanitizeCellData('hello', undefined);
      expect(vout).toEqual('hello');
    });
  });
  describe('Stringify Data', () => {
    const options = [
      ['hello', { type: filterTypes.text }, 'hello'],
      ['hello', { type: filterTypes.number, step: 0.1 }, 'Invalid'],
      ['43.1234', { type: filterTypes.number, step: 0.1 }, '43.1'],
      [43.1234, { type: filterTypes.number, step: 0.1 }, '43.1'],
      [43.1234, { type: filterTypes.number, step: 0.01 }, '43.12'],
      [43.1234, { type: filterTypes.number, step: 1 }, '43'],
      [43.1234, { type: filterTypes.number, step: 10 }, '40'],
      [43, { type: filterTypes.number, step: 0.01 }, '43.00'],
      [11222333, { type: filterTypes.number, step: 0.01, commas: true }, '11,222,333.00'],
      [12345678.9, { type: filterTypes.number, step: 0.01, commas: true }, '12,345,678.90'],
      [12345678.9, { type: filterTypes.number, step: 0.01, commas: true }, '12,345,678.90'],
      [123, { type: filterTypes.number, step: 0.01, commas: true }, '123.00'],
      [123, { type: filterTypes.number, step: 1, commas: true }, '123'],
      [undefined, { type: filterTypes.number, step: 0.1 }, ''],
      [null, { type: filterTypes.number, step: 0.1 }, ''],
      [undefined, { type: filterTypes.text }, ''],
      [null, { type: filterTypes.text }, ''],
      ['', { type: filterTypes.text }, ''],
    ];
    const customParsers = [];
    options.forEach(([v, metaData, out]) => {
      const { type } = metaData;
      test(`should stringify value ${v} with column type ${type}`, () => {
        const vout = stringifyData(v, metaData, customParsers);
        expect(vout).toEqual(out);
      });
    });
    test('should handle column data being undefined', () => {
      const vout = sanitizeCellData('hello', undefined);
      expect(vout).toEqual('hello');
    });
  });
});

import { EFilterType } from '@react_db_client/constants.client-types';

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
    const options: [any, EFilterType, any, object?][] = [
      ['hello', EFilterType.text, 'hello'],
      ['hello', EFilterType.number, 'Invalid', { step: 0.1 }],
      ['43.1234', EFilterType.number, 43.1, { step: 0.1 }],
      [undefined, EFilterType.number, 0, { step: 0.1 }],
      [null, EFilterType.number, 0, { step: 0.1 }],
      [undefined, EFilterType.text, ''],
      [null, EFilterType.text, ''],
      [12345, EFilterType.number, 12345.0, { step: 0.1 }],
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
    const options: [any, { type: EFilterType; step?: number; commas?: boolean }, string][] = [
      ['hello', { type: EFilterType.text }, 'hello'],
      ['hello', { type: EFilterType.number, step: 0.1 }, 'Invalid'],
      ['43.1234', { type: EFilterType.number, step: 0.1 }, '43.1'],
      [43.1234, { type: EFilterType.number, step: 0.1 }, '43.1'],
      [43.1234, { type: EFilterType.number, step: 0.01 }, '43.12'],
      [43.1234, { type: EFilterType.number, step: 1 }, '43'],
      [43.1234, { type: EFilterType.number, step: 10 }, '40'],
      [43, { type: EFilterType.number, step: 0.01 }, '43.00'],
      [11222333, { type: EFilterType.number, step: 0.01, commas: true }, '11,222,333.00'],
      [12345678.9, { type: EFilterType.number, step: 0.01, commas: true }, '12,345,678.90'],
      [12345678.9, { type: EFilterType.number, step: 0.01, commas: true }, '12,345,678.90'],
      [123, { type: EFilterType.number, step: 0.01, commas: true }, '123.00'],
      [123, { type: EFilterType.number, step: 1, commas: true }, '123'],
      [undefined, { type: EFilterType.number, step: 0.1 }, ''],
      [null, { type: EFilterType.number, step: 0.1 }, ''],
      [undefined, { type: EFilterType.text }, ''],
      [null, { type: EFilterType.text }, ''],
      ['', { type: EFilterType.text }, ''],
    ];
    const customParsers = [];
    options.forEach(([v, metaData, out]) => {
      const { type } = metaData;
      test(`should stringify value ${v} with column type ${type}`, () => {
        const vout = stringifyData(v, { uid: 'test', ...metaData }, customParsers);
        expect(vout).toEqual(out);
      });
    });
    test('should handle column data being undefined', () => {
      const vout = sanitizeCellData('hello', undefined);
      expect(vout).toEqual('hello');
    });
  });
});

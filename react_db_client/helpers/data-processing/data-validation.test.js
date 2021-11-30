import { validateValue } from './data-validation';

describe('Utils', () => {
  test('should Validate Value', () => {
    const v = 4321.456;
    expect(validateValue(v, 1, 9999, 0.1, 99.99)).toEqual(4321.5);
    expect(validateValue(v, 1, 9999, 0.01, 99.99)).toEqual(4321.46);
    expect(validateValue(v, 1, 9999, 1, 99.99)).toEqual(4321);
    expect(validateValue(null, 1, 9999, 0.01, 99.99)).toEqual(99.99);
  });
});

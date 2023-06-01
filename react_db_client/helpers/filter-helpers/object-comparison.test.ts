import { deepIsEqual } from './object-comparison';

describe('Deep is equal', () => {
  it('should return true if two objects are empty', () => {
    expect(deepIsEqual({}, {})).toBe(true);
  });
  it('should return true if two objects are the same', () => {
    expect(deepIsEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });
  it('should return false if two objects are different', () => {
    expect(deepIsEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });
  it('should return true if two objects are the same, but in different order', () => {
    expect(deepIsEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });
  // Primitives
  test('should return true for equal numbers', () => {
    expect(deepIsEqual(5, 5)).toBe(true);
  });

  test('should return false for different numbers', () => {
    expect(deepIsEqual(5, 10)).toBe(false);
  });

  test('should return true for equal strings', () => {
    expect(deepIsEqual('hello', 'hello')).toBe(true);
  });

  test('should return false for different strings', () => {
    expect(deepIsEqual('hello', 'world')).toBe(false);
  });

  test('should return true for equal null values', () => {
    expect(deepIsEqual(null, null)).toBe(true);
  });

  test('should return false for different null and undefined values', () => {
    expect(deepIsEqual(null, undefined)).toBe(false);
  });

  test('should return true for equal undefined values', () => {
    expect(deepIsEqual(undefined, undefined)).toBe(true);
  });

  test('should return false for different undefined and null values', () => {
    expect(deepIsEqual(undefined, null)).toBe(false);
  });

  // Objects
  test('should return true for equal empty objects', () => {
    expect(deepIsEqual({}, {})).toBe(true);
  });

  test('should return true for equal objects with unordered properties', () => {
    expect(deepIsEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  test('should return false for objects with different property values', () => {
    expect(deepIsEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });

  test('should return true for equal nested objects', () => {
    expect(deepIsEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
  });

  test('should return false for nested objects with different values', () => {
    expect(deepIsEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
  });

  // Arrays
  test('should return true for equal empty arrays', () => {
    expect(deepIsEqual([], [])).toBe(true);
  });

  test('should return true for equal arrays', () => {
    expect(deepIsEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  test('should return false for arrays with different order', () => {
    expect(deepIsEqual([1, 2, 3], [3, 2, 1])).toBe(false);
  });

  test('should return true for equal nested arrays and objects', () => {
    expect(deepIsEqual([1, { a: 2 }, [3]], [1, { a: 2 }, [3]])).toBe(true);
  });
});

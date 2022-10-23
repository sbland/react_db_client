import { formatValue } from './stringify-data';

/**
 * Validate and sanitize a number value
 * @param {number} vIn value to validate
 * @param {number} min minium allowed value
 * @param {number} max max allowed value
 * @param {number} step decimal number identifying number of decimal places
 * @param {number} defaultValue The default value to use if is invalid
 * @returns number
 */
export const validateValue = (
  vIn: number | null,
  min: number,
  max: number,
  step: number,
  defaultValue?: number
): number | '' => {
  if (vIn == null) return defaultValue || '';
  const v = Number(vIn);
  if (v < min) return min;
  if (v > max) return max;
  const newVal = formatValue(v, step, true);
  if (Number.isNaN(newVal)) return '';
  return newVal;
};

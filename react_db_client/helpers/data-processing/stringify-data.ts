import {
  EFilterType,
  ILabelled,
  Uid,
} from '@react_db_client/constants.client-types';
import { switchF, tryF } from '@react_db_client/helpers.func-tools';

/**
 * Format a number with decimal place
 * @param {number} v The number to format
 * @param {number} step decimal number to limit decimal places
 * @returns number
 */
export const formatValue = (
  v: number,
  step: number = 0.01,
  strict: boolean = false
): number => {
  const [whole] = v.toFixed(100).split('.');
  if (!Number(v) && !strict) return 0;
  // match accuracy of step size
  if (step === 1) {
    return parseFloat(whole);
  }
  if (Math.floor(step) === step) {
    // Has no decimal places
    const accuracy = step.toString().length;
    const vLength = whole.length;
    if (vLength >= step.toString().length)
      return Math.round(Number(whole) / step) * step;
    const vSuff = v
      .toString()
      .split('.')[0]
      .slice(0, vLength - accuracy + 1);
    return parseFloat(vSuff) * 10 ** (accuracy - vSuff.length + 1);
  }
  // Has decimal places
  const accuracy = step.toString().split('.')[1].length;
  return parseFloat(v.toFixed(accuracy));
};

/**
 *
 * @param {object} data data with default values and type
 * @returns
 */
export const getDefaultValue = <T extends any>(data: {
  defaultValue?: T;
  type?: EFilterType;
}): T | '' => {
  if (data.defaultValue !== undefined) return data.defaultValue;
  if (data.type === EFilterType.number) return 0 as T;
  if (data.type === EFilterType.bool) return false as T;
  if (data.type === EFilterType.toggle) return false as T;
  return '';
};

export const sanitizeNumber = (
  cellData: any,
  columnData: { step?: number } = {}
): number | 'Invalid' =>
  !Number.isNaN(Number(cellData))
    ? formatValue(Number(cellData), columnData.step)
    : 'Invalid';

export const sanitizeCellData = <T>(
  cellData: any,
  columnData: {
    defaultValue?: T;
    label?: string;
    name?: string;
    type?: EFilterType;
    step?: number;
  } = {}
) =>
  switchF<any, unknown>(
    typeof cellData,
    {
      // TODO: textLong
      object: () =>
        cellData !== null
          ? cellData.label || cellData.name
          : getDefaultValue(columnData),
      number: () => sanitizeNumber(cellData, columnData),
      string: () =>
        columnData.type === EFilterType.number
          ? sanitizeNumber(cellData, columnData)
          : cellData,
      undefined: () => (columnData.type === EFilterType.number ? 0 : ''),
    },
    () => cellData
  );

export const stringifyNumber = (
  data: string | number,
  metaData: { step?: number; commas?: boolean }
) => {
  const { step, commas } = metaData;
  if (data === null || data === undefined) return '';
  const dataParsed = Number(data);
  if (Number.isNaN(dataParsed)) return 'Invalid';
  const [whole, point] = `${formatValue(dataParsed, step)}`.split('.');
  if (!step) return point !== undefined ? `${whole}.${point}` : whole;
  if (step >= 1.0) return whole;
  const pointLength = step.toString().split('.')[1].length;
  const formattedPoint = `${point || 0}000000000`.slice(0, pointLength);
  if (!formattedPoint) return whole;
  if (commas) {
    // TODO: Need to reverse
    const wholeCommas =
      whole
        .split('')
        .reverse()
        .join('')
        .match(/.{1,3}/g)
        ?.map((v) => v.split('').reverse().join(''))
        .reverse()
        .join(',') || 'Invalid';
    return `${wholeCommas}.${formattedPoint}`;
  }
  return `${whole}.${formattedPoint}`;
};

export const stringifyText = (data: null | string) =>
  data === null || data === undefined ? '' : data;
export const stringifyBool = (data: boolean) => (data ? 'Yes' : 'No');
export const stringifyDict = (
  data: { label?: string; name?: string },
  metaData: { labelField?: string }
) => {
  if (!data) return '';
  if (metaData.labelField) return data[metaData.labelField] || '';
  return data.label || data.name || 'Invalid Object';
};
export const stringifyLabelledObject = (data: null | ILabelled, _metaData) => {
  return data ? data.label || 'MISSING LABEL' : '';
};

export const stringifyList =
  (stringifyFn) => (data: null | string[], metaData) =>
    data === null || data === undefined
      ? ''
      : data.map((v) => stringifyFn(v, metaData)).join(',');

export const stringifyDate = (data: Date, _metaData) =>
  tryF(
    () => {
      const a = new Date(data);
      return a.toLocaleString();
    },
    () => 'Invalid Date'
  );

/* Individual components should override image parsing if they need to display the image */
export const stringifyImage = (data: string, _metaData) => data;

export type Parser = (data: any, metadata: {}) => string;
/**
 * Parse an item using meta data and type based parser
 *
 * Meta data contents:
 * - type
 * - step
 *
 * Parser signature
 * (data, metaData) => parsedValue
 *
 * @param {any} item the data to parse
 * @param {object} metaData column data to parse to
 * @param {objectOf} customParsers dict containing custom parsers
 * @returns parsed item
 */
export const stringifyData = (
  item: any,
  metaData: {
    uid: Uid;
    type: EFilterType | string;
    step?: number;
    commas?: boolean;
    labelField?: string;
  },
  customParsers = {},
  strict = true
) => {
  const parser = switchF<EFilterType | string, Parser>(
    metaData.type,
    {
      [EFilterType.text]: () => stringifyText,
      [EFilterType.textLong]: () => stringifyText,
      [EFilterType.button]: () => stringifyText,
      [EFilterType.select]: () => stringifyText, // TODO: Should this use label instead of just data?
      [EFilterType.selectMulti]: () => stringifyList(stringifyLabelledObject), // TODO: Should this use label instead of just data?
      [EFilterType.number]: () => stringifyNumber,
      [EFilterType.bool]: () => stringifyBool,
      [EFilterType.toggle]: () => stringifyBool,
      [EFilterType.dict]: () => stringifyDict,
      [EFilterType.date]: () => stringifyDate,
      [EFilterType.image]: () => stringifyImage,
      [EFilterType.file]: () => stringifyLabelledObject,
      [EFilterType.fileMultiple]: () => stringifyList(stringifyLabelledObject),
      [EFilterType.reference]: () => stringifyLabelledObject,
      link: () => stringifyText,
      /* Note: Custom parsers override the above defaults */
      ...Object.entries(customParsers).reduce((acc, [key, customParser]) => {
        acc[key] = () => customParser;
        return acc;
      }, {}),
    },
    () => {
      if (strict)
        throw Error(
          `Missing parser for ${metaData.uid} of type ${metaData.type}`
        );
      return (d) => d;
    }
  );

  const itemType = typeof item;

  if (itemType === 'object' && Array.isArray(item)) {
    return item
      .slice(0, 5)
      .map((subItem) => stringifyData(subItem, metaData, customParsers))
      .flat()
      .join(', ');
  }
  return parser(item, metaData);

  // if (['string', 'number'].indexOf(itemType) !== -1) return item;
  // if (itemType === 'boolean') return item ? 'Yes' : 'No';
  // if (itemType === 'object' && Array.isArray(item) && item.length === 0) return ' - ';
  // if (itemType === 'object' && Array.isArray(item) && typeof item[0] === 'string')
  //   return item.slice(0, 5).join(', ');
  // if (itemType === 'object' && Array.isArray(item) && typeof item[0] === 'object' && item[0].name)
  //   return item
  //     .slice(0, 5)
  //     .map((i) => i.name)
  //     .join(', ');
  // if (itemType === 'object' && Array.isArray(item) && typeof item[0] === 'object' && item[0].uid)
  //   return item
  //     .slice(0, 5)
  //     .map((i) => i.uid)
  //     .join(', ');
  // if (itemType === 'object') return JSON.stringify(item);
  // return item;
  // // throw Error('Invalid item type');
};

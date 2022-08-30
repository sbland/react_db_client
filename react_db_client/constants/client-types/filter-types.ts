import { EComparisons } from './comparisons';

export enum EFilterType {
  text = 'text',
  textLong = 'textLong',
  select = 'select',
  selectMulti = 'selectMulti',
  selectSearch = 'selectSearch',
  bool = 'bool',
  toggle = 'toggle',
  date = 'date',
  number = 'number',
  uid = 'uid',
  reference = 'reference',
  file = 'file',
  fileMultiple = 'fileMultiple',
  image = 'image',
  embedded = 'embedded',
  // TODO:  Below should not be filter types
  button = 'button',
  dict = 'dict',
  video = 'video',
}

export const filterTypes: Record<EFilterType, string> = {
  text: 'text',
  textLong: 'textLong',
  select: 'select',
  selectMulti: 'selectMulti',
  selectSearch: 'selectSearch',
  bool: 'bool',
  toggle: 'toggle',
  date: 'date',
  number: 'number',
  uid: 'uid',
  reference: 'reference',
  file: 'file',
  fileMultiple: 'fileMultiple',
  image: 'image',
  embedded: 'embedded',
  // TODO: Below should not be filter types
  button: 'button',
  dict: 'dict',
  video: 'video',
};

export const filterTypesDefaults: Record<EFilterType, any> = {
  text: '',
  textLong: null,
  select: null,
  selectMulti: null,
  selectSearch: null,
  bool: false,
  toggle: false,
  date: Date.now(),
  number: 0,
  uid: '',
  reference: null,
  file: null,
  fileMultiple: [],
  image: null,
  embedded: null,
  // TODO: Below should not be filter types
  button: null,
  dict: null,
  video: null,
};

export const filterTypesComparisons: Record<EFilterType, EComparisons[]> = {
  text: [EComparisons.REGEX, EComparisons.EQUALS, EComparisons.EMPTY],
  textLong: [EComparisons.REGEX, EComparisons.EQUALS, EComparisons.EMPTY],
  select: [EComparisons.EQUALS],
  selectMulti: [EComparisons.EQUALS],
  selectSearch: [EComparisons.EQUALS],
  bool: [EComparisons.EQUALS],
  toggle: [EComparisons.EQUALS],
  date: [EComparisons.AFTER, EComparisons.BEFORE],
  number: [EComparisons.EQUALS, EComparisons.GREATER_THAN, EComparisons.LESS_THAN],
  uid: [EComparisons.INVALID],
  reference: [EComparisons.INVALID],
  file: [EComparisons.CONTAINS],
  fileMultiple: [EComparisons.CONTAINS],
  image: [EComparisons.INVALID],
  embedded: [EComparisons.INVALID],
  button: [EComparisons.INVALID],
  dict: [EComparisons.INVALID],
  video: [EComparisons.INVALID],
};

export const filterTypesList = Object.keys(filterTypes);

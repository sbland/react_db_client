export const filterTypes = {
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
};

export const filterTypesDefaults = {
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

}

export const filterTypesList = Object.keys(filterTypes);

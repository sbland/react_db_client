import { filterTypes } from '@react_db_client/constants.client-types';

export const demoHeadingsData = [
  {
    uid: 'uid',
    label: 'UID',
    type: filterTypes.uid,
  },
  {
    uid: 'name',
    label: 'Text',
    type: filterTypes.text,
    required: true,
  },
  {
    uid: 'longText',
    label: 'Long Text',
    type: filterTypes.textLong,
  },
  {
    uid: 'date',
    label: 'Date',
    type: filterTypes.date,
  },
  {
    uid: 'number',
    label: 'Number',
    type: filterTypes.number,
  },
  {
    uid: 'number-capped',
    label: 'Number Capped',
    type: filterTypes.number,
    min: 3,
    max: 8,
    step: 0.1,
    defaultValue: 5,
  },
  {
    uid: 'demoField',
    label: 'Custom Field Types',
    type: 'demoFieldType',
  },
  {
    uid: 'reference',
    label: 'Reference',
    collection: 'democollection',
    type: filterTypes.reference,
    objectLink: true,
  },
  {
    uid: 'file',
    label: 'File',
    collectionId: 'democollection',
    documentId: 'docid',
    fileType: 'document',
    type: filterTypes.file,
  },
  {
    uid: 'image',
    label: 'Image',
    type: filterTypes.image,
  },
  {
    uid: 'bool',
    label: 'Bool',
    type: filterTypes.bool,
  },
  {
    uid: 'select',
    label: 'Select',
    type: filterTypes.select,
    options: [
      { uid: 'rep1', label: 'Rep 1' },
      { uid: 'rep2', label: 'Rep 2' },
    ],
  },
  {
    uid: 'selectreadonly',
    label: 'Select Read Only',
    type: filterTypes.select,
    readOnly: true,
    options: [
      { uid: 'rep1', label: 'Rep 1' },
      { uid: 'rep2', label: 'Rep 2' },
    ],
  },
  {
    uid: 'selectSearch',
    label: 'Select Search',
    type: filterTypes.selectSearch,
    searchFieldTargetField: 'label',
    searchFn: async () => [
      { uid: 'rep1', label: 'Rep 1' },
      { uid: 'rep2', label: 'Rep 2' },
    ],
  },
  {
    uid: 'selectSearchMulti',
    label: 'Select Search Multi',
    type: filterTypes.selectSearch,
    multiple: true,
    searchFieldTargetField: 'label',
    allowEmptySearch: true,
    searchFn: async () => [
      { uid: 'rep1', label: 'Rep 1' },
      { uid: 'rep2', label: 'Rep 2' },
    ],
  },
  {
    uid: 'multiSelect',
    label: 'Multi Select',
    type: filterTypes.selectMulti,
    options: [
      { uid: 'foo', label: 'Rep 1' },
      { uid: 'bar', label: 'Rep 2' },
      { uid: 'dee', label: 'Rep 3' },
    ],
  },
  {
    uid: 'multiSelectlist',
    label: 'Multi Select No Dropdown',
    type: filterTypes.selectMulti,
    asDropdown: false,
    options: [
      { uid: 'foo', label: 'Rep 1' },
      { uid: 'bar', label: 'Rep 2' },
      { uid: 'dee', label: 'Rep 3' },
    ],
  },
  {
    uid: 'multiSelectlistShowAll',
    label: 'Multi Select Show All',
    type: filterTypes.selectMulti,
    selectType: 'showall',
    options: [
      { uid: 'foo', label: 'Rep 1' },
      { uid: 'bar', label: 'Rep 2' },
      { uid: 'dee', label: 'Rep 3' },
    ],
  },
  {
    uid: 'embedded',
    label: 'Embedded',
    type: filterTypes.embedded,
    children: [{ uid: 'embeddedtext', label: 'Embedded Text', type: filterTypes.text }],
  },
  {
    uid: 'embeddedb',
    label: 'Embedded B',
    type: filterTypes.embedded,
    orientation: 'horiz',
    children: [
      { uid: 'embeddedtog1', label: 'Embedded Tog1', type: filterTypes.bool },
      { uid: 'embeddedtog2', label: 'Embedded Tog2', type: filterTypes.bool },
      { uid: 'embeddedtog3', label: 'Embedded Tog3', type: filterTypes.bool },
    ],
  },
  {
    uid: 'dict',
    label: 'Dictionary Field',
    type: filterTypes.dict,
  },
  {
    uid: 'video',
    label: 'Video     Field',
    type: filterTypes.video,
  }
];

export const demoFormData = {
  name: 'Name 1',
  uid: 'name-1',
  date: '2019-11-02T12:04:44.626+00:00',
  selectreadonly: 'rep1',
  multiSelect: ['foo', 'bar'],
  longText: `Long Text spanning multiple lines
  1
  2
  3
  4
  5
  6
  7
  8
  9
  `,
};

export const demoAdditionalData = {
  customFieldStyle: { background: 'grey', padding: '2px' },
};

import { IDocument } from '@react_db_client/constants.client-types';

export interface IResultExample extends IDocument {
  name: string;
}

export const demoHeadingsData = [
  {
    type: 'text',
    uid: 'uid',
    label: 'UID',
  },
  {
    type: 'text',
    uid: 'type',
    label: 'Type',
  },
  {
    type: 'text',
    uid: 'name',
    label: 'Name',
  },
];

export const demoPreviewHeadingsData = [
  {
    type: 'text',
    uid: 'uid',
    label: 'UID',
  },
  {
    type: 'text',
    uid: 'type',
    label: 'Type',
  },
  {
    type: 'text',
    uid: 'name',
    label: 'Name',
  },
  {
    type: 'textLong',
    uid: 'description',
    label: 'Description',
  },
];

export const demoResultData: IResultExample[] = [
  {
    uid: '1',
    label: 'Result 1',
    name: 'This thing 1',
  },
  {
    uid: '2',
    label: 'Result 2',
    name: 'This thing 2',
  },
  {
    uid: '3',
    label: 'Result 3',
    name: 'This thing 3',
  },
];

export const extraResult = {
  uid: 999999,
  label: 'Extra Result 1',
  name: 'Extra This thing 1',
};

export const demoResultsDataMany = [
  ...Array.from(Array(30).keys()).map((i) => ({
    ...demoResultData[i % demoResultData.length],
    uid: i,
  })),
  extraResult,
];

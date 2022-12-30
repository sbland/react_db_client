import { EFilterType } from '@react_db_client/constants.client-types';

export interface IHeading {
  uid: string;
  label: string;
  type: EFilterType;
  root?: string;
  readOnly?: boolean;
}

export const searchResultHeadings = (fileServerUrl: string): IHeading[] => [
  {
    uid: 'label',
    label: 'label',
    type: EFilterType.image,
    root: fileServerUrl,
    readOnly: true,
  },
  {
    uid: 'fileType',
    label: 'File Type',
    type: EFilterType.text,
  },
];

export const searchResultImageHeadings = (fileServerUrl: string): IHeading[] => [
  {
    uid: 'name',
    label: 'thumbnail',
    type: EFilterType.image,
    root: fileServerUrl,
    readOnly: true,
  },
  {
    uid: 'fileType',
    label: 'File Type',
    type: EFilterType.text,
  },
];

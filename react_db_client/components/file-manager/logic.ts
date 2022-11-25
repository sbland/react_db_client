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
    label: 'Thumbnail',
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

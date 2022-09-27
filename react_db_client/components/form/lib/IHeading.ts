import { EFilterType } from '@react_db_client/constants.client-types';

export interface IHeading<T = unknown> {
  label: string;
  required?: boolean;
  type: EFilterType;
  uid: string;
  hasChanged?: boolean;
  readOnly?: boolean;
  defaultValue?: T;
}

export interface IHeadingNumber<T = unknown> extends IHeading<T> {
  type: EFilterType.number;
  min?: number;
  max?: number;
  step?: number;
}

export interface IHeadingReference<T = unknown> extends IHeading<T> {
  type: EFilterType.reference;
  collection: string;
  objectLink: true;
}

export interface IHeadingSelect<T = unknown> extends IHeading<T> {
  type: EFilterType.select | EFilterType.selectMulti;
  options: {
    uid: string;
    label: string;
  }[];
  asDropdown?: boolean;
  selectType?: 'showall';
}

export interface IHeadingEmbedded<T = unknown> extends IHeading<T> {
  type: EFilterType.select | EFilterType.selectMulti;
  orientation?: 'vert' | 'horiz';
  children: THeading[];
}

export interface IHeadingSelectSearch<T = unknown> extends IHeading<T> {
  type: EFilterType.selectSearch;
  searchFieldTargetField: string;
  multiple?: boolean;
  allowEmptySearch: boolean;
  searchFn: () => Promise<
    {
      uid: string;
      label: string;
    }[]
  >;
}

export interface IHeadingFile<T = unknown> extends IHeading<T> {
  type: EFilterType.file;
  collectionId: string;
  documentId: string;
  fileType: 'document' | 'image';
  objectLink: true;
}

export interface IHeadingCustomType<T = unknown> extends Omit<IHeading<T>, 'type'> {
  type: string;
  customType?: true;
}

export type THeading<T = unknown> =
  | IHeading<T>
  | IHeadingNumber<T>
  | IHeadingCustomType<T>
  | IHeadingFile<T>
  | IHeadingSelect<T>
  | IHeadingSelectSearch<T>
  | IHeadingEmbedded<T>
  | IHeadingReference<T>;

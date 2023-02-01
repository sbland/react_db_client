import { FilterObjectClass } from './filter-object-class';
import { IDocument } from './IDocument';
import { Uid } from './uid';

export interface IDeleteResponse {
  ok?: boolean;
}

export interface ISaveResponse {
  ok?: boolean;
}

export type TAsyncGetDocument<ResultType extends IDocument> = (
  collection: string,
  uid: Uid,
  schemaRequest?: string,
  populate?: 'all' | string[]
) => Promise<ResultType>;
export type TAsyncGetDocuments<ResultType extends IDocument> = (
  collection: string,
  filters: FilterObjectClass[],
  schema?: string | string[],
  sortBy?: string,
  searchString?: string,
  reverseSort?: boolean,
  populate?: string[] | 'all'
) => Promise<ResultType[]>;
export type TAsyncPutDocument<ResultType extends IDocument> = (
  collection: string,
  selectedUid: Uid,
  data: Partial<ResultType>
) => Promise<ISaveResponse>;
export type TAsyncPostDocument<ResultType extends IDocument> = (
  collection: string,
  selectedUid: Uid,
  data: Partial<ResultType>
) => Promise<ISaveResponse>;
export type TAsyncDeleteDocument = (
  collection: string,
  selectedUid: Uid
) => Promise<IDeleteResponse>;
export type TAsyncCopyDocument<T> = (
  fromCollection: string,
  fromUid: string,
  toCollection: string,
  toUid: string,
  additionalData?: T
) => Promise<ISaveResponse>;

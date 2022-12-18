import { FilterObjectClass } from "./filter-object-class";
import { IDocument } from "./IDocument";
import { Uid } from "./uid";

export type TAsyncGetDocument<ResultType extends IDocument> = (
  collection: string,
  selectedUid: Uid
) => Promise<ResultType>;
export type TAsyncGetDocuments<V> = (
  collection: string,
  filters: FilterObjectClass[],
  schema: string | string[],
  sortBy: string,
  searchString?: string,
  reverseSort?: boolean,
  populate?: string[] | 'all'
) => Promise<V[]>;
export type TAsyncPutDocument<ResultType extends IDocument> = (
  collection: string,
  selectedUid: Uid,
  data: Partial<ResultType>
) => Promise<void>;
export type TAsyncPostDocument<ResultType extends IDocument> = (
  collection: string,
  selectedUid: Uid,
  data: Partial<ResultType>
) => Promise<void>;
export type TAsyncDeleteDocument = (collection: string, selectedUid: Uid) => Promise<void>;
export type TAsyncCopyDocument = (collection: string, selectedUid: Uid) => Promise<void>;

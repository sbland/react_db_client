import {
  EFileType,
  EFilterType,
  FilterObjectClass,
  FilterObjectSimpleClass,
  IFile,
} from '@react_db_client/constants.client-types';

export interface IHeading {
  uid: string;
  label: string;
  type: EFilterType;
  root?: string;
  readOnly?: boolean;
}

export const searchResultHeadings = (
  fileServerUrl: string,
  collectionId: string,
  documentId: string
): IHeading[] => [
  {
    uid: 'name',
    label: 'Thumbnail',
    type: EFilterType.image,
    root: `${fileServerUrl}/${collectionId}/${documentId}`,
    readOnly: true,
  },
  {
    uid: 'fileType',
    label: 'File Type',
    type: EFilterType.text,
  },
];

export const searchResultFields = ['uid', 'name', 'updatedAt', 'createdAt', 'fileType', 'filePath'];

export type TAsyncGetDocuments = (
  collection: 'files',
  filters: FilterObjectClass[],
  _searchResultFields: typeof searchResultFields,
  sortBy?: string,
  searchString?: string
) => Promise<IFile[]>;

export const searchFilesFunction =
  (asyncGetDocuments: TAsyncGetDocuments) =>
  (collectionId: string, documentId: string, fileType: EFileType) =>
  async (filters: FilterObjectClass[], sortBy?: string, searchString?: string) => {
    const allFilters = [
      ...filters,
      new FilterObjectSimpleClass('collectionId', collectionId),
      new FilterObjectSimpleClass('documentId', documentId),
      new FilterObjectSimpleClass('fileType', fileType),
    ];
    return asyncGetDocuments('files', allFilters, searchResultFields, sortBy, searchString);
  };

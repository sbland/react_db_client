import { FilterObjectSimpleClass, filterTypes } from '@samnbuk/react_db_client.constants.client-types';

export const searchResultHeadings = (fileServerUrl, collectionId, documentId) => [
  // {
  //   uid: 'uid', label: 'UID', type: filterTypes.uid, readOnly: true,
  // },
  {
    uid: 'name',
    label: 'Thumbnail',
    type: filterTypes.image,
    root: `${fileServerUrl}/${collectionId}/${documentId}`,
    readOnly: true,
  },
  {
    uid: 'fileType',
    label: 'File Type',
    type: filterTypes.text,
  },
];

export const searchResultFields = ['uid', 'name', 'updatedAt', 'createdAt', 'fileType', 'filePath'];

export const searchFilesFunction = (asyncGetDocuments) => (collectionId, documentId, fileType) => async (
  filters,
  sortBy,
  searchString
) => {
  const allFilters = [
    ...filters,
    new FilterObjectSimpleClass('collectionId', collectionId),
    new FilterObjectSimpleClass('documentId', documentId),
    new FilterObjectSimpleClass('fileType', fileType),
  ];
  return asyncGetDocuments('files', allFilters, searchResultFields, sortBy, searchString);
};

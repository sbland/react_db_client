import React from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { FileManager, IFileManagerProps } from './file-manager';
import { demoSearchResults } from './demo-data';
import { EFileType } from '@react_db_client/constants.client-types';

const defaultProps: IFileManagerProps = {
  handleSelect: (args: any) => alert('Selected'),
  collectionId: 'projects',
  documentId: 'Example Project',
  fileType: EFileType.IMAGE,
  allowMultiple: false,
  asyncGetDocuments: async () => demoSearchResults,
  fileServerUrl: 'fileserverurl',
  asyncUpload: async (
    data: File,
    collectionId: string,
    documentId: string,
    fileType: EFileType,
    callback: () => void
  ) => {},
};

export const BasicFileManager = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FileManager {...defaultProps} />
  </CompositionWrapDefault>
);

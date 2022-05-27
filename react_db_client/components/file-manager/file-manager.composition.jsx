import React from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { FileManager } from './file-manager';
import { demoSearchResults } from './demo-data';



const defaultProps = {
  handleSelect: () => alert('Selected'),
  collectionId: 'projects',
  documentId: 'Example Project',
  fileType: 'image',
  allowMultiple: false,
  asyncGetDocuments: async() => demoSearchResults,
  fileServerUrl: 'fileserverurl',
};

export const BasicFileManager = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FileManager {...defaultProps} />
  </CompositionWrapDefault>
);

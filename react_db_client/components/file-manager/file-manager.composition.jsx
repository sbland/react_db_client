import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps/dist';
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

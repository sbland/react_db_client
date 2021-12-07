import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps/dist';
import { FieldFile } from './field-file';
import { DEMO_FILES_DATA } from './demo-data';

const updateFormData = () => {};

const defaultProps = {
  uid: 'uid',
  multiple: false,
  updateFormData,
  collectionId: 'collectionId',
  documentId: 'documentId',
  fileType: 'image',
  value: DEMO_FILES_DATA,
  fileServerUrl: 'fileserver',
  asyncGetDocuments: async() => DEMO_FILES_DATA,
};

export const BasicFieldFile = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FieldFile {...defaultProps} required />
  </CompositionWrapDefault>
);

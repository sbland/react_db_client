import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps/dist';
import { FileUploader } from './file-uploader';
// import { defaultVal } from './demo-data';

const asyncUpload = async () => {}
const onUpload = () => {};

const defaultProps = {
  collectionId: 'demoCollectionId',
  documentId: 'demoDocumentId',
  fileType: 'image',
  asyncUpload,
  onUpload,
};


export const BasicFileUploader  = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FileUploader
      {...defaultProps}
      required
    />
  </CompositionWrapDefault>
);
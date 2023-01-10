import React from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { FileUploader } from './file-uploader';
import { EFileType } from '@react_db_client/constants.client-types';
import { FileUploaderSimple } from './file-uploader-simple';
import { asyncFileUpload, onUpload } from './dummy-data';

const defaultProps = {
  fileType: EFileType.IMAGE,
  asyncFileUpload,
  onUpload,
};

export const BasicFileUploader = () => (
  <CompositionWrapDefault height="40rem" width="50rem">
    <FileUploader {...defaultProps} />
  </CompositionWrapDefault>
);

export const BasicFileUploaderSimple = () => (
  <CompositionWrapDefault height="40rem" width="50rem">
    <FileUploaderSimple {...defaultProps} />
  </CompositionWrapDefault>
);

export const BasicFileUploaderHideOnUpload = () => {
  const [showFileUploader, setShowFileUploader] = React.useState(true);
  if (!showFileUploader) return <></>;
  return (
    <CompositionWrapDefault height="40rem" width="50rem">
      <FileUploaderSimple {...defaultProps} onUpload={() => setShowFileUploader(false)} />
    </CompositionWrapDefault>
  );
};

import React from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { FileUploader } from './file-uploader';
import { EFileType } from '@react_db_client/constants.client-types';

const asyncFileUpload = async () => {};
const onUpload = () => {};

const defaultProps = {
  fileType: EFileType.IMAGE,
  asyncFileUpload,
  onUpload,
};

export const BasicFileUploader = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FileUploader {...defaultProps} />
  </CompositionWrapDefault>
);

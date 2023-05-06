import React from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { EFileType, IFile } from '@react_db_client/constants.client-types';
import { FileUploader } from './file-uploader';
import { FileUploaderSimple } from './file-uploader-simple';
import { asyncFileUpload, onUpload } from './dummy-data';
import ReactJson from 'react-json-view';

const defaultProps = {
  fileType: EFileType.IMAGE,
  asyncFileUpload,
  onUpload,
};

export const BasicFileUploader = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState({});
  return (
    <>
      <CompositionWrapDefault height="20rem" width="50rem">
        <FileUploader
          {...defaultProps}
          asyncFileUpload={async (
            data: File,
            fileType: EFileType,
            callback: () => void,
            metaData: Partial<IFile>
          ) => {
            await defaultProps.asyncFileUpload(data, fileType, callback, metaData);
            setUploadedFiles(metaData);
            /* Call default props asyncFileUpload for tests*/
          }}
        />
      </CompositionWrapDefault>
      <ReactJson src={uploadedFiles} />
    </>
  );
};

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
      <FileUploaderSimple
        {...defaultProps}
        onUpload={() => setShowFileUploader(false)}
      />
    </CompositionWrapDefault>
  );
};

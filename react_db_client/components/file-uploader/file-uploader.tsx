import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import {
  IHeading,
  StyledSelectList,
} from '@react_db_client/components.styled-select-list';
import {
  EFileType,
  EFilterType,
  IFile,
} from '@react_db_client/constants.client-types';

import { useFileUploader } from './file-uploader-hook';
import { FileUploaderButtonsWrap, FileUploaderSelectButton } from './styles';

const fileTypesToInputAccept = (fileType: EFileType) => {
  switch (fileType) {
    case EFileType.IMAGE:
      return 'image/*';
    case EFileType.DOCUMENT:
      return '.pdf,.doc,.docx,.txt,.odt';
    case EFileType.DATA:
      return '.xml,.csv,.xlsx,.json,.yaml';
    default:
      return fileType || '*';
  }
};

const fileListHeadings: IHeading[] = [
  { uid: 'name', label: 'Name', type: EFilterType.text },
];

export interface IFileUploaderProps {
  fileType: EFileType;
  onUpload: (responses: unknown) => void;
  asyncFileUpload: (
    data: File,
    fileType: EFileType,
    callback: () => void,
    metaData: Partial<IFile>
  ) => Promise<void>;
}

export const FileUploader = ({
  fileType: fileTypeIn,
  onUpload,
  asyncFileUpload,
}: IFileUploaderProps) => {
  const [fileType, setFileType] = useState(fileTypeIn || EFileType.IMAGE);

  const {
    selectedFiles,
    handleFilesSelectedForUpload,
    uploadFiles,
    uploading,
    uploadProgress,
    uploadComplete,
    totalFilesToUpload,
    error,
    fileSelectionComplete,
  } = useFileUploader({
    fileType,
    asyncFileUpload,
    onUpload,
  });

  const message = useMemo(() => {
    if (error) return error;
    if (uploading)
      return `Uploading ${uploadProgress} of ${totalFilesToUpload}`;
    if (uploadComplete) return 'Upload complete';
    return '';
  }, [error, uploading, uploadComplete, uploadProgress, totalFilesToUpload]);

  return (
    <div className="fileUploader">
      {message}
      <FileUploaderButtonsWrap className="fileUploader_btnsWrap">
        <label
          className={`button ${
            totalFilesToUpload || uploading ? 'button-one' : 'button-two'
          } fileUploader_selectBtn`}
        >
          Select Files
          <input
            // Hide html input so we can override style
            style={{ display: 'none' }}
            name="file"
            id="file"
            className="fileUploader_fileInput"
            type="file"
            accept={fileTypesToInputAccept(fileType)}
            onChange={(e) => handleFilesSelectedForUpload(e.target.files)}
            multiple
          />
        </label>

        <FileUploaderSelectButton
          type="button"
          disabled={
            !fileSelectionComplete ||
            !selectedFiles ||
            selectedFiles.length === 0 ||
            uploading
          }
          className="button-two uploadBtn"
          onClick={() => uploadFiles(selectedFiles)}
        >
          Upload
        </FileUploaderSelectButton>
      </FileUploaderButtonsWrap>
      {/* If file type not defined provide option to user */}
      {!fileTypeIn && (
        <select
          onChange={(e) => setFileType(e.target.value as EFileType)}
          value={fileType}
        >
          <option value={EFileType.IMAGE}>Image</option>
          <option value={EFileType.DOCUMENT}>Document</option>
        </select>
      )}
      <p>Files ready to upload:</p>
      {fileType === EFileType.IMAGE && (
        <div className="fileUploader_imagePreview">
          {selectedFiles &&
            selectedFiles.map((file) => (
              <img
                key={file.name}
                width="100px"
                src={URL.createObjectURL(file.data as File)}
                alt={file.name}
              />
            ))}
        </div>
      )}
      <StyledSelectList
        listInput={selectedFiles || []}
        headings={fileListHeadings}
        // TODO: Handle remove from selection
        handleSelect={(uid) => {}}
        currentSelection={undefined}
        // limitHeight
        selectionField="uid"
        // autoWidth
      />
    </div>
  );
};

FileUploader.propTypes = {
  fileType: PropTypes.oneOf(['image', 'document', 'data', '*']),
  onUpload: PropTypes.func.isRequired,
  asyncFileUpload: PropTypes.func.isRequired,
};

FileUploader.defaultProps = {
  fileType: '*',
};

import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import { IHeading, StyledSelectList } from '@react_db_client/components.styled-select-list';
import { EFileType, filterTypes, IFile } from '@react_db_client/constants.client-types';
// import ItemList from '../ItemList/ItemList';

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

const fileListHeadings: IHeading[] = [{ uid: 'name', label: 'Name', type: filterTypes.text }];

export interface IFileUploaderProps {
  collectionId: string;
  documentId: string;
  fileType: EFileType;
  onUpload: (responses: unknown) => void;
  asyncUpload: (
    data: File,
    collectionId: string,
    documentId: string,
    fileType: EFileType,
    callback: () => void
  ) => Promise<void>;
}

export const FileUploader = ({
  collectionId,
  documentId,
  fileType: fileTypeIn,
  onUpload,
  asyncUpload,
}: IFileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const [fileType, setFileType] = useState(fileTypeIn || EFileType.IMAGE);

  const { uploadFiles, uploading, uploadProgress, uploadComplete, error } = useFileUploader({
    collectionId,
    documentId,
    fileType,
    asyncUpload,
    onUpload,
  });

  const message = useMemo(() => {
    if (error) return error;
    if (uploading) return `Uploading ${uploadProgress} of ${selectedFiles.length}`;
    if (uploadComplete) return 'Upload complete';
    return '';
  }, [error, uploading, uploadComplete, uploadProgress, selectedFiles]);

  const handleFilesSelected = (e) => {
    const newSelectedFiles: IFile[] = [...e.target.files].map((f: File) => ({
      uid: f.name,
      name: f.name,
      label: f.name,
      data: f,
      filePath: '',
      fileType,
    }));
    setSelectedFiles(newSelectedFiles);
  };

  return (
    <div className="fileUploader">
      {message}
      <FileUploaderButtonsWrap className="fileUploader_btnsWrap">
        <label
          className={`button ${
            (selectedFiles && selectedFiles.length > 0) || uploading ? 'button-one' : 'button-two'
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
            // multiple={multiple}
            onChange={handleFilesSelected}
            // onInput={console.log}
            // value={selectedFilesRaw}
            // disabled={uploading}
            multiple
          />
        </label>

        <FileUploaderSelectButton
          type="button"
          disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
          className="button-two uploadBtn"
          // className={(selected) ? 'button-two' : 'button-one'}
          onClick={() => uploadFiles(selectedFiles)}
        >
          Upload
        </FileUploaderSelectButton>
      </FileUploaderButtonsWrap>
      {/* If file type not defined provide option to user */}
      {!fileTypeIn && (
        <select onChange={(e) => setFileType(e.target.value as EFileType)} value={fileType}>
          <option value={EFileType.IMAGE}>Image</option>
          <option value={EFileType.DOCUMENT}>Document</option>
        </select>
      )}
      <StyledSelectList
        listInput={selectedFiles || []}
        headings={fileListHeadings}
        handleSelect={(uid) => {}}
        currentSelection={undefined}
        // limitHeight
        selectionField="uid"
        autoWidth
      />
      {/* <ItemList
        items={
          !selectedFiles
            ? []
            : selectedFiles.map((s) => ({
                uid: s.name,
                name: s.name,
                type: 'button',
              }))
        }
      /> */}
    </div>
  );
};

FileUploader.propTypes = {
  collectionId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  fileType: PropTypes.oneOf(['image', 'document', 'data', '*']),
  onUpload: PropTypes.func.isRequired,
  asyncUpload: PropTypes.func.isRequired,
};

FileUploader.defaultProps = {
  fileType: '*',
};

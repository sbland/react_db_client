import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import { StyledSelectList } from '@samnbuk/react_db_client.components.styled-select-list';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';
// import ItemList from '../ItemList/ItemList';

import { useFileUploader } from './file-uploader-hook';
import './style.scss';

const fileTypesToInputAccept = (fileType) => {
  switch (fileType) {
    case 'image':
      return 'image/*';
    case 'document':
      return '.pdf,.doc,.docx,.txt,.odt';
    case 'data':
      return '.xml,.csv,.xlsx,.json,.yaml';
    default:
      return fileType || '*';
  }
};

const fileListHeadings = [{ uid: 'name', label: 'Name', type: filterTypes.text }];

export const FileUploader = ({
  collectionId,
  documentId,
  fileType: fileTypeIn,
  onUpload,
  asyncUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileType, setFileType] = useState(fileTypeIn || 'image');

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
    const newSelectedFiles = [...e.target.files].map((f) => ({ uid: f.uid, name: f.name, data: f }));
    setSelectedFiles(newSelectedFiles);
  };

  return (
    <div className="fileUploader">
      {message}
      <div className="fileUploader_btnsWrap">
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

        <button
          type="button"
          disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
          className="button-two uploadBtn"
          // className={(selected) ? 'button-two' : 'button-one'}
          onClick={() => uploadFiles(selectedFiles)}
        >
          Upload
        </button>
      </div>
      {/* If file type not defined provide option to user */}
      {!fileTypeIn && (
        <select onChange={(e) => setFileType(e.target.value)} value={fileType}>
          <option value="image">Image</option>
          <option value="document">Document</option>
        </select>
      )}
      <StyledSelectList
        listInput={selectedFiles || []}
        headings={fileListHeadings}
        handleSelect={(uid) => {}}
        currentSelection={null}
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

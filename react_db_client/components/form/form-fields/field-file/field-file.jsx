import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FileManager } from '@samnbuk/react_db_client.components.file-manager';
// import ItemList from '../../ItemList/ItemList';

// TODO: Replace ItemList with styled select list

/**
 * Form component file field
 *
 * Value should be either a single or array of file objects
 *
 * @param {*} {
 *   uid,
 *   multiple,
 *   updateFormData,
 *   collectionId,
 *   documentId,
 *   fileType,
 *   value,
 * }
 * @return {*}
 */
const FieldFile = ({
  uid,
  multiple,
  updateFormData,
  collectionId,
  documentId,
  fileType,
  value,
  FILE_SERVER_URL,
  // TODO: Add required check
  // required,
}) => {
  if (value && (typeof value !== 'object' || (value[0] && typeof value[0] !== 'object')))
    throw Error('Value must be file type');

  const [fileList, setFileList] = useState(() => (Array.isArray(value) ? value : [value]));
  const [showFileSelectionPanel, setShowFileSelectionPanel] = useState(false);

  useEffect(() => {
    setFileList(Array.isArray(value) ? value : [value]);
  }, [value]);

  const handleSelected = (file, fileData) => {
    const newFileList = multiple ? [...fileList, ...fileData] : [fileData];
    setFileList(newFileList);
    setShowFileSelectionPanel(false);
    const newData = multiple ? [...fileList, ...fileData] : fileData;
    updateFormData(uid, newData);
  };

  const handleFileDelete = (fuid) => {
    const newFileList = fileList.filter((f) => f.uid !== fuid);
    setFileList(newFileList);
    const newData = multiple ? newFileList : null;
    updateFormData(uid, newData);
  };

  const filesData = useMemo(
    () =>
      fileList &&
      fileList
        .filter((f) => f)
        .map((file) => ({
          uid: file.uid || file.name,
          label: file.name,
          type: fileType === 'image' ? 'image' : 'button',
          src: `${FILE_SERVER_URL}/${file.filePath}`,
        })),
    [fileList, fileType]
  );

  return (
    <>
      <FileManager
        handleSelect={handleSelected}
        collectionId={collectionId}
        documentId={documentId}
        fileType={fileType}
        // popup
        isOpen={showFileSelectionPanel}
        handleClose={() => setShowFileSelectionPanel(false)}
        title="File Selector"
        allowMultiple={multiple}
      />
      <div className="FieldFile">
        <div>
          <button
            type="button"
            className="button-one addFileBtn"
            onClick={() => setShowFileSelectionPanel(true)}
          >
            Add File
          </button>
        </div>
        <div style={{ display: 'flex' }}>
          Files:
          <ItemList
            viewType={fileType === 'image' ? 'grid' : 'list'}
            items={filesData}
            overlayButtons={[
              {
                uid: 'remove',
                func: (fuid) => handleFileDelete(fuid),
                label: 'Remove',
                icon: '🗑️',
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

const fileValueShape = {
  filePath: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

FieldFile.propTypes = {
  uid: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.shape(fileValueShape),
    PropTypes.arrayOf(PropTypes.shape(fileValueShape)),
  ]),
  updateFormData: PropTypes.func.isRequired,
  collectionId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  fileType: PropTypes.oneOf(['image', 'document', 'data', '*']),
  multiple: PropTypes.bool,
};

FieldFile.defaultProps = {
  value: [],
  multiple: false,
  fileType: '*',
};

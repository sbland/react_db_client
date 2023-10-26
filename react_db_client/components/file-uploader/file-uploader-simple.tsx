import PropTypes from 'prop-types';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { EFileType, IFile } from '@react_db_client/constants.client-types';
import { useFileUploader } from './file-uploader-hook';
import { FileUploadBtn, FileUploaderButtonsWrap } from './styles';
// import UploadIcon from './assets/UploadIcon.svg'; // TODO: implement upload icon

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

export interface IFileUploaderSimpleProps {
  fileType: EFileType;
  onUpload: (responses: unknown) => void;
  asyncFileUpload: (
    data: File,
    fileType: EFileType,
    callback: () => void
  ) => Promise<void>;
  showMessage?: boolean;
  label?: React.ReactNode;
}

export const FileUploaderSimple = ({
  fileType: fileTypeIn,
  onUpload,
  asyncFileUpload,
  label = <>Upload</>,
  showMessage = true,
}: IFileUploaderSimpleProps) => {
  // const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const [fileType, setFileType] = useState(fileTypeIn || EFileType.IMAGE);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    // uploadFiles,
    uploading,
    uploadProgress,
    uploadComplete,
    selectedFiles,
    error,
    handleFilesSelectedForUpload,
  } = useFileUploader({
    fileType,
    asyncFileUpload,
    onUpload,
  });

  const message = useMemo(() => {
    if (!showMessage) return null;
    if (error) return error;
    if (uploading)
      return `Uploading ${uploadProgress} of ${selectedFiles.length}`;
    if (uploadComplete) return 'Upload complete';
    return '';
  }, [
    error,
    uploading,
    uploadComplete,
    uploadProgress,
    selectedFiles,
    showMessage,
  ]);

  const handleFilesSelected = (e) => {
    handleFilesSelectedForUpload(e.target.files, { instantUpload: true });
    // const newSelectedFiles: IFile[] = [...e.target.files].map((f: File) => ({
    //   uid: f.name,
    //   name: f.name,
    //   label: f.name,
    //   data: f,
    //   filePath: '',
    //   fileType,
    // }));
    // setSelectedFiles(newSelectedFiles);
  };

  // useEffect(() => {
  //   // Auto upload selected files
  //   if (selectedFiles && selectedFiles[0]) {
  //     console.info('Uploading selected files');
  //     uploadFiles(selectedFiles);
  //   }
  // }, [selectedFiles]);

  return (
    <div className="fileUploader">
      <FileUploaderButtonsWrap>
        <FileUploadBtn onClick={(e) => inputRef.current?.click()}>
          <label
            className={`button ${
              (selectedFiles && selectedFiles.length > 0) || uploading
                ? 'button-one'
                : 'button-two'
            } fileUploader_selectBtn`}
          >
            {label}
            <input
              // Hide html input so we can override style
              ref={inputRef}
              style={{ display: 'none' }}
              name="file"
              id="file"
              className="fileUploader_fileInput"
              type="file"
              accept={fileTypesToInputAccept(fileType)}
              onChange={handleFilesSelected}
              multiple
            />
          </label>
        </FileUploadBtn>
        {message}
      </FileUploaderButtonsWrap>
    </div>
  );
};

FileUploaderSimple.propTypes = {
  fileType: PropTypes.oneOf(['image', 'document', 'data', '*']),
  onUpload: PropTypes.func.isRequired,
  asyncFileUpload: PropTypes.func.isRequired,
};

FileUploaderSimple.defaultProps = {
  fileType: '*',
};

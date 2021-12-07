/* A react hook async request */

import { useState, useEffect } from 'react';

const ENV = process.env.NODE_ENV;

export const useFileUploader = ({ collectionId, documentId, fileType, onUpload, asyncUpload }) => {
  const [filesToUpload, setFilesToUpload] = useState(null);
  // const [selected, setSelected] = useState(null);
  // const [uploadSelected, setUploadSelected] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  // const [message, setMessage] = useState('');

  // handle upload selected
  useEffect(() => {
    if (filesToUpload && !uploading) {
      setUploading(true);
      setUploadProgress(filesToUpload.length);

      const promises = filesToUpload.map(async (file) => {
        await asyncUpload(file.data, collectionId, documentId, fileType, () => {});
        setFilesToUpload((prev) => prev.filter((f) => f.name !== file.name));
        setUploadProgress((prev) => prev - 1);
      });
      Promise.all(promises)
        .then((responses) => {
          setUploadComplete(true);
          onUpload(responses);
        })
        .catch((e) => {
          if (ENV === 'development') console.log(e);
          setError('Upload Failed');
        })
        .finally(() => {
          setUploading(false);
          setFilesToUpload(null);
        });
    }
    return () => {
      // TODO: handle cancel upload
    };
  }, [filesToUpload, uploading, collectionId, documentId, fileType, onUpload, uploadProgress]);

  const uploadFiles = (fileList) => {
    setFilesToUpload(fileList);
  };

  return {
    uploadFiles,
    uploading,
    uploadProgress,
    uploadComplete,
    error,
  };
};


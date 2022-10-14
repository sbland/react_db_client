/* A react hook async request */

import { EFileType, IFile } from '@react_db_client/constants.client-types';
import { useState, useEffect } from 'react';

const ENV = process.env.NODE_ENV;

export interface IUseFileUploaderArgs {
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

export interface IUseFileUploaderReturn {
  uploadFiles: (filelist: IFile[]) => void;
  uploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  error: string;
}

export const useFileUploader = ({
  collectionId,
  documentId,
  fileType,
  onUpload,
  asyncUpload,
}: IUseFileUploaderArgs): IUseFileUploaderReturn => {
  const [filesToUpload, setFilesToUpload] = useState<null | IFile[]>(null);
  // const [selected, setSelected] = useState(null);
  // const [uploadSelected, setUploadSelected] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  // const [message, setMessage] = useState('');

  // handle upload selected
  useEffect(() => {
    if (filesToUpload && !uploading) {
      setUploading(true);
      setUploadProgress(filesToUpload.length);

      const promises = filesToUpload.map(async (file) => {
        if (!file.data) throw Error('Missing file data');
        await asyncUpload(file.data, collectionId, documentId, fileType, () => {});
        setFilesToUpload((prev) => prev?.filter((f) => f.name !== file.name) || null);
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

  const uploadFiles = (fileList: IFile[]) => {
    setFilesToUpload(fileList);
  };

  return {
    uploadFiles,
    uploading,
    uploadProgress,
    uploadComplete,
    error,
  } as IUseFileUploaderReturn;
};

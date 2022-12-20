/* A react hook async request */

import { EFileType, IFile } from '@react_db_client/constants.client-types';
import { useState, useEffect } from 'react';

const ENV = process.env.NODE_ENV;

export interface IUseFileUploaderArgs {
  fileType: EFileType;
  onUpload: (responses: unknown) => void;
  asyncFileUpload: (data: File, fileType: EFileType, callback: () => void) => Promise<void>;
}

export interface IUseFileUploaderReturn {
  uploadFiles: (filelist: IFile[]) => void;
  uploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  error: string;
}

export const useFileUploader = ({
  fileType,
  onUpload,
  asyncFileUpload,
}: IUseFileUploaderArgs): IUseFileUploaderReturn => {
  const [filesToUpload, setFilesToUpload] = useState<null | IFile[]>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  // handle upload selected
  useEffect(() => {
    if (filesToUpload && !uploading) {
      setUploading(true);
      setUploadProgress(filesToUpload.length);
      const promises = filesToUpload.map(async (file) => {
        if (!file.data) throw Error('Missing file data');
        await asyncFileUpload(file.data, fileType, () => {});
        setFilesToUpload((prev) => prev?.filter((f) => f.name !== file.name) || null);
        setUploadProgress((prev) => prev - 1);
        return `Uploaded ${file.name}`
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
  }, [filesToUpload, uploading, fileType, onUpload, uploadProgress]);

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

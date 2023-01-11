/* A react hook async request */

import { EFileType, IFile } from '@react_db_client/constants.client-types';
import { useState, useEffect } from 'react';

const ENV = process.env.NODE_ENV;

export interface IUseFileUploaderArgs {
  fileType: EFileType;
  onUpload: (responses: unknown) => void;
  asyncFileUpload: (
    data: File,
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
  selectedFiles: IFile[];
  handleFilesSelectedForUpload: (newFiles: FileList | null) => void;
  totalFilesToUpload: null | number;
}

const promiseAllInSeries = async (iterable) => {
  let output: Array<any> = [];
  for (const x of iterable) {
    await x().then((response) => output.push(response));
  }
  return output;
};

export const useFileUploader = ({
  fileType,
  onUpload,
  asyncFileUpload,
}: IUseFileUploaderArgs): IUseFileUploaderReturn => {
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<null | IFile[]>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [totalFilesToUpload, setTotalFilesToUpload] = useState<number | null>(
    null
  );
  // handle upload selected
  useEffect(() => {
    if (filesToUpload && !uploading && !error) {
      setUploading(true);
      setUploadProgress(filesToUpload.length);
      const promises = filesToUpload.map((file) => async () => {
        if (!file.data) throw Error('Missing file data');
        await asyncFileUpload(file.data, fileType, () => {});
        setFilesToUpload(
          (prev) => prev?.filter((f) => f.name !== file.name) || null
        );
        setUploadProgress((prev) => prev - 1);
        return `Uploaded ${file.name}`;
      });
      promiseAllInSeries(promises)
        .then((responses) => {
          setUploadComplete(true);
          setUploading(false);
          setFilesToUpload(null);
          setSelectedFiles([]);
          onUpload(responses);
          setTotalFilesToUpload(filesToUpload.length);
        })
        .catch((e) => {
          setUploadComplete(true);
          setUploading(false);
          if (ENV === 'development') console.log(e);
          setError('Upload Failed');
        });
    }
    return () => {
      // TODO: handle cancel upload
    };
  }, [filesToUpload, uploading, fileType, onUpload, uploadProgress]);

  const uploadFiles = (fileList: IFile[]) => {
    setError(null);
    setTotalFilesToUpload(fileList.length);
    setFilesToUpload(fileList);
  };

  const handleFilesSelectedForUpload = (newFiles: FileList | null) => {
    const newSelectedFiles: IFile[] = [...(newFiles || [])].map((f: File) => ({
      uid: f.name,
      name: f.name,
      label: f.name,
      data: f,
      filePath: '',
      fileType,
    }));
    setSelectedFiles(newSelectedFiles);
  };

  return {
    uploadFiles,
    uploading,
    uploadProgress,
    uploadComplete,
    error,
    selectedFiles,
    handleFilesSelectedForUpload,
    totalFilesToUpload,
  } as IUseFileUploaderReturn;
};

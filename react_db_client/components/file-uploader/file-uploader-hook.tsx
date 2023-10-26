/* A react hook async request */
import { useState, useEffect, useMemo } from 'react';
import { EFileType, IFile } from '@react_db_client/constants.client-types';

const ENV = process.env.NODE_ENV;

export interface IUseFileUploaderArgs {
  fileType: EFileType;
  onUpload: (responses: unknown) => void;
  asyncFileUpload: (
    data: File,
    fileType: EFileType,
    callback: () => void,
    metaData: Partial<IFile>
  ) => Promise<void>;
}

export interface IUseFileUploaderReturn {
  uploadFiles: (filelist: IFile[]) => void;
  uploading: boolean;
  uploadProgress: number;
  uploadComplete: boolean;
  error: string;
  selectedFiles: IFile[];
  handleFilesSelectedForUpload: (
    newFiles: FileList | null,
    options?: {
      instantUpload?: boolean;
    }
  ) => void;
  totalFilesToUpload: null | number;
  fileSelectionComplete: boolean;
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
  const [filesMetaData, setFilesMetaData] = useState<Partial<IFile>[]>([]);

  // Needed to disable the upload button until file selection complete
  const fileSelectionComplete = useMemo(
    () =>
      filesMetaData.length > 0 && filesMetaData.length === selectedFiles.length,
    [filesMetaData, selectedFiles]
  );

  // handle upload selected
  useEffect(() => {
    if (filesToUpload && !uploading && !error && fileSelectionComplete) {
      setUploading(true);
      setUploadProgress(filesToUpload.length);
      const promises = filesToUpload.map((file, i) => async () => {
        if (!file.data) throw Error('Missing file data');
        const metaData: Partial<IFile> = filesMetaData[i];
        await asyncFileUpload(file.data, fileType, () => {}, metaData);
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
          setFilesMetaData([]);
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
  }, [
    filesToUpload,
    uploading,
    fileType,
    onUpload,
    uploadProgress,
    fileSelectionComplete,
  ]);

  const uploadFiles = (fileList: IFile[]) => {
    setError(null);
    setTotalFilesToUpload(fileList.length);
    setFilesToUpload(fileList);
  };

  const handleFilesSelectedForUpload = (
    newFiles: FileList | null,
    options: { instantUpload?: boolean } = {}
  ) => {
    const files = [...(newFiles || [])];
    const newSelectedFiles: IFile[] = files.map((f: File) => {
      return {
        uid: f.name,
        name: f.name,
        label: f.name,
        data: f,
        filePath: '',
        fileType,
      };
    });
    setSelectedFiles(newSelectedFiles);

    files.forEach((f) => {
      const reader = new FileReader();
      if (fileType === EFileType.IMAGE) {
        reader.onload = () => {
          const data = reader.result as string;
          const img = new Image();
          img.onload = () => {
            setFilesMetaData((prev) => [
              ...prev,
              { width: img.width, height: img.height, name: f.name },
            ]);
          };
          img.src = data;
        };
        reader.readAsDataURL(f);
      } else {
        setFilesMetaData((prev) => [...prev, { name: f.name }]);
      }
    });
    if (options.instantUpload) uploadFiles(newSelectedFiles);
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
    fileSelectionComplete,
  } as IUseFileUploaderReturn;
};

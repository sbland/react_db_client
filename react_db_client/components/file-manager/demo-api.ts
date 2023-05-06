import { EFileType, IFile } from '@react_db_client/constants.client-types';

export const asyncFileUpload = async (
  data: File,
  fileType: EFileType,
  callback: () => void,
  metaData: Partial<IFile>
) => {};

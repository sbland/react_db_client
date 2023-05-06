export interface IFile {
  uid: string;
  label: string;
  name: string;
  filePath: string;
  fileType: EFileType;
  data?: File;
  width?: number;
  height?: number;
}

export enum EFileType {
  ANY = '*',
  DOCUMENT = 'document',
  IMAGE = 'image',
  DATA = 'data',
}

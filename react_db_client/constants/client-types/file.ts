export interface IFile {
  uid: string;
  label: string;
  name: string;
  filePath: string;
  fileType: EFileType;
  data?: File;
}

export enum EFileType {
  ANY = '*',
  DOCUMENT = 'document',
  IMAGE = 'image',
  DATA = 'data',
}

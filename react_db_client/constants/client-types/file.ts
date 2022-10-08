export interface IFile {
  uid: string;
  name: string;
  filePath: string;
  fileType: EFileType;
}

export enum EFileType {
  ANY = '*',
  DOCUMENT = 'document',
  IMAGE = 'image',
  DATA = 'data',
}

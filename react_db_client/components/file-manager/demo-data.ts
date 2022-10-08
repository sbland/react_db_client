import { EFileType, IFile } from '@react_db_client/constants.client-types';

export const demoSearchResults: IFile[] = [
  { uid: 'abc', name: 'abc.jpg', fileType: EFileType.IMAGE, filePath: 'files/abc.jpg' },
  { uid: 'foo', name: 'foo.jpg', fileType: EFileType.IMAGE, filePath: 'files/foo.jpg' },
  { uid: 'bar', name: 'bar.jpg', fileType: EFileType.IMAGE, filePath: 'files/bar.jpg' },
];

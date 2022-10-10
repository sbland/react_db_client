import { EFileType, IFile } from '@react_db_client/constants.client-types';

export const demoSearchResults: IFile[] = [
  {
    uid: 'abc',
    name: 'abc.jpg',
    label: 'abc',
    fileType: EFileType.IMAGE,
    filePath: 'files/abc.jpg',
  },
  {
    uid: 'foo',
    name: 'foo.jpg',
    label: 'foo',
    fileType: EFileType.IMAGE,
    filePath: 'files/foo.jpg',
  },
  {
    uid: 'bar',
    name: 'bar.jpg',
    label: 'bar',
    fileType: EFileType.IMAGE,
    filePath: 'files/bar.jpg',
  },
];

import React from 'react';
import { screen } from '@testing-library/react';
import { EFileType, IFile } from '@react_db_client/constants.client-types';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { FileManager, IFileManagerProps } from './file-manager';
import { demoSearchResults } from './demo-data';
import { asyncFileUpload } from './demo-api';

const defaultProps: IFileManagerProps = {
  handleSelect: (args: any) => alert('Selected'),
  fileType: EFileType.IMAGE,
  allowMultiple: false,
  asyncGetFiles: async () => demoSearchResults,
  fileServerUrl: 'fileserverurl',
  asyncFileUpload,
};

export const BasicFileManager = () => {
  const [savedFiles, setSavedFiles] = React.useState(demoSearchResults);
  const [selection, setSelection] = React.useState<IFile | null>(null);
  const handleFileUpload = async (
    data: File,
    fileType: EFileType,
    callback: () => void,
    metaData: Partial<IFile>
  ) => {
    asyncFileUpload(data, fileType, callback, metaData);
    const fileMetaData: IFile = {
      ...metaData,
      uid: data.name,
      label: data.name,
      name: data.name,
      filePath: '',
      fileType,
      data,
    };
    setSavedFiles((prev) => [...prev, fileMetaData]);
  };
  return (
    <>
      <CompositionWrapDefault height="30rem" width="40rem">
        <FileManager
          {...defaultProps}
          asyncFileUpload={handleFileUpload}
          asyncGetFiles={async () => savedFiles}
          handleSelect={(f) => setSelection(f as IFile)}
        />
      </CompositionWrapDefault>
      <p data-testid="curSel">{selection?.uid}</p>
    </>
  );
};

BasicFileManager.waitForReady = async () => {
  await screen.findByText(demoSearchResults[0].name);
};

export const BasicFileManagerMultiple = () => {
  const [savedFiles, setSavedFiles] = React.useState(demoSearchResults);
  const [selection, setSelection] = React.useState<IFile[]>([]);
  const handleFileUpload = async (
    data: File,
    fileType: EFileType,
    callback: () => void,
    metaData: Partial<IFile>
  ) => {
    asyncFileUpload(data, fileType, callback, metaData);
    const fileMetaData: IFile = {
      uid: data.name,
      label: data.name,
      name: data.name,
      filePath: '',
      fileType,
      data,
    };
    setSavedFiles((prev) => [...prev, fileMetaData]);
  };

  const handleSelect = (f) => {
    setSelection((prev) => [...prev, ...f]);
  };

  return (
    <>
      <CompositionWrapDefault height="30rem" width="40rem">
        <FileManager
          {...defaultProps}
          asyncFileUpload={handleFileUpload}
          asyncGetFiles={async () => savedFiles}
          handleSelect={handleSelect}
          allowMultiple
        />
      </CompositionWrapDefault>
      <p data-testid="curSel">{selection.map((s) => s.uid).join(',')}</p>
    </>
  );
};

BasicFileManagerMultiple.waitForReady = async () => {
  await screen.findByText(demoSearchResults[0].name);
};

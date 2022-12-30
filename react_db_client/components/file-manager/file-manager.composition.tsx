import React from 'react';
import { screen } from '@testing-library/react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { FileManager, IFileManagerProps } from './file-manager';
import { demoSearchResults } from './demo-data';
import { EFileType, IFile } from '@react_db_client/constants.client-types';

const defaultProps: IFileManagerProps = {
  handleSelect: (args: any) => alert('Selected'),
  fileType: EFileType.IMAGE,
  allowMultiple: false,
  asyncGetFiles: async () => demoSearchResults,
  fileServerUrl: 'fileserverurl',
  asyncFileUpload: async (data: File, fileType: EFileType, callback: () => void) => {},
};

export const BasicFileManager = () => {
  const [selection, setSelection] = React.useState<IFile | null>(null);
  return (
    <>
      <CompositionWrapDefault height="30rem" width="40rem">
        <FileManager {...defaultProps} handleSelect={(f) => setSelection(f as IFile)} />
      </CompositionWrapDefault>
      <p data-testid="curSel">{selection?.uid}</p>
    </>
  );
};

BasicFileManager.waitForReady = async () => {
  await screen.findByText(demoSearchResults[0].name);
};

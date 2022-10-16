import React from 'react';
import { screen } from '@testing-library/react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { FileManager, IFileManagerProps } from './file-manager';
import { demoSearchResults } from './demo-data';
import { EFileType } from '@react_db_client/constants.client-types';

const defaultProps: IFileManagerProps = {
  handleSelect: (args: any) => alert('Selected'),
  fileType: EFileType.IMAGE,
  allowMultiple: false,
  asyncGetFiles: async () => demoSearchResults,
  fileServerUrl: 'fileserverurl',
  asyncFileUpload: async (data: File, fileType: EFileType, callback: () => void) => {},
};

export const BasicFileManager = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FileManager {...defaultProps} />
  </CompositionWrapDefault>
);

BasicFileManager.waitForReady = async () => {
  await screen.findByText(demoSearchResults[0].name);
};

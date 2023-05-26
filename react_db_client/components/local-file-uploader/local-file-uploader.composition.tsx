import React from 'react';
import { LocalFileUploader } from './local-file-uploader';

const demoMapToHeadings = [
  { uid: 'a', label: 'A' },
  { uid: 'b', label: 'B' },
  { uid: 'c', label: 'C' },
];

export const BasicLocalFileUploader = () => {
  return (
    <LocalFileUploader
      label="label"
      onAccept={console.log}
      onChange={console.log}
      mapToHeadings={demoMapToHeadings}
      showAcceptButton
    />
  );
};

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { EFileType, IFile } from '@react_db_client/constants.client-types';
import { FileUploader } from '@react_db_client/components.file-uploader';
import {
  SearchAndSelect,
  TSearchAndSelectSearchFunction,
} from '@react_db_client/components.search-and-select-v2';
import { searchResultHeadings, searchResultImageHeadings } from './logic';

export interface IFileManagerProps {
  handleSelect: (fileData: null | IFile | IFile[]) => void;
  collectionId?: never;
  documentId?: never;
  fileType: EFileType;
  allowMultiple?: boolean;
  asyncGetFiles: TSearchAndSelectSearchFunction<IFile>;
  fileServerUrl: string;
  asyncFileUpload: (
    data: File,
    fileType: EFileType,
    callback: () => void,
    metaData: Partial<IFile>
  ) => Promise<void>;
}

export const availableFilters = {}; // TODO: Setup available file filters

export const FileManager: React.FC<IFileManagerProps> = ({
  handleSelect,
  collectionId,
  documentId,
  fileType,
  allowMultiple,
  asyncGetFiles,
  fileServerUrl,
  asyncFileUpload,
}) => {
  const [forceUpdate, setForceUpdate] = useState(0);
  if (collectionId || documentId)
    throw new Error('No longer need collection id and doc id');

  return (
    <div
      className="fileManager_wrap sectionWrapper"
      data-testid="rdc-file-manager"
    >
      <section>
        <h2>Select File</h2>
        <br />
        {/* TODO: Should refresh on file upload */}
        <SearchAndSelect<IFile>
          id="file-manager-existing-files"
          searchFunction={asyncGetFiles}
          initialFilters={[]}
          handleSelect={handleSelect}
          autoUpdate
          allowFilters={false}
          availableFilters={availableFilters}
          headings={
            fileType === EFileType.IMAGE
              ? searchResultImageHeadings(fileServerUrl)
              : searchResultHeadings(fileServerUrl)
          }
          showSearchField
          // searchFieldTargetField="name"
          key={forceUpdate}
          // returnFieldOnSelect="filePath"
          allowMultiple={allowMultiple}
          showRefreshBtn
        />
      </section>
      <section>
        <h2>Upload New File</h2>
        <FileUploader
          fileType={fileType}
          onUpload={() => setForceUpdate(forceUpdate + 1)}
          asyncFileUpload={asyncFileUpload}
        />
      </section>
    </div>
  );
};

FileManager.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  fileType: PropTypes.oneOf(['image', 'document', 'data', '*']),
  allowMultiple: PropTypes.bool,
  asyncGetFiles: PropTypes.func.isRequired,
  fileServerUrl: PropTypes.string.isRequired,
};

FileManager.defaultProps = {
  allowMultiple: false,
  fileType: EFileType.ANY,
};

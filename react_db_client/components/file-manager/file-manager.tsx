import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { EFileType, IFile } from '@react_db_client/constants.client-types';
import { FileUploader } from '@react_db_client/components.file-uploader';
import { SearchAndSelect } from '@react_db_client/components.search-and-select';
import { searchFilesFunction, searchResultHeadings, TAsyncGetDocuments } from './logic';

export interface IFileManagerProps {
  handleSelect: (file: string, fileData: IFile) => void;
  collectionId: string;
  documentId: string;
  fileType: EFileType;
  allowMultiple?: boolean;
  asyncGetDocuments: TAsyncGetDocuments;
  fileServerUrl: string;
}

export const FileManager: React.FC<IFileManagerProps> = ({
  handleSelect,
  collectionId,
  documentId,
  fileType,
  allowMultiple,
  asyncGetDocuments,
  fileServerUrl,
}) => {
  const [forceUpdate, setForceUpdate] = useState(0);
  return (
    <div className="fileManager_wrap sectionWrapper">
      <section>
        <h2>Select File</h2>
        <br />
        <br />
        {/* TODO: Should refresh on file upload */}
        <SearchAndSelect
          searchFunction={searchFilesFunction(asyncGetDocuments)(
            collectionId,
            documentId,
            fileType
          )}
          initialFilters={[]}
          handleSelect={handleSelect}
          autoUpdate
          allowFilters={false}
          headings={searchResultHeadings(fileServerUrl, collectionId, documentId)}
          showSearchField
          // searchFieldTargetField="name"
          key={forceUpdate}
          returnFieldOnSelect="filePath"
          allowMultiple={allowMultiple}
          showRefreshBtn
        />
      </section>
      <section>
        <h2>Upload New File</h2>
        <FileUploader
          collectionId={collectionId}
          documentId={documentId}
          fileType={fileType}
          onUpload={() => setForceUpdate(forceUpdate + 1)}
        />
      </section>
    </div>
  );
};

FileManager.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  collectionId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  fileType: PropTypes.oneOf(['image', 'document', 'data', '*']),
  allowMultiple: PropTypes.bool,
  asyncGetDocuments: PropTypes.func.isRequired,
  fileServerUrl: PropTypes.string.isRequired,
};

FileManager.defaultProps = {
  allowMultiple: false,
  fileType: EFileType.ANY,
};

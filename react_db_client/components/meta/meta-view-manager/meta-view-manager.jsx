import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { LoadingPanel } from '@samnbuk/react_db_client.components.loading-panel';
import { useViewDataManager } from '@samnbuk/react_db_client.components.meta.use-view-data-manager';
import { MetaView } from '@samnbuk/react_db_client.components.meta.meta-view';
import { handleViewModeSwitch } from './helpers';
import { TopMenu } from './top-menu';

export const MetaViewManager = ({
  inputUid,
  datatypeId,
  isNew,
  additionalData,
  onSubmitCallback,
  asyncGetDocument,
  asyncGetDocuments,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
  componentMap,
  saveErrorCallback,
}) => {
  const [viewMode, setViewMode] = useState('view');
  const [showEditTitlePanel, setShowEditTitlePanel] = useState(false);
  const [showRawDataPanel, setShowRawDataPanel] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [hideMissing, setHideMissing] = useState(false);

  const {
    reload,
    saveData,
    updateFormData,
    data,
    deleteObject,
    // uid,
    // initialData,
    loadingData,
    savingData,
    deletingData,
    unsavedChanges, // TODO: Implement this in useasyncobjmaanger
    datatypeData,
    templateData,
    fieldsData,
  } = useViewDataManager({
    datatypeId,
    activeUid: inputUid,
    collection: 'pages',
    isNew: !inputUid || isNew,
    inputAdditionalData: additionalData,
    onSavedCallback: onSubmitCallback,
    loadOnInit: true,
    asyncGetDocument,
    asyncGetDocuments,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
    saveErrorCallback,
  });

  const updatedAt = data?.updatedAt;
  const modifiedBy = data?.updatedBy;
  const createdAt = data?.createdAt;
  const createdBy = data?.createdBy;

  return (
    <>
      {/* TODO: Add edit title panel */}
      <LoadingPanel loading={loadingData} message="Loading Page Data" />
      <LoadingPanel loading={savingData} message="Saving Page Data" />
      <LoadingPanel loading={deletingData} message="Deleting Page Data" />
      <div className="">
        <TopMenu
          unsavedChanges={unsavedChanges}
          viewSwitchFtn={() => {
            setViewMode(handleViewModeSwitch(viewMode));
          }}
          viewMode={viewMode}
          handleEditTitleBtn={() => setShowEditTitlePanel(true)}
          handleCancelEdit={() => {
            setViewMode('view');
            reload();
          }}
          handleDeleteObject={() => deleteObject()}
          handleSaveView={() => saveData()}
          handleShowRawDataPanel={() => {
            setShowRawDataPanel(true);
          }}
          handleDuplicateObject={() => {
            console.log('Duplicate object not implemented!');
          }}
          showErrors={showErrors}
          handleShowErrorsToggle={() => {
            setShowErrors(!showErrors);
          }}
          hideMissing={hideMissing}
          handleHideMissing={() => setHideMissing((prev) => !prev)}
          modifiedat={updatedAt || createdAt}
          modifiedby={modifiedBy || createdBy}
        />
        <MetaView
          viewMode={viewMode}
          pageData={data}
          datatypeData={datatypeData}
          templateData={templateData}
          fieldsData={fieldsData}
          hideMissing={hideMissing}
          updateFormData={updateFormData}
          componentMap={componentMap}
        />
      </div>
    </>
  );
};

MetaViewManager.propTypes = {
  inputUid: PropTypes.string,
  onSubmitCallback: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
  additionalData: PropTypes.shape({}),
  asyncGetDocument: PropTypes.func.isRequired, // Async func
  asyncPutDocument: PropTypes.func.isRequired, // Async func
  asyncPostDocument: PropTypes.func.isRequired, // Async func
  asyncDeleteDocument: PropTypes.func.isRequired, // Async func
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  saveErrorCallback: PropTypes.func,
};

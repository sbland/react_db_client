import { useAsyncObjectManager } from '@samnbuk/react_db_client.async-hooks.use-async-object-manager';

export function useViewDataManager({
  datatypeId,
  activeUid,
  isNew = false,
  // TODO: Setting below causes it to rerun on render
  inputAdditionalData = null,
  schema = 'all',
  populate = 'all',
  loadOnInit = true,
  reloadOnSave = false,
  onSavedCallback = () => {},
  saveErrorCallback = () => {},
  onDeleteCallback = () => {},
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
}) {
  const {
    reload,
    saveData,
    updateFormData,
    data,
    deleteObject,
    resetData,
    uid,
    initialData,
    hasLoaded,
    loadingData,
    savingData,
    deletingData,
    unsavedChanges, // TODO: Implement this in useasyncobjmaanger
  } = useAsyncObjectManager({
    activeUid,
    collection: 'pages',
    isNew,
    inputAdditionalData,
    onSavedCallback,
    loadOnInit,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
    saveErrorCallback,
    onDeleteCallback,
    schema,
    populate,
    reloadOnSave,
  });

  // TODO: Load datatypeData
  const datatypeData = {};
  // TODO: Load templateData
  const templateData = {};

  // TODO: Load fieldsData
  const fieldsData = {};

  return {
    saveData,
    updateFormData,
    resetData,
    reload,
    deleteObject,
    loadingData,
    savingData,
    deletingData,
    data,
    initialData,
    uid,
    hasLoaded,
    unsavedChanges,
    datatypeData,
    templateData,
    fieldsData,
  };
}

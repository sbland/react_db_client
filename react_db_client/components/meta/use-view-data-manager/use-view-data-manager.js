import { useAsyncObjectManager } from '@samnbuk/react_db_client.async-hooks.use-async-object-manager';
import { useAsyncRequest } from '@samnbuk/react_db_client.async-hooks.use-async-request';
import { useEffect, useMemo } from 'react';

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
    data: pageData,
    deleteObject,
    resetData,
    uid,
    initialData,
    hasLoaded: hasLoadedPageData,
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

  const {
    call: loadDatatypeData,
    response: datatypeData,
    loading: loadingDatatypeData,
    hasLoaded: hasLoadedDataTypeData,
  } = useAsyncRequest({
    callOnInit: false,
    callFn: async () => asyncGetDocument('datatypes', datatypeId, 'all', 'all'),
  });


  useEffect(() => {
    if (hasLoadedPageData && pageData?.datatype?.uid && !loadingDatatypeData && !hasLoadedDataTypeData){
      loadDatatypeData();
    }
  }, [hasLoadedPageData, pageData, loadingDatatypeData, hasLoadedDataTypeData]);

  const templateData = useMemo(
    () => (hasLoadedDataTypeData ? datatypeData.template : {}),
    [hasLoadedDataTypeData, datatypeData]
  );

  // TODO: Load fieldsData
  const fieldsData = {};

  return {
    saveData,
    updateFormData,
    resetData,
    reload,
    deleteObject,
    loadingData: loadingData || loadingDatatypeData,
    savingData,
    deletingData,
    initialData,
    uid,
    hasLoaded: hasLoadedPageData && hasLoadedDataTypeData,
    unsavedChanges,
    pageData,
    datatypeData,
    templateData,
    fieldsData,
  };
}

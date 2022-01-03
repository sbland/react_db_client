import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAsyncObjectManager } from '@samnbuk/react_db_client.async-hooks.use-async-object-manager';
import { useAsyncRequest } from '@samnbuk/react_db_client.async-hooks.use-async-request';
import { useGetFieldsData } from './use-get-fields-data';

export function useViewDataManager({
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
  asyncGetDocuments,
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
    callFn: async (datatypeId) => asyncGetDocument('datatypes', datatypeId, 'all', 'all'),
  });

  useEffect(() => {
    if (
      hasLoadedPageData &&
      pageData?.datatype?.uid &&
      !loadingDatatypeData &&
      !hasLoadedDataTypeData
    ) {
      loadDatatypeData([pageData?.datatype?.uid]);
    }
  }, [hasLoadedPageData, pageData?.datatype, loadingDatatypeData, hasLoadedDataTypeData]);

  const templateData = useMemo(
    () => (hasLoadedDataTypeData ? datatypeData.template : {}),
    [hasLoadedDataTypeData, datatypeData?.template]
  );

  const {
    fieldsData = {},
    hasLoaded: hasLoadedFieldsData,
    loading: loadingFieldsData,
  } = useGetFieldsData({ templateData, asyncGetDocuments });

  const updateTitle = useCallback(() => {
    throw Error('Not Implemented');
  }, []);

  const updatePageData = useCallback(
    (field, value) => {
      updateFormData(field, value, false, 'data');
    },
    [updateFormData]
  );

  return {
    saveData,
    updateFormData: updatePageData,
    updateTitle,
    resetData,
    reload,
    deleteObject,
    loadingData: loadingData || loadingDatatypeData || loadingFieldsData,
    savingData,
    deletingData,
    initialData,
    uid,
    hasLoaded: hasLoadedPageData && hasLoadedDataTypeData && hasLoadedFieldsData,
    unsavedChanges,
    pageData,
    datatypeData,
    templateData,
    fieldsData,
  };
}

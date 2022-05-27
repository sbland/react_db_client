/* eslint-disable import/prefer-default-export */
/* A react hook async request */

import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { useAsyncRequest } from '@react_db_client/async-hooks.use-async-request';
import { generateUid } from '@samnbuk/react_db_client.helpers.generate-uid';
import { updateDict } from './helpers';

/**
 * Async React request hook
 *
 * @param {Object} {
 *   - `activeUid` {string} - the active object uid
 *   - `collection` {string} - the collection to load and save to
 *   - `isNew` {bool} - true if the object is new
 *   - `inputAdditionalData` {object} - additional data to be merged with the loaded data
 *   - `schema` {string|Array} - schema override for loading data
 *   - `loadOnInit` {bool} - true if we should load the object on component init
 * }
 * @return {Object} {
 *   - `saveData` {func} - save object function
 *   - `updateData` {func} - update edit data ()
 *   - `updateFormData` = (field, value, save = false) => {...}
 *   - `reload` {func} - reload and reset the object
 *   - `deleteObject` {func} - delete the object
 *   - `saveResponse` {string} - api response to saving the object
 *   - `deleteResponse` {func} - api response to deleting the object
 *   - `loadingData` {bool} - true when loading data
 *   - `savingData` {bool} - true when saving data
 *   - `deletingData` {bool} - true when deleting data
 *   - `data` {any} - the data returned from api and combined with additional data
 *   - `uid` {string} - the active uid
 *   - `callCount` {number} - number of times called
 *   - `hasLoaded` {bool} - true if we have loaded data
 * }
 */
export const useAsyncObjectManager = ({
  activeUid,
  collection,
  isNew: isNewIn = false,
  // TODO: Setting below causes it to rerun on render
  inputAdditionalData = null,
  schema = 'all',
  populate = 'all',
  loadOnInit = true,
  reloadOnSave = false,
  onSavedCallback: onSavedCallbackIn = () => {} /* Returns a message string */,
  saveErrorCallback = () => {} /* Returns a AsyncRequestError */,
  onDeleteCallback = () => {},
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
}) => {
  const [isNew, setIsNew] = useState(!activeUid || isNewIn);
  const [uid] = useState(isNew || !activeUid ? generateUid(collection) : activeUid);
  const [editData, setEditData] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false); // TODO: Implement this
  const [resetToData, setResetToData] = useState({});
  const loadArgs = useMemo(
    () => [collection, uid, schema, populate],
    [collection, uid, schema, populate]
  );

  const [loadedData, setLoadedData] = useState(null);

  const loadedDataCallback = (newLoadedData) => {
    setLoadedData(newLoadedData);
    setEditData({});
  };

  const {
    call: loadAsync,
    loading: loadingData,
    callCount,
    hasLoaded,
  } = useAsyncRequest({
    id: 'loadAsync',
    // TODO: Add populate
    args: loadArgs,
    callFn: asyncGetDocument,
    callOnInit: loadOnInit && !isNew,
    callback: loadedDataCallback,
  });

  const combinedData = useMemo(() => {
    const _combinedData = merge(loadedData, inputAdditionalData, { uid }, editData);
    return _combinedData;
  }, [loadedData, inputAdditionalData, uid, editData]);

  /* Handle Saving Data */
  const onSavedCallback = useCallback(
    (response) => {
      setIsNew(false);
      setUnsavedChanges(false);
      setResetToData({
        ...loadedData,
        ...inputAdditionalData,
        uid,
        ...editData,
      });
      if (reloadOnSave) {
        loadAsync(loadArgs, (loadedResponse) => {
          loadedDataCallback(loadedResponse);
          onSavedCallbackIn(uid, response, combinedData);
        });
      } else {
        onSavedCallbackIn(uid, response, combinedData);
      }
    },
    [
      uid,
      combinedData,
      onSavedCallbackIn,
      editData,
      inputAdditionalData,
      loadedData,
      reloadOnSave,
      loadAsync,
      loadArgs,
    ]
  );

  const {
    response: saveResponse,
    call: saveAsync,
    loading: savingData,
  } = useAsyncRequest({
    id: 'saveAsync',
    callFn: isNew ? asyncPostDocument : asyncPutDocument,
    callOnInit: false,
    callback: onSavedCallback,
    errorCallback: saveErrorCallback,
  });

  /* Handle Deleting Data */
  const {
    response: deleteResponse,
    call: deleteAsync,
    loading: deletingData,
  } = useAsyncRequest({
    id: 'deleteAsync',
    args: [collection, uid],
    callFn: isNew ? () => {} : asyncDeleteDocument,
    callOnInit: false,
  });

  // useEffect(() => {
  //   setResetToData({ ...loadedData, ...inputAdditionalData, uid });
  //   setEditData({ ...loadedData, ...inputAdditionalData, uid });
  //   // FIXME: Adding input additional data as as dependency causes a loop
  // }, [loadedData, inputAdditionalData, uid]);

  useEffect(() => {
    if (deleteResponse && deleteResponse.ok) {
      onDeleteCallback(uid, deleteResponse);
    }
  }, [deleteResponse, onDeleteCallback, uid]);

  /* Handle Update Data */
  const updateData = useCallback((newData) => {
    setUnsavedChanges(true);
    setEditData((prev) => ({ ...prev, ...newData }));
  }, []);

  const updateFormData = useCallback(
    (field, value, save = false, nested = false) => {
      setUnsavedChanges(true);
      const saveAsyncInner = async (newData) => {
        const dataToSave = {
          ...loadedData,
          ...inputAdditionalData,
          uid,
          ...newData,
        };
        saveAsync([collection, uid, dataToSave]);
      };
      setEditData((prev) => {
        return updateDict(prev, saveAsyncInner)(field, value, save, nested);
      });
    },
    [collection, uid, inputAdditionalData, loadedData, saveAsync]
  );

  /* UI Calls */
  const reload = useCallback(() => loadAsync(), [loadAsync]);
  const deleteObject = useCallback(() => deleteAsync(), [deleteAsync]);
  const resetData = useCallback(() => {
    setEditData(resetToData);
  }, [resetToData]);
  const saveData = useCallback(() => {
    saveAsync([collection, uid, combinedData]);
  }, [collection, uid, combinedData, saveAsync]);

  return {
    loadedData,
    saveData,
    updateData,
    updateFormData,
    resetData,
    reload,
    deleteObject,
    saveResponse,
    deleteResponse,
    loadingData,
    savingData,
    deletingData,
    data: combinedData,
    initialData: resetToData,
    uid,
    callCount,
    hasLoaded,
    unsavedChanges,
  };
};

useAsyncObjectManager.propTypes = {
  activeUid: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
  inputAdditionalData: PropTypes.Object,
  schema: PropTypes.arrayOf(PropTypes.string).isRequired,
  loadOnInit: PropTypes.bool,
  reloadOnSave: PropTypes.bool,
  onSavedCallback: PropTypes.func /* Returns a AsyncRequestError */,
  saveErrorCallback: PropTypes.func.isRequired /* Returns a message string */,
  asyncGetDocument: PropTypes.func.isRequired,
  asyncPutDocument: PropTypes.func.isRequired,
  asyncPostDocument: PropTypes.func.isRequired,
  asyncDeleteDocument: PropTypes.func.isRequired,
};

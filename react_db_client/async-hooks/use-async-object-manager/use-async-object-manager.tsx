/* eslint-disable import/prefer-default-export */
/* A react hook async request */

import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import {
  IDocument,
  TAsyncDeleteDocument,
  TAsyncGetDocument,
  TAsyncPostDocument,
  TAsyncPutDocument,
  Uid,
} from '@react_db_client/constants.client-types';
import {
  useAsyncRequest,
  ICallback,
  AsyncRequestError,
} from '@react_db_client/async-hooks.use-async-request';
import { generateUid } from '@react_db_client/helpers.generate-uid';
import cloneDeep from 'lodash/cloneDeep';

export interface IDeleteResponse {
  ok?: boolean;
}

export interface ISaveResponse {
  ok?: boolean;
}

export interface IUseAsyncObjectManagerArgs<DocType extends IDocument> {
  activeUid?: null | Uid;
  collection: string;
  isNew?: boolean;
  inputAdditionalData?: null | Partial<DocType>;
  schema?: string | 'all';
  populate?: 'all' | string[];
  loadOnInit?: boolean;
  reloadOnSave?: boolean;
  onSavedCallback?: (uid: Uid, response: any, combinedData: DocType) => void;
  saveErrorCallback?: (e: AsyncRequestError) => void /* Returns a AsyncRequestError */;
  onDeleteCallback?: ICallback<IDeleteResponse, [string, Uid]>;
  asyncGetDocument: TAsyncGetDocument<DocType>;
  asyncPutDocument: TAsyncPutDocument<DocType>;
  asyncPostDocument: TAsyncPostDocument<DocType>;
  asyncDeleteDocument: TAsyncDeleteDocument;
}

export interface IUseAsyncObjectManagerReturn<DocType extends IDocument> {
  loadedData: null | Partial<DocType>;
  saveData: () => void;
  updateData: (newData: Partial<DocType>) => void;
  updateFormData: (field: Uid, value: any, save?: boolean, nested?: boolean) => void;
  resetData: () => void;
  reload: () => void;
  deleteObject: () => void;
  saveResponse: null | ISaveResponse;
  deleteResponse?: null | IDeleteResponse;
  loadingData: boolean;
  savingData: boolean;
  deletingData: boolean;
  data: Partial<DocType>;
  initialData: Partial<DocType>;
  uid: Uid;
  callCount: number;
  hasLoaded: boolean;
  unsavedChanges: boolean;
  isNew: boolean;
}

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
 *   - `callCount` {number} - number of timesi called
 *   - `hasLoaded` {bool} - true if we have loaded data
 * }
 */
export const useAsyncObjectManager = <DocType extends IDocument>({
  activeUid,
  collection,
  isNew: isNewIn = false,
  // TODO: Setting below causes it to rerun on render
  inputAdditionalData = null,
  schema = 'all',
  populate = 'all',
  loadOnInit = true,
  reloadOnSave = false,
  onSavedCallback: onSavedCallbackIn /* Returns a message string */,
  saveErrorCallback /* Returns a AsyncRequestError */,
  onDeleteCallback,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
}: IUseAsyncObjectManagerArgs<DocType>): IUseAsyncObjectManagerReturn<DocType> => {
  const [isNew, setIsNew] = useState(!activeUid || isNewIn);
  const [uid] = useState(isNew || !activeUid ? generateUid(collection) : activeUid);
  const [editData, setEditData] = useState({});
  const [editDataKey, setEditDataKey] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false); // TODO: Implement this
  const [resetToData, setResetToData] = useState({});
  const loadArgs = useMemo<[string, Uid, string, 'all' | string[]]>(
    () => [collection, uid, schema, populate],
    [collection, uid, schema, populate]
  );

  const [loadedData, setLoadedData] = useState<null | DocType>(null);

  const loadedDataCallback = useCallback((newLoadedData) => {
    setLoadedData(newLoadedData);
    setEditData({});
    setEditDataKey((prev) => prev + 1);
  }, []);

  const loadDataErrorCallback = useCallback((err) => {}, []);

  const {
    call: loadAsync,
    loading: loadingData,
    callCount,
    hasLoaded,
  } = useAsyncRequest({
    id: 'loadAsync',
    args: loadArgs,
    callFn: asyncGetDocument,
    callOnInit: loadOnInit && !isNew,
    callback: loadedDataCallback,
    errorCallback: loadDataErrorCallback,
  });

  const combinedData = useMemo(() => {
    const _combinedData = merge(
      { ...loadedData },
      { ...inputAdditionalData },
      { uid },
      { ...editData }
    );
    return _combinedData;
  }, [loadedData, inputAdditionalData, uid, editData, editDataKey]);

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
          if (onSavedCallbackIn) onSavedCallbackIn(uid, response, combinedData);
        });
      } else {
        if (onSavedCallbackIn) onSavedCallbackIn(uid, response, combinedData);
      }
    },
    [
      uid,
      combinedData,
      onSavedCallbackIn,
      editData,
      editDataKey,
      inputAdditionalData,
      loadedData,
      reloadOnSave,
      loadAsync,
      loadArgs,
    ]
  );

  const saveFn = useMemo(
    () => (isNew ? asyncPostDocument : asyncPutDocument),
    [asyncPutDocument, asyncPostDocument, isNew]
  );

  const {
    response: saveResponse,
    call: saveAsync,
    loading: savingData,
  } = useAsyncRequest({
    id: 'saveAsync',
    callFn: saveFn,
    callOnInit: false,
    callback: onSavedCallback,
    errorCallback: saveErrorCallback,
  });

  /* Handle Deleting Data */
  const deleteFn = useMemo(
    () => (isNew ? async () => {} : asyncDeleteDocument),
    [isNew, asyncDeleteDocument]
  );
  const deleteArgs = useMemo<[string, Uid]>(() => [collection, uid], [collection, uid]);

  const {
    response: deleteResponse,
    call: deleteAsync,
    loading: deletingData,
  } = useAsyncRequest<IDeleteResponse, typeof deleteArgs>({
    id: 'deleteAsync',
    args: deleteArgs,
    callFn: deleteFn,
    callback: onDeleteCallback,
    callOnInit: false,
  });

  // useEffect(() => {
  //   setResetToData({ ...loadedData, ...inputAdditionalData, uid });
  //   setEditData({ ...loadedData, ...inputAdditionalData, uid });
  //   // FIXME: Adding input additional data as as dependency causes a loop
  // }, [loadedData, inputAdditionalData, uid]);

  useEffect(() => {
    if (deleteResponse && deleteResponse.ok) {
      if (onDeleteCallback) onDeleteCallback(deleteResponse, [collection, uid]);
    }
  }, [deleteResponse, onDeleteCallback, uid]);

  /* Handle Update Data */
  const updateData = useCallback((newData) => {
    setUnsavedChanges(true);
    setEditData((prev) => ({ ...prev, ...newData }));
    setEditDataKey((prev) => prev + 1);
  }, []);

  const updateFormData = useCallback(
    (field, value, save = false, nested = false) => {
      setUnsavedChanges(true);
      setEditData((prev) => {
        let dataCopy = cloneDeep(prev);
        if (nested) {
          const nestedLayers = nested.split('.');
          const nestedData = nestedLayers
            .reverse()
            .reduce((acc, v) => ({ [v]: acc }), { [field]: value });
          dataCopy = merge(dataCopy, nestedData);
        } else {
          dataCopy = { ...dataCopy, [field]: value };
        }
        if (save) {
          const dataToSave = {
            ...loadedData,
            ...inputAdditionalData,
            uid,
            ...dataCopy,
          };
          saveAsync([collection, uid, dataToSave]);
        }
        return dataCopy;
      });
      setEditDataKey((prev) => prev + 1);
    },
    [collection, uid, inputAdditionalData, loadedData, saveAsync]
  );

  /* UI Calls */
  const reload = useCallback(() => loadAsync(), [loadAsync]);
  const deleteObject = useCallback(() => deleteAsync(), [deleteAsync]);
  const resetData = useCallback(() => {
    setEditData(resetToData);
    setEditDataKey((prev) => prev + 1);
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
    isNew,
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

/* A react hook for syncing server/client state for a single document.

This was created as a prototype and needs a lot of refactoring!

*/
import React from 'react';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useAsyncFnReset from './use-async-fn-reset';
import {
  IDocument,
  TAsyncDeleteDocument,
  TAsyncGetDocument,
  TAsyncPostDocument,
  TAsyncPutDocument,
  Uid,
  IDeleteResponse,
  ISaveResponse,
} from '@react_db_client/constants.client-types';
import {
  ICallback,
  AsyncRequestError,
} from '@react_db_client/async-hooks.use-async-request';
import { generateUid } from '@react_db_client/helpers.generate-uid';

export interface IUseAsyncObjectManagerArgs<DocType extends IDocument> {
  activeUid?: null | Uid;
  collection: string;
  isNew?: boolean;
  inputAdditionalData?: null | Partial<DocType>;
  schema?: string | 'all';
  populate?: 'all' | string[];
  loadOnInit?: boolean;
  autoSave?: boolean;
  reloadOnSave?: boolean;
  saveAllOnSave?: boolean;
  onSavedCallback?: (uid: Uid, response: any, combinedData: DocType) => void;
  saveErrorCallback?: (
    e: AsyncRequestError
  ) => void /* Returns a AsyncRequestError */;
  onDeleteCallback?: ICallback<IDeleteResponse, [string, Uid]>;
  asyncGetDocument: TAsyncGetDocument<DocType>;
  asyncPutDocument: TAsyncPutDocument<DocType>;
  asyncPostDocument: TAsyncPostDocument<DocType>;
  asyncDeleteDocument?: TAsyncDeleteDocument;
}

export interface IUseAsyncObjectManagerReturn<DocType extends IDocument> {
  loadedData?: Partial<DocType>;
  saveData: () => void;
  updateData: (newData: Partial<DocType>, save?: boolean) => void;
  updateField: (
    field: Uid,
    value: any,
    save?: boolean,
    nested?: string
  ) => void;
  resetData: () => void;
  reload: () => void;
  deleteObject: () => void;
  saveResponse?: ISaveResponse;
  deleteResponse?: void | null | IDeleteResponse;
  loadingData: boolean;
  savingData: boolean;
  deletingData: boolean;
  data: Partial<DocType>;
  savedData?: Partial<DocType>;
  uid: Uid;
  callCount: number;
  hasLoaded: boolean;
  loadError?: AsyncRequestError;
  saveError?: AsyncRequestError;
  unsavedChanges: boolean;
  isNew: boolean;
}

const NO_OP_ASYNC = async () => {};

export const useAsyncObjectManager = <DocType extends IDocument>({
  activeUid,
  collection,
  isNew: isNewIn = false,
  inputAdditionalData = null,
  schema = 'all',
  populate = 'all',
  loadOnInit = true,
  autoSave = false,
  reloadOnSave = false,
  saveAllOnSave = false,
  onSavedCallback: onSavedCallbackIn /* Returns a message string */,
  saveErrorCallback /* Returns a AsyncRequestError */,
  onDeleteCallback,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
}: IUseAsyncObjectManagerArgs<DocType>): IUseAsyncObjectManagerReturn<DocType> => {
  const [isNew, setIsNew] = React.useState(!activeUid || isNewIn);
  const [uid] = React.useState(
    isNew || !activeUid ? generateUid(collection, null, null) : activeUid
  );
  const [unsavedChanges, setUnsavedChanges] = React.useState(false); // TODO: Implement this
  // TODO: Might need to replace with useAsyncFnReset
  const [savingDataState, asyncSaveData, asyncSaveDataReset] = useAsyncFnReset(
    asyncPutDocument,
    [asyncPutDocument]
  );
  const [savingNewDataState, asyncSaveNewData, asyncSaveNewDataReset] =
    useAsyncFnReset(asyncPostDocument, [asyncPostDocument]);
  const [deletingDataState, asyncDeleteData, asyncDeleteDataReset] =
    useAsyncFnReset(asyncDeleteDocument || NO_OP_ASYNC);
  const [loadedDataState, callLoadData] = useAsyncFn(
    async () => asyncGetDocument(collection, uid, schema, populate),
    [collection, uid, schema, populate, asyncGetDocument]
  );
  const hasLoaded = React.useRef(false);
  const hasDeleted = React.useRef(false);
  const [shouldSave, setShouldSave] = React.useState(false);
  const [newData, setNewData] = React.useState(loadedDataState.value);
  const [receivedResponse, setReceivedResponse] = React.useState(false);
  const [savedData, setSavedData] = React.useState<
    Partial<DocType> | undefined
  >(loadedDataState.value);
  const [combinedData, setCombinedData] = React.useState<Partial<DocType>>({
    ...(loadedDataState.value || ({} as Partial<DocType>)),
    ...inputAdditionalData,
    uid,
  });

  React.useEffect(() => {
    if (loadOnInit && !hasLoaded.current) {
      callLoadData();
    }
  }, [loadOnInit, callLoadData]);

  React.useEffect(() => {
    const error = savingDataState.error || savingNewDataState.error;
    if (receivedResponse && error) {
      setReceivedResponse(false);
      if (saveErrorCallback)
        saveErrorCallback(
          new AsyncRequestError(
            error?.message || 'Unknown Async Request Error',
            error
          )
        );
    }
  }, [
    savingDataState,
    savingNewDataState,
    receivedResponse,
    saveErrorCallback,
  ]);

  React.useEffect(() => {
    if (
      !deletingDataState.loading &&
      hasDeleted.current &&
      deletingDataState.value
    ) {
      // TODO: Check on delete args
      if (onDeleteCallback)
        onDeleteCallback(deletingDataState.value, [collection, uid]);
    }
  }, [deletingDataState, onDeleteCallback, collection, uid]);

  React.useEffect(() => {
    if (
      loadedDataState.value &&
      !loadedDataState.loading &&
      !hasLoaded.current
    ) {
      hasLoaded.current = true;
      setCombinedData({
        ...(loadedDataState.value || ({} as Partial<DocType>)),
        ...inputAdditionalData,
        uid,
      });
    }
  }, [uid, loadedDataState, inputAdditionalData]);

  React.useEffect(() => {
    const error = savingDataState.error || savingNewDataState.error;
    const value = savingDataState.value || savingNewDataState.value;
    if (receivedResponse && !error && value) {
      const fullData = { ...combinedData, uid };
      setReceivedResponse(false);
      setIsNew(false);
      setUnsavedChanges(false);
      setSavedData(combinedData);
      if (onSavedCallbackIn) onSavedCallbackIn(uid, value, fullData as DocType);
      if (reloadOnSave) callLoadData();
    }
  }, [
    receivedResponse,
    savingDataState,
    savingNewDataState,
    combinedData,
    uid,
    onSavedCallbackIn,
    reloadOnSave,
  ]);

  React.useEffect(() => {
    if (shouldSave) {
      setShouldSave(false);
      const dataToSave: DocType = saveAllOnSave
        ? {
            ...inputAdditionalData,
            ...((combinedData as DocType) || ({} as DocType)),
            uid,
          }
        : {
            ...inputAdditionalData,
            ...(newData || ({} as DocType)),
            uid,
          };
      asyncSaveDataReset();
      asyncSaveNewDataReset();
      const postCall = isNew ? asyncSaveNewData : asyncSaveData;
      postCall(collection, uid, dataToSave).finally(() => {
        setReceivedResponse(true);
      });
    }
  }, [
    uid,
    collection,
    newData,
    shouldSave,
    isNew,
    asyncSaveData,
    asyncSaveNewData,
    asyncSaveDataReset,
    asyncSaveNewDataReset,
    inputAdditionalData,
    combinedData,
  ]);

  const updateField = (field, value, save?: boolean, nested?: string) => {
    // TODO: Is there a more efficient way to update data here
    setNewData((prev) => {
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
      return dataCopy;
    });
    setCombinedData((prev) => {
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
      return dataCopy;
    });
    if (save || autoSave) setShouldSave(true);
  };

  const updateData = (newData: Partial<DocType>, save?) => {
    // TODO: Is there a more efficient way to update data here
    setNewData((prev) => {
      let dataCopy = cloneDeep(prev);
      dataCopy = { ...dataCopy, ...newData };
      return dataCopy;
    });
    setCombinedData((prev) => {
      let dataCopy = cloneDeep(prev);
      dataCopy = { ...dataCopy, ...newData };
      return dataCopy;
    });
    if (save || autoSave) setShouldSave(true);
  };

  const saveData = () => {
    setShouldSave(true);
  };

  const deleteObject = () => {
    hasDeleted.current = true;
    asyncDeleteData(collection, uid);
  };

  const resetData = () => {
    throw new Error('Not Implemented');
  };

  const reload = () => {
    hasLoaded.current = false;
    callLoadData();
  };

  const loadError =
    loadedDataState.error &&
    new AsyncRequestError(loadedDataState.error.message, loadedDataState.error);

  const saveError =
    savingDataState.error &&
    new AsyncRequestError(savingDataState.error.message, savingDataState.error);

  const [callCount, setCallCount] = React.useState(0);
  React.useEffect(() => {
    if (loadedDataState.loading) setCallCount((prev) => prev + 1);
  }, [loadedDataState.loading]);

  return {
    loadedData: loadedDataState.value,
    saveData,
    updateData,
    updateField,
    resetData,
    reload,
    deleteObject,
    saveResponse: savingDataState.value || savingNewDataState.value,
    deleteResponse: deletingDataState.value,
    loadingData: loadedDataState.loading,
    savingData: savingDataState.loading || savingNewDataState.loading,
    deletingData: deletingDataState.loading,
    data: combinedData,
    savedData,
    uid,
    callCount,
    hasLoaded: !loadedDataState.loading && loadedDataState.value != null, // TODO: Implement this properly
    loadError,
    saveError,
    unsavedChanges,
    isNew,
  };
};

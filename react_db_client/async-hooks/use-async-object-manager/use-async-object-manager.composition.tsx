/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { screen } from '@testing-library/react';

import { demoDbData, demoLoadedData, IDemoDoc, inputAdditionalData } from './demo-data';

import {
  IUseAsyncObjectManagerArgs,
  IUseAsyncObjectManagerReturn,
  useAsyncObjectManager,
} from './use-async-object-manager';
import cloneDeep from 'lodash/cloneDeep';
import { JSONStringifySorted } from './test-utils';
import { Uid } from '@react_db_client/constants.client-types';

const sleep = (delay) =>
  new Promise((res: (value?: any) => void) => {
    setTimeout(function () {
      res();
    }, delay);
  });

interface IVizProps
  extends IUseAsyncObjectManagerReturn<IDemoDoc>,
    IUseHandleCallbacksReturn,
    ReturnType<typeof useDemoDatabase> {}

const Viz = ({
  loadedData,
  saveData,
  updateData,
  updateField,
  resetData,
  reload,
  deleteObject,
  saveResponse,
  deleteResponse,
  loadingData,
  savingData,
  deletingData,
  data,
  uid,
  callCount,
  dbData,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
  saveError,
  onSavedCallbackResponse,
  saveErrorCallbackResponse,
  onDeleteCallbackResponse,
}: IVizProps) => (
  <div>
    {uid}
    <button type="button" className="button-one" onClick={reload}>
      Reload data
    </button>
    <div>{loadingData ? 'loading data' : 'Loaded data'}</div>
    <div>
      Loaded data:
      <span data-testid="loadedData">{JSONStringifySorted(loadedData)}</span>
    </div>
    <div>
      data:
      <span data-testid="data">{JSONStringifySorted(data)}</span>
    </div>
    <div>
      Callcount: <span data-testid="callcount">{callCount}</span>
    </div>
    <p>
      <label htmlFor="goodbyeInput">Goodbye Input</label>
      <input
        id="goodbyeInput"
        onChange={(e) => updateField('goodbye', e.target.value, false)}
        value={data?.goodbye || ''}
      />
    </p>
    <p>
      <button onClick={() => saveData()}>Save</button>
    </p>

    <div>
      <h1>Db data</h1>
      <p data-testid="dbData">{JSON.stringify(dbData)}</p>
    </div>
    <div>
      <h1>Db overrides</h1>
      <p>
        <label htmlFor="goodbyeInputDb">Goodbye Input Db</label>
        <input
          id="goodbyeInputDb"
          onChange={(e) => {
            asyncPostDocument('demoCollection', demoLoadedData.uid, {
              ...dbData.demoCollection[demoLoadedData.uid],
              goodbye: e.target.value,
            });
          }}
          value={dbData.demoCollection[demoLoadedData.uid]?.goodbye || ''}
        />
      </p>
    </div>
    <div>
      <h1>Responses</h1>
      <div>
        <p data-testid="saveResponse">{saveResponse?.ok || JSON.stringify(saveResponse)}</p>
        <p data-testid="saveError">{saveError && saveError.message}</p>
      </div>
    </div>
    <div>
      <h1>Callbacks</h1>
      {onSavedCallbackResponse && (
        <p data-testid="onSavedCallbackResponse">{JSON.stringify(onSavedCallbackResponse)}</p>
      )}
      {saveErrorCallbackResponse && (
        <p data-testid="saveErrorCallbackResponse">
          {saveErrorCallbackResponse.message || 'UNKNOWN ERROR'}
        </p>
      )}
      {onDeleteCallbackResponse && (
        <p data-testid="onDeleteCallbackResponse">{JSON.stringify(onDeleteCallbackResponse)}</p>
      )}
    </div>
  </div>
);

const defaultArgs: IUseAsyncObjectManagerArgs<IDemoDoc> = {
  activeUid: demoLoadedData.uid,
  collection: 'demoCollection',
  isNew: false,
  inputAdditionalData,
  schema: 'all',
  loadOnInit: false,

  asyncGetDocument: async () => ({} as any),
  asyncPutDocument: async () => ({ ok: true } as any),
  asyncPostDocument: async () => ({ ok: true } as any),
  asyncDeleteDocument: async () => ({ ok: true } as any),
};

const useDemoDatabase = () => {
  const [data, setData] = React.useState(cloneDeep(demoDbData));
  const asyncGetDocument = async (collection, uid) => {
    await sleep(100);
    return data[collection][uid];
  };
  const asyncPutDocument = async (collection, uid, objData) => {
    await sleep(100);
    if (objData.goodbye === 'ERROR') {
      throw new Error('You asked for an error?');
    }
    setData((prev) => ({
      ...prev,
      [collection]: {
        ...prev[collection],
        [uid]: { ...prev[collection][uid], ...objData },
      },
    }));
    return { ok: true };
  };
  const asyncPostDocument = async (collection, uid, newData) => {
    await sleep(100);
    setData((prev) => ({
      ...prev,
      [collection]: { ...prev[collection], [uid]: newData },
    }));
    return { ok: true };
  };
  const asyncDeleteDocument = async (collection, uid) => {
    await sleep(100);
    setData((prev) => ({
      ...prev,
      [collection]: { ...prev[collection], [uid]: undefined },
    }));
    return { ok: true };
  };

  return {
    dbData: data,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
  };
};

interface IUseHandleCallbacksReturn {
  onSavedCallbackResponse: Uid;
  saveErrorCallbackResponse;
  onDeleteCallbackResponse;
}
const useHandleCallbacks = () => {
  const [onSavedCallbackResponse, setonSavedCallbackResponse] = React.useState<any>(null);
  const [saveErrorCallbackResponse, setsaveErrorCallbackResponse] = React.useState(null);
  const [onDeleteCallbackResponse, setonDeleteCallbackResponse] = React.useState(null);

  const onSavedCallback = (uid: Uid, response: any, combinedData: any) => {
    setsaveErrorCallbackResponse(null);
    setonSavedCallbackResponse([uid, response, combinedData]);
  };
  const saveErrorCallback = (e) => {
    setonSavedCallbackResponse(null);
    setsaveErrorCallbackResponse(e);
  };
  const onDeleteCallback = (e) => {
    setonDeleteCallbackResponse(e);
  };

  return {
    onSavedCallback,
    saveErrorCallback,
    onDeleteCallback,
    onSavedCallbackResponse,
    saveErrorCallbackResponse,
    onDeleteCallbackResponse,
  };
};

export const AsyncTest = () => {
  const handleCallbacks = useHandleCallbacks();
  const database = useDemoDatabase();
  const asyncOut = useAsyncObjectManager({
    ...defaultArgs,
    ...database,
    ...handleCallbacks,
  });

  return <Viz {...asyncOut} {...database} {...handleCallbacks} />;
};

AsyncTest.waitForReady = async () => {};

export const AsyncTestNewObject = () => {
  const handleCallbacks = useHandleCallbacks();
  const database = useDemoDatabase();
  const asyncOut = useAsyncObjectManager({
    ...defaultArgs,
    inputAdditionalData,
    activeUid: undefined,
    ...database,
    ...handleCallbacks,
  });

  return <Viz {...asyncOut} {...database} {...handleCallbacks} />;
};

AsyncTestNewObject.waitForReady = async () => {};

export const AsyncTestLoadOnInit = () => {
  const handleCallbacks = useHandleCallbacks();
  const database = useDemoDatabase();
  const asyncOut = useAsyncObjectManager({
    ...defaultArgs,
    ...database,
    loadOnInit: true,
    ...handleCallbacks,
  });
  return <Viz {...asyncOut} {...database} {...handleCallbacks} />;
};

AsyncTestLoadOnInit.waitForReady = async () => {
  await screen.findByText('Loaded data');
};

export const AsyncTestSaveAll = () => {
  const handleCallbacks = useHandleCallbacks();
  const database = useDemoDatabase();
  const asyncOut = useAsyncObjectManager({
    ...defaultArgs,
    ...database,
    loadOnInit: true,
    saveAllOnSave: true,
    ...handleCallbacks,
  });
  return <Viz {...asyncOut} {...database} {...handleCallbacks} />;
};

AsyncTestSaveAll.waitForReady = async () => {
  await screen.findByText('Loaded data');
};

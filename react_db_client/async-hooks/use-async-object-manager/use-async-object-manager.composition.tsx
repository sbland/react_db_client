/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { screen } from '@testing-library/react';

import { demoDbData, demoLoadedData, IDemoDoc } from './demo-data';

import {
  IUseAsyncObjectManagerArgs,
  IUseAsyncObjectManagerReturn,
  useAsyncObjectManager,
} from './use-async-object-manager';
import cloneDeep from 'lodash/cloneDeep';

const sleep = (delay) =>
  new Promise((res: (value?: any) => void) => {
    setTimeout(function () {
      res();
    }, delay);
  });

interface IVizProps extends IUseAsyncObjectManagerReturn<IDemoDoc> {}

const Viz = ({
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
  data,
  uid,
  callCount,
}: IVizProps) => (
  <div>
    {uid}
    <button type="button" className="button-one" onClick={reload}>
      Reload data
    </button>
    <div>{loadingData ? 'loading data' : 'Loaded data'}</div>
    <div>
      Loaded data:
      <span>{JSON.stringify(loadedData)}</span>
    </div>
    <div>
      data:
      <span>{JSON.stringify(data)}</span>
    </div>
    <div>Callcount: {callCount}</div>
    <p>
      <label htmlFor="goodbyeInput">Goodbye Input</label>
      <input
        id="goodbyeInput"
        onChange={(e) => updateFormData('goodbye', e.target.value, false)}
        value={data?.goodbye || ''}
      />
    </p>
    <p>
      <button onClick={() => saveData()}>Save</button>
    </p>
  </div>
);

const defaultArgs: IUseAsyncObjectManagerArgs<IDemoDoc> = {
  activeUid: demoLoadedData.uid,
  collection: 'demoCollection',
  isNew: false,
  inputAdditionalData: {},
  schema: 'all',
  loadOnInit: false,
  asyncGetDocument: async () => ({} as any),
  asyncPutDocument: async () => {},
  asyncPostDocument: async () => {},
  asyncDeleteDocument: async () => {},
};

const useDemoDatabase = () => {
  const [data, setData] = React.useState(cloneDeep(demoDbData));
  const asyncGetDocument = async (collection, uid) => {
    await sleep(100);
    return data[collection][uid];
  };
  const asyncPutDocument = async (collection, uid, objData) => {
    await sleep(100);
    setData((prev) => ({
      ...prev,
      [collection]: { ...prev[collection], [uid]: { ...prev[collection][uid], ...objData } },
    }));
  };
  const asyncPostDocument = async (collection, uid, newData) => {
    await sleep(100);
    setData((prev) => ({ ...prev, [collection]: { ...prev[collection], [uid]: newData } }));
  };
  const asyncDeleteDocument = async (collection, uid) => {
    await sleep(100);
    setData((prev) => ({ ...prev, [collection]: { ...prev[collection], [uid]: undefined } }));
  };

  // console.info(data);

  return {
    data,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
  };
};

export const AsyncTest = () => {
  const {
    data: dbData,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
  } = useDemoDatabase();
  const {
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
    data,
    uid,
    callCount,
    hasLoaded,
    initialData,
    unsavedChanges,
    isNew,
  } = useAsyncObjectManager({
    ...defaultArgs,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
  });

  return (
    <>
      <Viz
        loadedData={loadedData}
        saveData={saveData}
        updateData={updateData}
        updateFormData={updateFormData}
        resetData={resetData}
        reload={reload}
        deleteObject={deleteObject}
        saveResponse={saveResponse}
        deleteResponse={deleteResponse}
        loadingData={loadingData}
        savingData={savingData}
        deletingData={deletingData}
        data={data}
        uid={uid}
        callCount={callCount}
        initialData={initialData}
        hasLoaded={hasLoaded}
        unsavedChanges={unsavedChanges}
        isNew={isNew}
      />
      <div>
        <h1>Db data</h1>
        <p data-testid="dbData">{JSON.stringify(dbData)}</p>
      </div>
    </>
  );
};

AsyncTest.waitForReady = async () => {};

export const AsyncTestLoadOnInit = () => {
  const {
    data: dbData,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
  } = useDemoDatabase();
  const {
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
    data,
    uid,
    callCount,
    initialData,
    hasLoaded,
    unsavedChanges,
    isNew,
  } = useAsyncObjectManager({
    ...defaultArgs,
    loadOnInit: true,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
  });
  return (
    <>
      <Viz
        loadedData={loadedData}
        saveData={saveData}
        updateData={updateData}
        updateFormData={updateFormData}
        resetData={resetData}
        reload={reload}
        deleteObject={deleteObject}
        saveResponse={saveResponse}
        deleteResponse={deleteResponse}
        loadingData={loadingData}
        savingData={savingData}
        deletingData={deletingData}
        data={data}
        uid={uid}
        callCount={callCount}
        initialData={initialData}
        hasLoaded={hasLoaded}
        unsavedChanges={unsavedChanges}
        isNew={isNew}
      />

      <div>
        <h1>Db data</h1>
        <p data-testid="dbData">{JSON.stringify(dbData)}</p>
      </div>
    </>
  );
};

AsyncTestLoadOnInit.waitForReady = async () => {
  await screen.findByText('Loaded data');
};

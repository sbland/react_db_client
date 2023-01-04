/* eslint-disable camelcase */
import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { mount } from 'enzyme';
import { AsyncTest1, AsyncTest2 } from './use-async-object-manager.composition';
import { useAsyncObjectManager } from './use-async-object-manager';
import { act as actR } from 'react-dom/test-utils';

Date.now = jest.fn().mockImplementation(() => 0);

const loadedData = { loaded: 'data' };

const asyncGetDocument = jest.fn().mockImplementation(async () => loadedData);
const asyncPutDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
const asyncPostDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
const asyncDeleteDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
const onSavedCallback = jest.fn();

const defaultArgs = {
  activeUid: 'demouid',
  collection: 'democollection',
  isNew: false,
  inputAdditionalData: {},
  schema: 'all',
  populate: 'all',
  loadOnInit: true,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
  onSavedCallback,
};

describe.skip('useAsyncObjectManager', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  describe('Compositions', () => {
    test('should render asyncTest1', () => {
      actR(() => {
        mount(<AsyncTest1 />);
      });
      actR(() => {
        jest.runOnlyPendingTimers();
      });
    });
    /* TODO: Fix this test as having async issues */
    test.skip('should render asyncTest2', () => {
      actR(() => {
        mount(<AsyncTest2 />);
      });
      actR(() => {
        jest.runOnlyPendingTimers();
      });
    });
  });

  describe('Functional Tests', () => {
    beforeEach(() => {
      asyncGetDocument.mockClear();
      asyncPutDocument.mockClear();
      asyncPostDocument.mockClear();
      asyncDeleteDocument.mockClear();
      onSavedCallback.mockClear();
    });
    test('should call async get docs', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAsyncObjectManager(defaultArgs));
      expect(asyncGetDocument).toHaveBeenCalledWith(
        defaultArgs.collection,
        defaultArgs.activeUid,
        defaultArgs.schema,
        defaultArgs.populate
      );
      expect(result.current.loadedData).toEqual(null);
      expect(result.current.data).toEqual({
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
      });
      await waitForNextUpdate();
      expect(result.current.loadedData).toEqual(loadedData);
      expect(result.current.data).toEqual({
        ...loadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
      });
    });
    test('should save data', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAsyncObjectManager(defaultArgs));
      await waitForNextUpdate();
      act(() => {
        result.current.saveData();
      });
      await waitForNextUpdate();
      act(() => {
        jest.runOnlyPendingTimers();
      });
      expect(asyncPutDocument).toHaveBeenCalledWith(defaultArgs.collection, defaultArgs.activeUid, {
        ...loadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
      });
    });
    test('should update form data', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAsyncObjectManager(defaultArgs));
      await waitForNextUpdate();
      expect(result.current.data).toEqual({
        ...loadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
      });
      const editField = 'edit';
      const editValue = 'val';
      act(() => {
        result.current.updateFormData(editField, editValue);
      });
      expect(result.current.data).toEqual({
        ...loadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
        [editField]: editValue,
      });
    });
    test('should update form data and save', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAsyncObjectManager(defaultArgs));
      await waitForNextUpdate();
      expect(onSavedCallback).not.toHaveBeenCalled();
      expect(result.current.data).toEqual({
        ...loadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
      });

      asyncGetDocument.mockClear();

      /* Update field */
      const editField = 'edit';
      const editValue = 'val';
      act(() => {
        result.current.updateFormData(editField, editValue, true);
      });
      await waitForNextUpdate();

      /* put document is called */
      const combinedData = {
        ...loadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
        [editField]: editValue,
      };
      expect(asyncPutDocument).toHaveBeenCalledWith(
        defaultArgs.collection,
        defaultArgs.activeUid,
        combinedData
      );

      /* On save callback called */
      expect(onSavedCallback).toHaveBeenCalledWith(
        defaultArgs.activeUid,
        { ok: true },
        combinedData
      );
      expect(onSavedCallback).toHaveBeenCalledTimes(1);

      expect(asyncGetDocument).not.toHaveBeenCalled();
      /* Final data should be the reloaded data with all other changes cleared */
      expect(result.current.data).toEqual(combinedData);
    });
    test('should update form data and save then reload', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useAsyncObjectManager({ ...defaultArgs, reloadOnSave: true })
      );
      await waitForNextUpdate();
      expect(result.current.data).toEqual({
        ...loadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
      });

      /* We provide alternate load data to show that data is reloaded */
      const altLoadedData = { ...loadedData, altdata: 'altdata' };
      asyncGetDocument.mockClear();
      asyncGetDocument.mockImplementation(async () => altLoadedData);

      /* Update field */
      const editField = 'edit';
      const editValue = 'val';
      act(() => {
        result.current.updateFormData(editField, editValue, true);
      });
      await waitForNextUpdate();

      // /* put document is called */
      const combinedData = {
        ...loadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
        [editField]: editValue,
      };
      expect(asyncPutDocument).toHaveBeenCalledWith(
        defaultArgs.collection,
        defaultArgs.activeUid,
        combinedData
      );

      /* On save callback called */
      expect(onSavedCallback).toHaveBeenCalledWith(
        defaultArgs.activeUid,
        { ok: true },
        combinedData
      );
      expect(onSavedCallback).toHaveBeenCalledTimes(1);

      /* We now reload data */
      expect(asyncGetDocument).toHaveBeenCalledWith(
        defaultArgs.collection,
        defaultArgs.activeUid,
        'all',
        'all'
      );

      /* Final data should be the reloaded data with all other changes claered */
      expect(result.current.data).toEqual({
        ...altLoadedData,
        ...defaultArgs.inputAdditionalData,
        uid: defaultArgs.activeUid,
      });
    });
  });
});

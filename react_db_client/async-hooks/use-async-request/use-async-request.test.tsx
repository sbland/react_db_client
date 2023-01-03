import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncRequest } from '.';

describe('Data loader hook', () => {
  test('should allow any call fn', () => {
    () => useAsyncRequest({ callFn: async () => {} });
    () => useAsyncRequest({ callFn: async (a, b, c) => {} });
  });
  test('should delay data loading till reload is called', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
    );
    expect(result.current.response).toEqual(null);
    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(false);
    expect(result.current.error).toEqual(undefined);
    expect(mockLoadFn).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.call();
    });
    expect(mockLoadFn).toHaveBeenCalledTimes(1);
    expect(mockLoadFn).toHaveBeenCalledWith('products', 'filter');

    expect(result.current.loading).toEqual(true);
    expect(result.current.hasLoaded).toEqual(false);
    expect(result.current.response).toEqual(null);

    await waitForNextUpdate();

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData);
    expect(result.current.error).toEqual(undefined);
  });

  test('should load data immediately', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: true, callFn: mockLoadFn })
    );
    expect(result.current.loading).toEqual(true);
    expect(mockLoadFn).toHaveBeenCalledTimes(1);
    expect(mockLoadFn).toHaveBeenCalledWith('products', 'filter');

    await waitForNextUpdate();

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData);
    expect(result.current.error).toEqual(undefined);
  });

  test('should allow args override', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
    );
    expect(result.current.response).toEqual(null);
    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(false);
    expect(result.current.error).toEqual(undefined);

    act(() => {
      result.current.reload(['hello']);
    });
    expect(result.current.loading).toEqual(true);
    expect(result.current.hasLoaded).toEqual(false);

    expect(mockLoadFn).toHaveBeenCalledWith('hello');

    await waitForNextUpdate();

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData);
    expect(result.current.error).toEqual(undefined);
  });

  test('should handle multiple async calls', async () => {
    const args = ['products', 'filter'];
    const demoData = ['call 0 reponse', 'call 1 reponse', 'call 2 reponse'];
    // const r = [];

    const mockLoadFn = jest.fn().mockImplementation(async (i) => demoData[i]);

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
    );
    act(() => {
      result.current.reload([0]);
    });
    act(() => {
      result.current.reload([1]);
    });
    act(() => {
      result.current.reload([2]);
    });

    expect(result.current.loading).toEqual(true);

    await waitForNextUpdate();
    expect(mockLoadFn).toHaveBeenCalledTimes(3);
    expect(mockLoadFn.mock.calls[0]).toEqual([0]);

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData[2]);
    expect(result.current.error).toEqual(undefined);
  });

  test('should handle multiple async calls and only return last called', async () => {
    const args = ['products', 'filter'];
    const demoData = ['call 0 reponse', 'call 1 reponse', 'call 2 reponse'];
    const r = [] as ((value?: unknown) => void)[];

    const delayedPromise = () =>
      new Promise((res) => {
        r.push(res);
      });

    const mockLoadFn = jest.fn().mockImplementation(async (i) => {
      await delayedPromise();
      return demoData[i];
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
    );

    /* We call reload 3 times with 3 different values */
    act(() => {
      result.current.reload([0]);
    });
    act(() => {
      result.current.reload([1]);
    });
    act(() => {
      result.current.reload([2]);
    });
    // await waitForNextUpdate();
    expect(result.current.loading).toEqual(true);

    expect(mockLoadFn).toHaveBeenCalledTimes(3);
    expect(mockLoadFn.mock.calls[0]).toEqual([0]);

    expect(result.current.loading).toEqual(true);
    /* Test that returning the first async call does not set loading to false
    as it is still waiting for the final call */
    act(() => {
      r[0]();
    });
    await waitForNextUpdate();
    expect(result.current.loading).toEqual(true);
    expect(result.current.response).toEqual(null);

    /* Test that returning the third async call sets loading to false and returns the results */
    act(() => {
      r[2]();
    });
    await waitForNextUpdate();
    expect(result.current.response).toEqual(demoData[2]);
    expect(result.current.loading).toEqual(false);

    /* Test that returning the second after the third does not change the state */
    act(() => {
      r[1]();
    });
    // // await waitForNextUpdate();
    expect(result.current.response).toEqual(demoData[2]);
    expect(result.current.loading).toEqual(false);

    // /* Reloading the function clears everything back to the loading state */
    act(() => {
      result.current.reload([0]);
    });
    await waitForNextUpdate();
    expect(result.current.loading).toEqual(true);
    expect(result.current.response).toEqual(null);
  });

  test('should return error message if failed', async () => {
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => {
      throw Error();
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: true, callFn: mockLoadFn })
    );
    expect(result.current.loading).toEqual(true);
    expect(mockLoadFn).toHaveBeenCalledWith('products', 'filter');

    await waitForNextUpdate();

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(null);
    expect(result.current.error).toEqual(new Error('Failed to load'));
  });
  test('should update call count', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: true, callFn: mockLoadFn })
    );
    expect(result.current.callCount).toEqual(0);
    expect(result.current.loading).toEqual(true);
    expect(mockLoadFn).toHaveBeenCalledTimes(1);
    expect(mockLoadFn).toHaveBeenCalledWith('products', 'filter');

    await waitForNextUpdate();

    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData);
    expect(result.current.error).toEqual(undefined);
    expect(result.current.callCount).toEqual(1);
    act(() => {
      result.current.reload([0]);
    });
    await waitForNextUpdate();
    expect(result.current.callCount).toEqual(2);
  });
  test('should call callback on load complete', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const callback = jest.fn();
    const { waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({
        args,
        callOnInit: true,
        callFn: mockLoadFn,
        callback,
      })
    );
    expect(callback).not.toHaveBeenCalledWith(demoData);
    await waitForNextUpdate();
    expect(callback).toHaveBeenCalledWith(demoData, args);
  });
});

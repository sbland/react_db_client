import React from 'react';
import { useAsyncRequest } from './use-async-request';

const sleep = (delay) =>
  new Promise((res) => {
    setTimeout(function () {
      res();
    }, delay);
  });

const callFn = async () => {
  await sleep(100);
  alert('hello');
  return { message: 'world' };
};

export const BasicdemoHook = () => {
  const { loading, response, error, reload } = useAsyncRequest({
    args: [],
    callOnInit: false,
    callFn,
  });

  return (
    <>
      <h1>Output </h1>
      {loading ? 'Loading' : 'Not loading'}
      <button onClick={() => reload()}>Call</button>
      <p>{response?.message}</p>
    </>
  );
};

export const DynamicCallFn = () => {
  const callFnA = async () => {
    await sleep(100);
    alert('hello');
    return { message: 'world' };
  };
  const { loading, response, error, reload } = useAsyncRequest({
    args: [],
    callOnInit: false,
    callFn: callFnA,
  });

  return (
    <>
      <h1>Output </h1>
      {loading ? 'Loading' : 'Not loading'}
      <button onClick={() => reload()}>Call</button>
      <p>{response?.message}</p>
    </>
  );
};

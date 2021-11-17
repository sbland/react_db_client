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
  return { hello: 'world' };
};
export const BasicdemoHook = () => {
  const {
    loading,
    response,
    error,
    reload,
  } = useAsyncRequest({
    args: [],
    callOnInit: false,
    callFn,
  });

  return (
    <>
      <h1>Output </h1>
      {loading ? 'Loading' : 'Not loading'}
      <button onClick={() => reload()}>Call</button>
    </>
  );
};


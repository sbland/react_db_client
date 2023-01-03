import React from 'react';
import { screen } from '@testing-library/react';
import { useAsyncRequest } from './use-async-request';

const sleep = (delay) =>
  new Promise((res: (value?: any) => void) => {
    setTimeout(function () {
      res();
    }, delay);
  });

interface IResponse {
  message: string;
}

type ArgsType = [arg1: string];

const callFn = async (arg1: string) => {
  await sleep(100);
  return { message: arg1 } as IResponse;
};

export const BasicdemoHook = () => {
  const { loading, response, error, reload } = useAsyncRequest<IResponse, ArgsType>({
    args: ['world'],
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

export const LoadOnMount = () => {
  const callCount = React.useRef(0);

  const callFn = async (arg1: string) => {
    await sleep(100);
    callCount.current += 1;
    return { message: arg1 } as IResponse;
  };

  const { loading, response, error, reload } = useAsyncRequest<IResponse, ArgsType>({
    args: ['world'],
    callOnInit: true,
    callFn,
  });

  return (
    <>
      <h1>Output </h1>
      {loading ? 'Loading' : 'Not loading'}
      <button onClick={() => reload()}>Call</button>
      <button onClick={() => reload(['sun'])}>Call override</button>
      <p>{response?.message}</p>
      <p>Call count: {callCount.current}</p>
    </>
  );
};

LoadOnMount.waitForReady = async () => {
  await screen.findByText('world');
  await screen.findByText('Call count: 1');
};



export const LoadOnMountNoArgs = () => {
  const callCount = React.useRef(0);

  const callFn = async (arg1?: string) => {
    await sleep(100);
    callCount.current += 1;
    return { message: arg1 || "world" } as IResponse;
  };

  const { loading, response, error, reload } = useAsyncRequest<IResponse, ArgsType>({
    callOnInit: true,
    callFn,
  });

  return (
    <>
      <h1>Output </h1>
      {loading ? 'Loading' : 'Not loading'}
      <button onClick={() => reload()}>Call</button>
      <button onClick={() => reload(['sun'])}>Call override</button>
      <p>{response?.message}</p>
      <p>Call count: {callCount.current}</p>
    </>
  );
};

LoadOnMountNoArgs.waitForReady = async () => {
  await screen.findByText('world');
  await screen.findByText('Call count: 1');
};

export const DynamicCallFn = () => {
  const callFnA = async (arg1: string) => {
    await sleep(100);
    alert('hello');
    return { message: arg1 };
  };

  const { loading, response, error, reload } = useAsyncRequest<IResponse, ArgsType>({
    args: ['world'],
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

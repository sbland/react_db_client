import React from 'react';
import { useDebounce } from './use-debounce';

const sleep = (delay) =>
  new Promise<void>((res) => {
    setTimeout(function () {
      res();
    }, delay);
  });

export const DebounceDemo = () => {
  const [saveCount, setSaveCount] = React.useState(0);
  const saveData = async (amount) => {
    console.info('saving');
    await sleep(200);
    setSaveCount((prev) => prev + amount);
  };

  const saveDataDeBounced = useDebounce({
    timeout: 1000,
    fn: saveData,
    allow: true,
  });

  return (
    <>
      <p>SaveCount: {saveCount}</p>
      <button onClick={() => saveDataDeBounced(1)}>SaveA1</button>
      <button onClick={() => saveDataDeBounced(10)}>SaveB10</button>
      <button onClick={() => setSaveCount(0)}>reset</button>
    </>
  );
};

export const DebounceDemoTextInput = () => {
  const [savedText, setSavedText] = React.useState('');
  const saveData = async (value) => {
    console.info('saving');
    await sleep(200);
    setSavedText(value);
  };

  const saveDataDeBounced = useDebounce({
    timeout: 1000,
    fn: saveData,
    allow: true,
  });

  return (
    <>
      <p>Saved Text: {savedText}</p>
      <input onChange={(e) => saveDataDeBounced(e.target.value)} />
      <button onClick={() => setSavedText('')}>reset</button>
    </>
  );
};

export const ExampleUseDebounceHookUsage = () => {
  const [state, setState] = React.useState(0);
  const [called, setCalled] = React.useState(false);
  const exampleFn = async (a: number) => {
    setCalled(true);
    setState((prev) => prev + a);
  };
  const call = useDebounce({ fn: exampleFn, timeout: 100 });
  return (
    <div>
      <button onClick={() => call(1)}>Click</button>
      <p data-testid="callcount">
        callCount: <span>{state}</span>
      </p>
      <p data-testid="hasBeenCalled">
        called: <span>{called ? 'Called' : 'Not Called'}</span>
      </p>
    </div>
  );
};

ExampleUseDebounceHookUsage.waitForReady = async () => {};

export const ExampleUseDebounceHookUsageCatchError = () => {
  const [error, setError] = React.useState<null | Error>(null);
  const [called, setCalled] = React.useState(false);
  const exampleFn = async (a: number) => {
    setCalled(true);
    throw new Error('Example error');
  };
  const call = useDebounce({
    fn: exampleFn,
    timeout: 100,
    errorCallback: (e) => setError(e),
  });
  return (
    <div>
      <button onClick={() => call(1)}>Click</button>
      <p data-testid="hasBeenCalled">
        called: <span>{called ? 'Has Called' : 'Not Called'}</span>
      </p>
      <p data-testid="errorMessage">
        error: <span>{String(error)}</span>
      </p>
    </div>
  );
};

ExampleUseDebounceHookUsageCatchError.waitForReady = async () => {};

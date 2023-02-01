import React from 'react';
import { screen } from '@testing-library/react';
import { useAsyncAuthHook } from './use-async-auth-hook';

const exampleFn = async (a: string, b: string, token: string) => {
  return `${a}_${b}_${token}`;
};

const AuthContext = React.createContext({ token: 'TOKEN' });

export const BasicUseAsyncAuthHook = () => {
  const [hasCalled, setHasCalled] = React.useState('false');
  const { state, callAuthorized } = useAsyncAuthHook({
    fn: exampleFn,
    AuthContext,
    callback: (a, b) => setHasCalled(`${a}_${b}`),
  });
  React.useEffect(() => {
    callAuthorized('Hello', 'world');
  }, []);
  return (
    <div>
      <p>
        Value: <span>{state.value}</span>
      </p>
      <p>
        Has Called: <span>{hasCalled}</span>
      </p>
    </div>
  );
};

BasicUseAsyncAuthHook.waitForReady = async () => {
  await screen.findByText(`Hello_world_TOKEN`);
  await screen.findByText(`Hello_world`);
};

import React from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { AsyncState } from 'react-use/lib/useAsyncFn';

type Wrap<T> = { [K in keyof T]-?: [T[K]] };
type Unwrap<T> = { [K in keyof T]: Extract<T[K], [any]>[0] };

type InitialParameters<F extends (...args: any) => any> = Wrap<
  Parameters<F>
> extends [...infer InitPs, any]
  ? Unwrap<InitPs>
  : never;

export interface IMinAuthContect {
  token: string;
}

export interface IUseAuthFnArgs<FnType extends (...args: any) => Promise<any>> {
  callback?: (...args: InitialParameters<FnType>) => void;
  fn: FnType;
  AuthContext: React.Context<IMinAuthContect>;
}
export declare type PromiseType<P extends Promise<any>> = P extends Promise<
  infer T
>
  ? T
  : never;
export interface IUseAuthFnReturn<
  FnType extends (...args: any) => Promise<any>
> {
  callAuthorized: (...args: InitialParameters<FnType>) => void;
  submitting: boolean;
  error?: Error;
  state: AsyncState<PromiseType<ReturnType<FnType>>>;
}

export const useAsyncAuthHook = <FnType extends (...args: any) => any>({
  callback,
  fn,
  AuthContext,
}: IUseAuthFnArgs<FnType>): IUseAuthFnReturn<FnType> => {
  const { token } = React.useContext(AuthContext);
  const [state, call] = useAsyncFn(fn);

  const callAuthorized = (...args: InitialParameters<FnType>) => {
    const fullArgs = [...args, token];
    call(...fullArgs).then(() => {
      if (callback) callback(...args);
    });
  };

  return {
    callAuthorized,
    submitting: state.loading,
    error: state.error,
    state,
  } as const;
};

export const Example = () => {};

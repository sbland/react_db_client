// TODO: Move to serparate component
/** Adapted from https://github.com/streamich/react-use/blob/master/src/useAsyncFn.ts */
import { DependencyList, useCallback, useRef, useState } from "react";
import useMountedState from "react-use/lib/useMountedState";
import { FunctionReturningPromise, PromiseType } from "react-use/lib/misc/types";

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> = AsyncState<PromiseType<ReturnType<T>>>;

type ResetStateFn = () => void;

export type AsyncFnReturn<T extends FunctionReturningPromise = FunctionReturningPromise> = [
  StateFromFunctionReturningPromise<T>,
  T,
  ResetStateFn
];

export default function useAsyncFnReset<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = { loading: false }
): AsyncFnReturn<T> {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] = useState<StateFromFunctionReturningPromise<T>>(initialState);

  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const callId = ++lastCallId.current;

    if (!state.loading) {
      set((prevState) => ({ ...prevState, loading: true }));
    }

    return fn(...args).then(
      (value) => {
        isMounted() && callId === lastCallId.current && set({ value, loading: false });

        return value;
      },
      (error) => {
        isMounted() && callId === lastCallId.current && set({ error, loading: false });

        return error;
      }
    ) as ReturnType<T>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const resetState = useCallback(() => {
    set(initialState);
  }, [initialState]);

  return [state, callback as unknown as T, resetState];
}

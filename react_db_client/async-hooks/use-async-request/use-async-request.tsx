/* eslint-disable import/prefer-default-export */
/* A react hook async request */

import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AsyncRequestError } from './error-handling';

const ENV = process.env.NODE_ENV;

const demoCallFn = async () => 'DEMO RESPONSE';

export type ICallback<ResponseType, Args> = (response: ResponseType, args: Args) => any;
export type ICallFn<Args extends Array<any>> = (...args: Args) => Promise<any>;

export interface IUseAsyncRequestProps<ResponseType, Args extends Array<any>> {
  id?: string;
  args?: Args | null;
  callFn: ICallFn<Args>;
  cleanupFunc?: () => void;
  callOnInit?: boolean;
  debug?: boolean;
  callback?: ICallback<ResponseType, Args>;
  errorCallback?: (AsyncRequestError) => void;
  reloadKey?: any;
}

export interface IFnArgs<ResponseType, Args> {
  args: Args;
  callback: ICallback<ResponseType, Args>;
}

export interface IResultState {
  isLoading: boolean;
  latestLoadingId: number;
  resultsData?: any;
  hasLoaded: boolean;
  error?: AsyncRequestError;
  callCount: number;
}

export interface IUseAsyncRequestReturn<ResponseType, Args> {
  resultState: IResultState;
  response?: ResponseType;
  reload: (Args?: Args, callback?: ICallback<ResponseType, Args>) => void;
  call: (Args?: Args, callback?: ICallback<ResponseType, Args>) => void;
  loading: boolean;
  hasLoaded: boolean;
  error?: AsyncRequestError;
  callCount: number;
}

export const EmptyArgs: any[] = [];

/**
 * Async React request hook
 *
 * @param {Object} {
 *   - args {Array} - the arguments to be passed to the callFn,
 *   - callFn {function} - the async function to call
 *   - cleanupFunc {function} - function to clean up the async call
 *   - callOnInit {bool}(true) - if true then will call the function on component mount
 *   - callback {function} - function to call when async call returns (response, args) => {}
 * }
 * @return {Object} {
 *   - response {any} - the response from the async call
 *   - reload {function} - function to recall the call function
 *   - call {function} - same as reload
 *   - loading {bool} - true when callfn has been called but not yet returned
 *   - hasLoaded {bool} - true after the callFn has been ran at least once
 *   - error {string} - error returned by callfn
 * }
 */
export const useAsyncRequest = <ResponseType, Args extends Array<any>>({
  id,
  args: argsInitial, // TODO: Rename to defaultArgs
  callFn,
  cleanupFunc = () => null,
  callOnInit = true,
  debug = false,
  //callback = (response: ResponseType, args: Args) => null as any
  callback: callbackIn,
  errorCallback: errorCallbackIn,
  reloadKey,
}: IUseAsyncRequestProps<ResponseType, Args>): IUseAsyncRequestReturn<ResponseType, Args> => {
  // const [latestCallId, setLatestCallId] = useState(0);
  const [resultState, setResultState] = useState<IResultState>({
    isLoading: false,
    latestLoadingId: 0,
    resultsData: null,
    hasLoaded: false,
    error: undefined,
    callCount: 0,
  });
  const [args, setArgs] = useState<Args>(argsInitial || (EmptyArgs as Args));

  const [callback, setCallback] = useState<null | ICallback<ResponseType, Args>>(() => callbackIn);

  const [allowLoad, setAllowLoad] = useState(callOnInit);
  const [forceLoad, setForceLoad] = useState(true);

  useEffect(() => {
    setCallback(() => callbackIn);
  }, [callbackIn]);

  const reload = useCallback(
    (argsUpdated?: Args, callbackOverride?: ICallback<ResponseType, Args>) => {
      setArgs((prev) => argsUpdated || prev);
      setCallback((prev) => callbackOverride || prev);
      setAllowLoad(true);
      setForceLoad(true);
    },
    []
  );

  useEffect(() => {
    setForceLoad(true);
  }, [reloadKey]);

  // Call callback in use effect
  useEffect(() => {
    if (forceLoad && allowLoad) {
      setForceLoad(false);
      setResultState((prev) => ({
        ...prev,
        isLoading: true,
        latestLoadingId: prev.latestLoadingId + 1,
        resultsData: null,
        error: undefined,
      }));
      const newCallId = resultState.latestLoadingId + 1;
      if (!callFn) throw Error('Missing call fn');
      try {
        callFn
          .apply(null, args || [])
          .then((responseData) => {
            setResultState((prev) => {
              // check we are only returning the data from the most recent call
              if (prev.latestLoadingId === newCallId) {
                return {
                  ...prev,
                  isLoading: false,
                  // TODO: reseting latest loading id could result in the first call being accepted
                  latestLoadingId: 0, // reset latest loading id
                  resultsData: responseData,
                  hasLoaded: true,
                  callCount: prev.callCount + 1,
                };
              }
              return prev;
            });
            if (callback) callback(responseData, args);
            setArgs(() => argsInitial || (EmptyArgs as Args));
            setCallback(() => callbackIn);
          })
          .catch((e) => {
            if (ENV === 'development' || debug) {
              console.log(e);
            }
            setResultState((prev) => {
              if (prev.latestLoadingId === newCallId) {
                return {
                  ...prev,
                  isLoading: false,
                  // TODO: reseting latest loading id could result in the first call being accepted
                  latestLoadingId: 0,
                  resultsData: null,
                  hasLoaded: true,
                  error: new AsyncRequestError('Failed to load'),
                };
              }
              return prev;
            });
            // TODO: This filtering should be performed outside this component!
            const errorMessage = e.name === 'ApiError' ? e.message : 'Unknown Error';
            if (errorCallbackIn) errorCallbackIn(new AsyncRequestError(errorMessage, e));
          });
      } catch (error) {
        console.error(`Async Call function failed: ${id || callFn.name}`);
        throw error;
      }
    }
    return cleanupFunc;
  }, [
    forceLoad,
    allowLoad,
    args,
    callback,
    resultState,
    callFn,
    cleanupFunc,
    debug,
    argsInitial,
    callbackIn,
    errorCallbackIn,
  ]);

  return {
    resultState,
    response: resultState.resultsData,
    reload,
    call: reload,
    loading: resultState.isLoading,
    hasLoaded: resultState.hasLoaded,
    error: resultState.error,
    callCount: resultState.callCount,
  };
};

useAsyncRequest.propTypes = {
  args: PropTypes.arrayOf(PropTypes.any),
  callFn: PropTypes.func.isRequired, // async
  cleanupFunc: PropTypes.func,
  callOnInit: PropTypes.bool,
  debug: PropTypes.bool,
  callback: PropTypes.func,
};

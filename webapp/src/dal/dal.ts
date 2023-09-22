import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { checkShouldCache } from '@utils/helpers';

export interface ConfigInfo {
  dalFunction: any;
  reduxObjectPath?: string;
}

interface useGetDataHookProps<T> {
  params?: T;
  configInfo: ConfigInfo;
  cacheOption?: boolean;
  start?: boolean;
}

export function useGetDataHook<T>({
  params,
  configInfo,
  cacheOption = true,
  start,
}: useGetDataHookProps<T>) {
  const reduxDataReturn = useSelector(
    (state: any) => state[configInfo.reduxObjectPath!]
  );

  const { lastFetch } = reduxDataReturn;

  const dispatch = useDispatch();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const shouldCache = checkShouldCache({
    cacheOption: cacheOption,
    lastFetch: lastFetch,
  });

  useEffect(() => {
    if (start !== false) {
      if (typeof configInfo.dalFunction === 'function') {
        configInfo.dalFunction({
          params: params,
          dispatch,
          shouldCache,
          onSuccess: (data: any) => {
            setData(data);
          },
          onError: (error: any) => {
            setError(error);
          },
          reduxDataReturn: structuredClone(reduxDataReturn),
        });
      }
    }
  }, [start, reduxDataReturn]);

  return { data, error };
}

export async function useSetData<T>({
  onSuccess,
  onError,
  params,
  configInfo,
  dispatch,
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  params?: any;
  configInfo?: any;
  dispatch?: any;
}) {
  const clonedParams: T | undefined = structuredClone(params);

  if (typeof configInfo.dalFunction === 'function') {
    await configInfo.dalFunction({
      params: clonedParams,
      dispatch,
      onSuccess: onSuccess,
      onError: onError,
    });
  }
}

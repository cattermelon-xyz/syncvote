import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

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
  const reduxVar = useSelector(
    (state: any) => state[configInfo.reduxObjectPath!]
  );

  const clonedParams: T | undefined = structuredClone(params);
  const dispatch = useDispatch();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const now = new Date().getTime();

  useEffect(() => {
    if (start !== false) {
      if (typeof configInfo.dalFunction === 'function') {
        configInfo.dalFunction({
          params: clonedParams,
          cacheOption,
          dispatch,
          now,
          onSuccess: (data: any) => {
            setData(data);
          },
          onError: (error: any) => {
            setError(error);
          },
          reduxVar,
        });
      }
    }
  }, [start]);

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

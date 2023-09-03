import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

export interface ConfigInfo {
  getterFunction: any;
  reduxObjectPath: string;
}

interface UseGetDataHookProps<T> {
  params?: T;
  configInfo: ConfigInfo;
  cacheOption?: boolean;
  start?: boolean;
}

export function useGetDataHook<T>({
  params,
  configInfo,
  cacheOption,
  start,
}: UseGetDataHookProps<T>) {
  const reduxVar = useSelector(
    (state: any) => state[configInfo.reduxObjectPath]
  );

  const clonedParams: T | undefined = structuredClone(params);
  const dispatch = useDispatch();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const now = new Date().getTime();
  useEffect(() => {
    if (start !== false) {
      if (typeof configInfo.getterFunction === 'function') {
        configInfo.getterFunction({
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

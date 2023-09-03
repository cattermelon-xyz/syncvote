import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabaseClient';
import { Session } from '@supabase/gotrue-js';

interface UseGetDataHookProps<T> {
  params?: T;
  configInfo: {
    getterFunction: any;
    reduxObjectPath: string;
  };
  cacheOption: boolean;
}

export async function useGetDataHook<T>({
  params,
  configInfo,
  cacheOption,
}: UseGetDataHookProps<T>) {
  const reduxVar = useSelector(
    (state: any) => state[configInfo.reduxObjectPath]
  );
  const clonedParams: T | undefined = structuredClone(params);
  const dispatch = useDispatch();
  let [data, setData] = useState<any[]>([]);
  let [error, setError] = useState<any>(null);
  const now = new Date().getTime();

  useEffect(() => {
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
  }, []);

  return { data, error };
}

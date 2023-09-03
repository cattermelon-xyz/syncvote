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
  needSession?: boolean;
}

export async function useGetDataHook<T>({
  params,
  configInfo,
  cacheOption,
  needSession,
}: UseGetDataHookProps<T>) {
  const reduxVar = useSelector(
    (state: any) => state[configInfo.reduxObjectPath]
  );
  const clonedParams: T | undefined = structuredClone(params);
  const dispatch = useDispatch();
  let [data, setData] = useState<any[]>([]);
  let [error, setError] = useState<any>(null);
  const now = new Date().getTime();
  const [session, setSession] = useState<Session | null>(null);

  let props: any;

  if (needSession) {
    props = {
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
      session,
    };
  } else {
    props = {
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
    };
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
      setSession(_session);
    });

    if (typeof configInfo.getterFunction === 'function') {
      configInfo.getterFunction(props);
    }
  }, [session]);

  return { data, error };
}

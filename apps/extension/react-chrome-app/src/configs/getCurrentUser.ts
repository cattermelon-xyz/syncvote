import { supabase } from './supabaseClient';
import { chromeStorageKeys } from '@constants/chrome';

export async function getCurrentUser(): Promise<null | {
  user: any;
  accessToken: string;
}> {
  const gauthAccessToken = (
    await chrome.storage.sync.get(chromeStorageKeys.gauthAccessToken)
  )[chromeStorageKeys.gauthAccessToken];
  const gauthRefreshToken = (
    await chrome.storage.sync.get(chromeStorageKeys.gauthRefreshToken)
  )[chromeStorageKeys.gauthRefreshToken];
  
  if (gauthAccessToken && gauthRefreshToken) {
    try {
      // set user session from access_token and refresh_token
      const resp = await supabase.auth.setSession({
        access_token: gauthAccessToken,
        refresh_token: gauthRefreshToken,
      });

      const user = resp.data?.user;
      const supabaseAccessToken = resp.data.session?.access_token;

      if (user && supabaseAccessToken) {
        return { user, accessToken: supabaseAccessToken };
      }
    } catch (e: any) {
      console.error('Error: ', e);
    }
  }

  return null;
}

import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { supabase } from '@utils/supabaseClient';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const inviteUserByEmail = async ({
  email, dispatch, onSuccess, onError = (e:any) => { console.error(e); },
}: {
  email: string,
  dispatch: any,
  onSuccess: (data:any) => void,
  onError?: (error:any) => void,
}) => {
  dispatch(startLoading({}));
  // TODO: email validate!
  // TODO: move this to the edge function
  try {
    const url = 'https://uafmqopjujmosmilsefw.supabase.co/functions/v1/invite-user-email';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${supabaseAnonKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });
    const result = await response.json();
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
  dispatch(finishLoading({}));
};
export const queryUserByEmail = async ({
  email, dispatch, onSuccess, onError = (e:any) => { console.error(e); },
}: {
  email: string,
  dispatch: any,
  onSuccess: (data:any) => void,
  onError?: (error:any) => void,
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('profile').select('id, email, full_name').eq('email', email);
  if (error) {
    onError(error);
  } else {
    onSuccess(data);
  }
};

export const addMemberToOrg = async ({
  data, dispatch, onSuccess, onError = (e:any) => { console.error(e); },
}: {
  data: any,
  dispatch: any,
  onSuccess: (data:any) => void,
  onError?: (error:any) => void,
}) => {
  const { email } = data;
  dispatch(startLoading({}));
  dispatch(finishLoading({}));
};

export const inviteExistingMember = async ({
  data, dispatch, onSuccess, onError = (e:any) => { console.error(e); },
}: {
  data: any,
  dispatch: any,
  onSuccess: (data:any) => void,
  onError?: (error:any) => void,
}) => {
  const { to_email, inviter, full_name, org_title } = data; //eslint-disable-line
  dispatch(startLoading({}));
  try {
    const url = 'https://uafmqopjujmosmilsefw.supabase.co/functions/v1/send-email';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${supabaseAnonKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        to_email, inviter, full_name, org_title,
      }),
    });
    const result = await response.json();
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
  dispatch(finishLoading({}));
};

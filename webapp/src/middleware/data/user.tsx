import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { supabase } from '@utils/supabaseClient';
import { addUserToOrg, setUser } from '@redux/reducers/orginfo.reducer';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const inviteUserByEmail = async ({
  email,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  email: string;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  dispatch(startLoading({}));
  // TODO: email validate!
  // TODO: move this to the edge function
  try {
    const url =
      'https://uafmqopjujmosmilsefw.supabase.co/functions/v1/invite-user-email';
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
    if (result.status === 200) {
      onSuccess(result);
    } else {
      onError(new Error('Cannot invite user'));
    }
  } catch (error) {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const queryUserByEmail = async ({
  email,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  email: string;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('profile')
    .select('id, email, full_name')
    .eq('email', email);
  if (error) {
    onError(error);
  } else {
    onSuccess(data);
  }
};

export const queryUserById = async ({
  userId,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  userId: string;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('profile')
    .select('id, email, full_name, icon_url,preset_icon_url, about_me')
    .eq('id', userId);
  if (error) {
    onError(error);
  } else {
    const profileInfo = data[0];
    const presetIcon = profileInfo?.preset_icon_url
      ? `preset:${profileInfo.preset_icon_url}`
      : profileInfo.preset_icon_url;
    onSuccess(data);
    dispatch(
      setUser({
        id: profileInfo.id,
        email: profileInfo.email,
        full_name: profileInfo.full_name,
        avatar_url: profileInfo.icon_url ? profileInfo.icon_url : presetIcon,
        about_me: profileInfo.about_me,
      })
    );
    dispatch(finishLoading({}));
  }
};

export const updateUserProfile = async ({
  userProfile,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  userProfile: any;
  dispatch: any;
  onSuccess: () => void;
  onError?: (error: any) => void;
}) => {
  const newUserProfile = { ...userProfile };
  dispatch(startLoading({}));
  const props = [
    'id',
    'email',
    'full_name',
    'icon_url',
    'preset_icon_url',
    'about_me',
  ];
  Object.keys(newUserProfile).forEach((key) => {
    if (props.indexOf(key) === -1) {
      delete newUserProfile[key];
    }
  });
  if (newUserProfile.icon_url?.indexOf('preset:') === 0) {
    newUserProfile.preset_icon_url = newUserProfile.icon_url.replace(
      'preset:',
      ''
    );
    newUserProfile.icon_url = '';
  }
  console.log('debug1');
  const { error } = await supabase
    .from('profile')
    .update(newUserProfile)
    .eq('id', newUserProfile.id);
  if (!error) {
    console.log('debug2');
    onSuccess();
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const addMemberToOrg = async ({
  userOrgInfo,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  userOrgInfo: any;
  dispatch: any;
  onSuccess: () => void;
  onError?: (error: any) => void;
}) => {
  dispatch(startLoading({}));
  const { user_id, org_id, email, full_name, role } = userOrgInfo;
  const infoMemberSupabase = {
    org_id: org_id,
    user_id: user_id,
    role: role,
  };
  const { data, error } = await supabase
    .from('user_org')
    .insert(infoMemberSupabase);
  if (error) {
    onError(error);
  } else {
    console.log('data user', data);

    const infoMember = {
      id: user_id,
      email: email,
      full_name: full_name,
      avatar_url: '',
    };
    dispatch(addUserToOrg({ orgId: org_id, user: infoMember }));
    onSuccess();
  }
  dispatch(finishLoading({}));
};

export const inviteExistingMember = async ({
  data,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  data: any;
  dispatch: any;
  onSuccess: () => void;
  onError?: (error: any) => void;
}) => {
  const { to_email, inviter, full_name, org_title, org_id, id_user } = data; //eslint-disable-line
  dispatch(startLoading({}));
  try {
    const url =
      'https://uafmqopjujmosmilsefw.supabase.co/functions/v1/send-email';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${supabaseAnonKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        to_email,
        inviter,
        full_name,
        org_title,
      }),
    });
    const result = await response.json();
    if (result) {
      const userOrgInfo = {
        org_id: org_id,
        user_id: id_user,
        role: 'MEMBER',
        email: to_email,
        full_name: full_name,
      };
      await addMemberToOrg({ userOrgInfo, dispatch, onSuccess, onError });
    } else {
      onError(new Error('Cannot invite user'));
    }
  } catch (error) {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const isEmailExisted = async ({ email }: { email: string }) => {
  const rs = await supabase
    .from('profile')
    .select('*', { count: 'exact', head: true })
    .eq('email', email);
  if (rs.error || rs.status !== 200) {
    return false;
  } else {
    return rs.count;
  }
};

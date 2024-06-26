import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { supabase } from 'utils';
import {
  setUser,
  addUserToOrg,
  setLastFetch,
} from '@dal/redux/reducers/orginfo.reducer';
import { addMemberToOrg } from './org';
import { deepEqual } from '@utils/helpers';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export class UserFunctionClass {
  async queryUserById({
    params,
    dispatch,
    shouldCache,
    onSuccess,
    onError,
    reduxDataReturn,
  }: {
    params?: any;
    dispatch: any;
    shouldCache: boolean;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    reduxDataReturn: any;
  }) {
    let userId;
    if (params) {
      userId = params.userId;
    } else {
      const session = (await supabase.auth.getSession()).data.session;
      if (session) {
        userId = session.user.id;
      } else {
        onError('Session is null');
      }
    }

    const { user } = reduxDataReturn;
    if (shouldCache) {
      onSuccess(user);
    } else {
      dispatch(startLoading({}));
      const { data, error } = await supabase
        .from('profile')
        .select('id, email, full_name, icon_url,preset_icon_url, about_me')
        .eq('id', userId);
      dispatch(finishLoading({}));
      if (error) {
        onError(error);
      } else {
        const profileInfo = data[0];
        const presetIcon = profileInfo?.preset_icon_url
          ? `preset:${profileInfo.preset_icon_url}`
          : profileInfo.preset_icon_url;

        const userDataAfterHandle = {
          id: profileInfo.id,
          email: profileInfo.email,
          full_name: profileInfo.full_name,
          avatar_url: profileInfo.icon_url ? profileInfo.icon_url : presetIcon,
          about_me: profileInfo.about_me,
        };

        if (deepEqual(user, userDataAfterHandle)) {
          onSuccess(user);
        } else {
          onSuccess(userDataAfterHandle);
          dispatch(setUser(userDataAfterHandle));
          dispatch(setLastFetch({}));
        }
      }
    }
  }

  async updateUserProfile({
    params,
    dispatch,
    onSuccess = () => {},
    onError = (e: any) => {
      console.error(e);
    },
  }: {
    params: any;
    dispatch: any;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) {
    const { userProfile } = params;

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
    const { data, error } = await supabase
      .from('profile')
      .update(newUserProfile)
      .eq('id', newUserProfile.id)
      .select('id, email, full_name, icon_url,preset_icon_url, about_me');

    if (!error) {
      onSuccess();
      const profileInfo = data[0];
      const presetIcon = profileInfo?.preset_icon_url
        ? `preset:${profileInfo.preset_icon_url}`
        : profileInfo.preset_icon_url;

      const userDataAfterHandle = {
        id: profileInfo.id,
        email: profileInfo.email,
        full_name: profileInfo.full_name,
        avatar_url: profileInfo.icon_url ? profileInfo.icon_url : presetIcon,
        about_me: profileInfo.about_me,
      };

      dispatch(setUser(userDataAfterHandle));
    } else {
      onError(error);
    }
    dispatch(finishLoading({}));
  }

  async queryUserByEmail({
    params,
    dispatch,
    onSuccess,
    onError = (e: any) => {
      console.error(e);
    },
  }: {
    params: { email: string };
    dispatch: any;
    onSuccess: (data: any) => void;
    onError?: (error: any) => void;
  }) {
    const { email } = params;
    // dispatch(startLoading({}));
    const { data, error } = await supabase
      .from('profile')
      .select('id, email, full_name, icon_url, preset_icon_url')
      .eq('email', email);
    if (error) {
      onError(error);
    } else {
      onSuccess(data);
    }
  }

  async inviteExistingMember({
    params,
    dispatch,
    onSuccess,
    onError = (e: any) => {
      console.error(e);
    },
  }: {
    params: { data: any };
    dispatch: any;
    onSuccess: () => void;
    onError?: (error: any) => void;
  }) {
    const { data } = params;

    const {
      to_email,
      inviter,
      full_name,
      org_title,
      org_id,
      id_user,
      avatar_url,
    } = data; //eslint-disable-line
    // dispatch(startLoading({}));
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
          avatar_url: avatar_url,
        };
        await addMemberToOrg({ userOrgInfo, dispatch, onSuccess, onError });
      } else {
        onError(new Error('Cannot invite user'));
      }
    } catch (error) {
      onError(error);
    }
    // dispatch(finishLoading({}));
  }

  async inviteUserByEmail({
    params,
    dispatch,
    onSuccess,
    onError = (e: any) => {
      console.error(e);
    },
  }: {
    params: { email: string; orgId: number };
    dispatch: any;
    onSuccess: (data: any) => void;
    onError?: (error: any) => void;
  }) {
    // dispatch(startLoading({}));
    // TODO: email validate!
    // TODO: move this to the edge function
    const { email, orgId } = params;

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
          orgId,
          env: import.meta.env.VITE_ENV,
        }),
      });
      const result = await response.json();

      if (result.user) {
        const infoMember = {
          id: result.user.id,
          email: email,
          full_name: null,
          avatar_url: null,
          role: 'MEMBER',
          confirm_email_at: null,
        };
        dispatch(addUserToOrg({ orgId: orgId, user: infoMember }));
        onSuccess(result);
      } else {
        onError(new Error('Cannot invite user'));
      }
    } catch (error) {
      onError(error);
    }
    // dispatch(finishLoading({}));
  }
}

export const inviteUserByEmail = async ({
  email,
  orgId,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  email: string;
  orgId: number;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  // dispatch(startLoading({}));
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
        orgId,
        env: import.meta.env.VITE_ENV,
      }),
    });
    const result = await response.json();

    if (result.user) {
      const infoMember = {
        id: result.user.id,
        email: email,
        full_name: null,
        avatar_url: null,
        role: 'MEMBER',
        confirm_email_at: null,
      };
      dispatch(addUserToOrg({ orgId: orgId, user: infoMember }));
      onSuccess(result);
    } else {
      onError(new Error('Cannot invite user'));
    }
  } catch (error) {
    onError(error);
  }
  // dispatch(finishLoading({}));
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
  // dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('profile')
    .select('id, email, full_name, icon_url, preset_icon_url')
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
  const { error } = await supabase
    .from('profile')
    .update(newUserProfile)
    .eq('id', newUserProfile.id);
  if (!error) {
    onSuccess();
    dispatch(setUser(newUserProfile));
  } else {
    onError(error);
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
  const {
    to_email,
    inviter,
    full_name,
    org_title,
    org_id,
    id_user,
    avatar_url,
  } = data; //eslint-disable-line
  // dispatch(startLoading({}));
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
        avatar_url: avatar_url,
      };
      await addMemberToOrg({ userOrgInfo, dispatch, onSuccess, onError });
    } else {
      onError(new Error('Cannot invite user'));
    }
  } catch (error) {
    onError(error);
  }
  // dispatch(finishLoading({}));
};

export const isEmailExisted = async ({ email }: { email: string }) => {
  const rs = await supabase
    .from('profile')
    .select('*', { count: 'exact', head: false })
    .eq('email', email);
  if (rs.error || rs.status !== 200) {
    return { existed: false, userId: null };
  } else {
    return { existed: rs.count, userId: rs.data[0]?.id };
  }
};

export const changePassword = async ({
  password,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  password: string;
  dispatch?: any;
  onSuccess?: (() => void) | undefined;
  onError?: (error: any) => void;
}) => {
  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) {
    onError(error);
  } else if (onSuccess) {
    onSuccess();
  }
};

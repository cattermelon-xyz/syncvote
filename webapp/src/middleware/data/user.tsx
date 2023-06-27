import { finishLoading, startLoading } from "@redux/reducers/ui.reducer";
import { supabase } from "@utils/supabaseClient";
import { addUserToOrg } from "@redux/reducers/orginfo.reducer";

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
      "https://uafmqopjujmosmilsefw.supabase.co/functions/v1/invite-user-email";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${supabaseAnonKey}`,
        "content-type": "application/json",
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
    .from("profile")
    .select("id, email, full_name")
    .eq("email", email);
  if (error) {
    onError(error);
  } else {
    onSuccess(data);
  }
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
    .from("user_org")
    .insert(infoMemberSupabase);
  if (error) {
    onError(error);
  } else {
    const infoMember = {
      id: user_id,
      email: email,
      full_name: full_name,
      avatar_url: "",
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
      "https://uafmqopjujmosmilsefw.supabase.co/functions/v1/send-email";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${supabaseAnonKey}`,
        "content-type": "application/json",
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
        role: "MEMBER",
        email: to_email,
        full_name: full_name,
      };
      await addMemberToOrg({ userOrgInfo, dispatch, onSuccess, onError });
    } else {
      onError(new Error("Cannot invite user"));
    }
  } catch (error) {
    onError(error);
  }
  dispatch(finishLoading({}));
};

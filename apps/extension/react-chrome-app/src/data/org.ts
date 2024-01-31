import { supabase } from '@configs/supabaseClient';

export const queryOrgs = async ({
  params,
  onSuccess,
  onError,
}: {
  params?: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  const { userId } = params;

  const { data, error } = await supabase
    .from('user_org')
    .select(
      `
        role,
        org (
          id,
          title,
          desc,
          icon_url,
          banner_url,
          preset_icon_url,
          preset_banner_url,
          org_size,
          org_type,
          last_updated,
          user_org(
            role,
            profile (
              id,
              email,
              full_name,
              icon_url,
              preset_icon_url,
              confirm_email_at
            )
          ),
          workflows:workflow (
            id,
            title,
            owner_org_id,
            icon_url,
            banner_url,
            preset_icon_url,
            preset_banner_url,
            desc,
            versions: workflow_version(
              id, 
              data,
              preview_image_url,
              status,
              created_at,
              last_updated
            )
          )
        )
      `
    )
    .eq('user_id', userId);

  if (!error) {
    const tmp: any[] = [];
    data.forEach((d: any) => {
      const org: any = d?.org || {
        id: '',
        title: '',
        desc: '',
      };
      const presetIcon = org?.preset_icon_url
        ? `preset:${org.preset_icon_url}`
        : org.preset_icon_url;
      const presetBanner = org?.preset_banner_url
        ? `preset:${org.preset_banner_url}`
        : org.preset_banner_url;

      const profiles =
        org.user_org?.map((user: any) => {
          const presetIconProfile = user.profile?.preset_icon_url
            ? `preset:${user.profile.preset_icon_url}`
            : user.profile.preset_icon_url;

          return {
            id: user.profile.id,
            email: user.profile.email,
            full_name: user.profile.full_name,
            avatar_url: user.profile.icon_url
              ? user.profile.icon_url
              : presetIconProfile,
            about_me: user.profile.about_me,
            role: user.role,
            confirm_email_at: user.profile.confirm_email_at,
          };
        }) || [];

      profiles.sort((a: any, b: any) => {
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') {
          return -1;
        } else if (b.role === 'ADMIN' && a.role !== 'ADMIN') {
          return 1;
        } else {
          return 0;
        }
      });

      const workflows = org?.workflows?.map((workflow: any) => {
        const workflowPresetIcon = workflow?.preset_icon_url
          ? `preset:${workflow.preset_icon_url}`
          : workflow.preset_icon_url;
        const workflowPresetBanner = workflow?.preset_banner_url
          ? `preset:${workflow.preset_banner_url}`
          : workflow.preset_banner_url;

        return {
          ...workflow,
          icon_url: workflow.icon_url ? workflow.icon_url : workflowPresetIcon,
          banner_url: workflow.banner_url
            ? workflow.banner_url
            : workflowPresetBanner,
        };
      });

      tmp.push({
        id: org?.id,
        role: d.role,
        title: org?.title,
        desc: org.desc,
        icon_url: org.icon_url ? org.icon_url : presetIcon,
        banner_url: org.banner_url ? org.banner_url : presetBanner,
        org_size: org.org_size,
        org_type: org.org_type,
        profile: profiles,
        last_updated: org.last_updated,
        workflows: workflows || [],
      });
    });
    onSuccess(tmp);
  } else {
    onError(error);
  }
};

export const queryDemo = async ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  const { data, error } = await supabase.from('demo_missions').select('*');

  if (!error) {
    onSuccess(data);
  } else {
    onError(error);
  }
};

export const createProposalDemo = async ({
  title,
  onSuccess,
  onError,
}: {
  title: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('demo_missions')
    .insert({ title: title, status: 'idea_discussion' })
    .select('*');

  if (!error) {
    onSuccess(data[0]);
  } else {
    onError(error);
  }
};

export const updateProposalDemo = async ({
  demoProposalId,
  status,
  onSuccess,
  onError,
}: {
  demoProposalId: number;
  status: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('demo_missions')
    .update({ status: status })
    .eq('id', demoProposalId)
    .select('*');

  if (!error) {
    onSuccess(data[0]);
  } else {
    onError(error);
  }
};

export const updateTallyLink = async ({
  demoProposalId,
  linkTally,
  onSuccess,
  onError,
}: {
  demoProposalId: number;
  linkTally: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('demo_missions')
    .update({ tally_id: linkTally })
    .eq('id', demoProposalId)
    .select('*');

  if (!error) {
    onSuccess(data[0]);
  } else {
    onError(error);
  }
};

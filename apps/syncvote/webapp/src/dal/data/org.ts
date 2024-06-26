import { supabase } from 'utils';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import {
  changeOrgInfo,
  setOrgsInfo,
  setLastFetch,
  addUserToOrg,
  removeUserOfOrg,
  deleteOrgInfo,
} from '@dal/redux/reducers/orginfo.reducer';
import { deepEqual } from '@utils/helpers';
import { ITag } from '@types';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export class OrgFunctionClass {
  async queryOrgs({
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

    const { orgs } = reduxDataReturn;

    if (shouldCache) {
      onSuccess(orgs);
    } else {
      dispatch(startLoading({}));
      // TODO: add email in table profile, use ref in profile to select user
      // TODO: query list of user
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
            versions: workflow_version(
              id, 
              data,
              preview_image_url,
              status,
              created_at,
              last_updated
            )
          ),
          templates:template (
            id,
            title,
            desc,
            owner_org_id,
            icon_url,
            banner_url,
            status,
            created_at,
            current_version_id,
            tag_template ( tag (*))
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
              icon_url: workflow.icon_url
                ? workflow.icon_url
                : workflowPresetIcon,
              banner_url: workflow.banner_url
                ? workflow.banner_url
                : workflowPresetBanner,
            };
          });

          const templates = org?.templates.map((template: any) => {
            const tags: ITag[] = [];
            template.tag_template.map((itm: any) => {
              tags.push({
                value: itm.tag.id,
                label: itm.tag.label,
              });
            });
            delete template.tag_template;
            template.tags = [...tags];
            return {
              ...template,
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
            templates: templates || [],
          });
        });

        if (deepEqual(orgs, tmp)) {
          onSuccess(orgs);
        } else {
          dispatch(setOrgsInfo(tmp));
          dispatch(setLastFetch({}));
          onSuccess(tmp);
        }
      } else {
        onError(error);
      }
      dispatch(finishLoading({}));
    }
  }

  async deleteOrg({
    params,
    dispatch,
    onSuccess,
    onError = () => {},
  }: {
    params: { orgId: number };
    dispatch: any;
    onSuccess: () => void;
    onError?: (data: any) => void;
  }) {
    const { orgId } = params;
    const { error } = await supabase.from('org').delete().eq('id', orgId);
    const { data, error: errorQuery } = await supabase
      .from('org')
      .select('id')
      .eq('id', orgId);

    if (error || data?.length != 0) {
      onError(error);
    } else {
      dispatch(deleteOrgInfo({ id: orgId }));
      onSuccess();
    }
  }

  async removeMemberOfOrg({
    params,
    dispatch,
    onSuccess,
    onError = (e: any) => {
      console.error(e);
    },
  }: {
    params: { orgId: number; userId: string };
    dispatch: any;
    onSuccess: () => void;
    onError?: (error: any) => void;
  }) {
    const { orgId, userId } = params;
    const { error } = await supabase
      .from('user_org')
      .delete()
      .eq('org_id', orgId)
      .eq('user_id', userId);
    if (error) {
      onError(error);
    } else {
      dispatch(removeUserOfOrg({ orgId: orgId, userId: userId }));
      onSuccess();
    }
  }

  async upsertAnOrg({
    params,
    onSuccess,
    onError = (error) => {
      console.error(error); // eslint-disable-line
    },
    dispatch,
  }: {
    params: { org: any };
    onSuccess: (data: any) => void;
    onError?: (data: any) => void;
    dispatch: any;
  }) {
    const { org } = params;
    const newOrg = { ...org };
    dispatch(startLoading({}));
    const props = [
      'id',
      'title',
      'desc',
      'org_size',
      'org_type',
      'icon_url',
      'banner_url',
      'preset_icon_url',
      'preset_banner_url',
    ];

    Object.keys(newOrg).forEach((key) => {
      if (props.indexOf(key) === -1) {
        delete newOrg[key];
      }
    });
    if (newOrg.id < 0) {
      // invalid id, probably a new mission
      delete newOrg.id;
    }
    if (newOrg.icon_url?.indexOf('preset:') === 0) {
      newOrg.preset_icon_url = newOrg.icon_url.replace('preset:', '');
      newOrg.icon_url = '';
    }
    if (newOrg.banner_url?.indexOf('preset:') === 0) {
      newOrg.preset_banner_url = newOrg.banner_url.replace('preset:', '');
      newOrg.banner_url = '';
    }
    const { data, error } = await supabase.from('org').upsert(newOrg).select();
    dispatch(finishLoading({}));
    if (data) {
      const newData = [...data];
      data.forEach((d: any, index: number) => {
        newData[index].icon_url = d.preset_icon_url
          ? `preset:${d.preset_icon_url}`
          : d.icon_url;
        newData[index].banner_url = d.preset_banner_url
          ? `preset:${d.preset_banner_url}`
          : d.banner_url;
        delete newData[index].preset_icon_url;
        delete newData[index].preset_banner_url;
      });
      dispatch(changeOrgInfo(newData[0]));
      dispatch(setLastFetch({}));
      onSuccess(newData);
    } else if (error) {
      onError(error);
    }
  }

  async newOrg({
    params,
    onSuccess = () => {},
    onError = () => {},
    dispatch,
  }: {
    params: {
      orgInfo: {
        title: string;
        desc?: string;
        icon_url: string;
        org_size?: string;
        org_type?: string;
        preset_banner_url?: string;
      };
      uid: string;
    };
    onSuccess?: (data: any) => void;
    onError?: (data: any) => void;
    dispatch: any;
  }) {
    const { orgInfo, uid } = params;
    dispatch(startLoading({}));

    try {
      const url =
        'https://uafmqopjujmosmilsefw.supabase.co/functions/v1/new-org';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${supabaseAnonKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          orgInfo,
          uid,
        }),
      });
      const result = await response.json();
      if (result) {
        const data = result[0];
        const info = structuredClone(orgInfo);
        dispatch(
          changeOrgInfo({
            id: data.id,
            role: 'ADMIN',
            ...info,
          })
        );
        dispatch(setLastFetch({}));
        onSuccess(data);
      } else {
        onError(new Error("Can't create organization"));
      }
    } catch (error) {
      onError(error);
    }
    dispatch(finishLoading({}));
  }

  async querySearchOrgForExplore ({
    params,
    onSuccess,
    onError = (error) => {
      console.error(error); // eslint-disable-line
    },
    dispatch,
  }: {
    params: { inputSearch: string };
    onSuccess: (data: any) => void;
    onError?: (data: any) => void;
    dispatch: any;
  }){
    dispatch(startLoading({}));
    const { inputSearch } = params;
    const { data, error } = await supabase
      .from('org')
      .select(
        `
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
            versions: workflow_version(
              id, 
              data,
              preview_image_url,
              status,
              created_at,
              last_updated
            )
          ),
          templates:template (
            id,
            title,
            desc,
            owner_org_id,
            icon_url,
            banner_url,
            status,
            created_at,
            current_version_id,
            tag_template ( tag (*))
          )
      `
      )
      .textSearch('title', `'${inputSearch}'`);
  
    if (!error) {
      const tmp: any[] = [];
      data.forEach((d: any) => {
        const org: any = d || {
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
  
        const templates = org?.templates.map((template: any) => {
          const tags: ITag[] = [];
          template.tag_template.map((itm: any) => {
            tags.push({
              value: itm.tag.id,
              label: itm.tag.label,
            });
          });
          delete template.tag_template;
          template.tags = [...tags];
          return {
            ...template,
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
          templates: templates || [],
        });
      });
      dispatch(setLastFetch({}));
      onSuccess(tmp);
    } else {
      onError(error);
    }
    dispatch(finishLoading({}));
  };
}

export const queryOrgByIdForExplore = async ({
  orgId,
  onSuccess,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
}: {
  orgId: number;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('org')
    .select(
      `
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
          versions: workflow_version(
            id, 
            data,
            preview_image_url,
            status,
            created_at,
            last_updated
          )
        ),
        templates:template (
          id,
          title,
          desc,
          owner_org_id,
          icon_url,
          banner_url,
          status,
          created_at,
          current_version_id,
          tag_template ( tag (*))
        )
    `
    )
    .eq('id', orgId);
  if (!error) {
    const tmp: any[] = [];
    data.forEach((d: any) => {
      const org: any = d || {
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

      const templates = org?.templates.map((template: any) => {
        const tags: ITag[] = [];
        template.tag_template.map((itm: any) => {
          tags.push({
            value: itm.tag.id,
            label: itm.tag.label,
          });
        });
        delete template.tag_template;
        template.tags = [...tags];
        return {
          ...template,
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
        templates: templates || [],
      });
    });
    dispatch(setLastFetch({}));
    onSuccess(tmp);
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const queryOrgByRange = async ({
  from,
  to,
  onSuccess,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
}: {
  from: number;
  to: number;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));

  const { data, error } = await supabase
    .from('org')
    .select('*')
    .range(from, to);

  if (!error) {
    const orgsAfterHandle: any[] = [];

    data.forEach((org: any) => {
      const presetIcon = org?.preset_icon_url
        ? `preset:${org.preset_icon_url}`
        : org.preset_icon_url;
      const presetBanner = org?.preset_banner_url
        ? `preset:${org.preset_banner_url}`
        : org.preset_banner_url;

      orgsAfterHandle.push({
        id: org.id,
        created_at: org.created_at,
        title: org.title,
        icon_url: org.icon_url ? org.icon_url : presetIcon,
        banner_url: org.banner_url ? org.banner_url : presetBanner,
        desc: org.desc,
        last_updated: org.last_updated,
      });
    });

    onSuccess(orgsAfterHandle);
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const newOrg = async ({
  orgInfo,
  uid,
  onSuccess,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
}: {
  orgInfo: {
    title: string;
    desc?: string;
    icon_url: string;
    org_size?: string;
    org_type?: string;
    preset_banner_url?: string;
  };
  uid: string;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  try {
    const url = 'https://uafmqopjujmosmilsefw.supabase.co/functions/v1/new-org';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${supabaseAnonKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        orgInfo,
        uid,
      }),
    });
    const result = await response.json();
    if (result) {
      const data = result[0];
      const info = structuredClone(orgInfo);
      dispatch(
        changeOrgInfo({
          id: data.id,
          role: 'ADMIN',
          ...info,
        })
      );
      dispatch(setLastFetch({}));
      onSuccess(data);
    } else {
      onError(new Error("Can't create organization"));
    }
  } catch (error) {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const upsertAnOrg = async ({
  org,
  onLoad,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
}: {
  org: any;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  const newOrg = { ...org };
  dispatch(startLoading({}));
  const props = [
    'id',
    'title',
    'desc',
    'org_size',
    'org_type',
    'icon_url',
    'banner_url',
    'preset_icon_url',
    'preset_banner_url',
  ];

  Object.keys(newOrg).forEach((key) => {
    if (props.indexOf(key) === -1) {
      delete newOrg[key];
    }
  });
  if (newOrg.id < 0) {
    // invalid id, probably a new mission
    delete newOrg.id;
  }
  if (newOrg.icon_url?.indexOf('preset:') === 0) {
    newOrg.preset_icon_url = newOrg.icon_url.replace('preset:', '');
    newOrg.icon_url = '';
  }
  if (newOrg.banner_url?.indexOf('preset:') === 0) {
    newOrg.preset_banner_url = newOrg.banner_url.replace('preset:', '');
    newOrg.banner_url = '';
  }
  const { data, error } = await supabase.from('org').upsert(newOrg).select();
  dispatch(finishLoading({}));
  if (data) {
    const newData = [...data];
    data.forEach((d: any, index: number) => {
      newData[index].icon_url = d.preset_icon_url
        ? `preset:${d.preset_icon_url}`
        : d.icon_url;
      newData[index].banner_url = d.preset_banner_url
        ? `preset:${d.preset_banner_url}`
        : d.banner_url;
      delete newData[index].preset_icon_url;
      delete newData[index].preset_banner_url;
    });
    dispatch(changeOrgInfo(newData[0]));
    dispatch(setLastFetch({}));
    onLoad(newData);
  } else if (error) {
    onError(error);
  }
};

export const getDataOrgs = async ({
  userId,
  dispatch,
  onSuccess,
  onError = (error) => {
    console.error(error);
  },
}: {
  userId: any;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('user_org')
    .select(
      `
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
      created_at,
      workflows:workflow (
        id,
        title,
        owner_org_id,
        icon_url,
        banner_url,
        preset_icon_url,
        preset_banner_url,
        versions: workflow_version(
          id,
          data, 
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
        title: org?.title,
        desc: org.desc,
        icon_url: org.icon_url ? org.icon_url : presetIcon,
        banner_url: org.banner_url ? org.banner_url : presetBanner,
        org_size: org.org_size,
        org_type: org.org_type,
        created_at: org.created_at,
        workflows: workflows || [],
      });
    });
    data.sort((a: any, b: any) => {
      const a_time = new Date(a.created_at).getTime();
      const b_time = new Date(b.created_at).getTime();
      return b_time - a_time;
    });
    // dispatch(setOrgsInfo(tmp));
    dispatch(setLastFetch({}));
    onSuccess(tmp);
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const queryOrgs = async ({
  filter,
  onSuccess,
  onError = (error) => {
    console.error(error);
  },
  dispatch,
}: {
  filter: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  const { userId } = filter;
  dispatch(startLoading({}));
  // TODO: add email in table profile, use ref in profile to select user
  // TODO: query list of user
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
        versions: workflow_version(
          id, 
          data,
          preview_image_url,
          status,
          created_at,
          last_updated
        )
      ),
      templates:template (
        id,
        title,
        desc,
        owner_org_id,
        icon_url,
        banner_url,
        status,
        created_at,
        current_version_id
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
        templates: org.templates || [],
      });
    });
    dispatch(setOrgsInfo(tmp));
    dispatch(setLastFetch({}));
    onSuccess(tmp);
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const queryOrgsAndWorkflowForHome = async ({
  userId,
  onSuccess,
  onError = (error) => {
    console.error(error);
  },
  dispatch,
}: {
  userId: number;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
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
        created_at,
        workflows:workflow (
          id,
          title,
          owner_org_id,
          icon_url,
          banner_url,
          preset_icon_url,
          preset_banner_url,
          versions: workflow_version(
            id, 
            status,
            created_at,
            last_updated
          )
        )
      )
    `
    )
    .eq('user_id', userId);
  const tmp: any[] = [];
  if (!error) {
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
        created_at: org.created_at,
        workflows: workflows,
      });
    });
    onSuccess(tmp);
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
  return tmp;
};

export const queryOrgByOrgId = async ({
  orgId,
  onSuccess,
  onError = (error) => {
    console.error(error);
  },
  dispatch,
}: {
  orgId: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  // TODO: add email in table profile, use ref in profile to select user
  // TODO: query list of user
  const { data, error } = await supabase
    .from('org')
    .select(`*`)
    .eq('id', orgId);
  if (!error) {
    const tmp: any[] = [];
    data.forEach((org: any) => {
      const presetIcon = org?.preset_icon_url
        ? `preset:${org.preset_icon_url}`
        : org.preset_icon_url;
      const presetBanner = org?.preset_banner_url
        ? `preset:${org.preset_banner_url}`
        : org.preset_banner_url;
      tmp.push({
        id: org?.id,
        title: org?.title,
        desc: org.desc,
        icon_url: org.icon_url ? org.icon_url : presetIcon,
        banner_url: org.banner_url ? org.banner_url : presetBanner,
        org_size: org.org_size,
        org_type: org.org_type,
        profile: org.profile || [],
      });
    });
    // dispatch(setOrgsInfo(tmp));
    dispatch(setLastFetch({}));
    onSuccess(data);
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
  const { user_id, org_id, email, full_name, role, avatar_url } = userOrgInfo;
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
    const infoMember = {
      id: user_id,
      email: email,
      full_name: full_name,
      avatar_url: avatar_url,
      role: role,
    };
    dispatch(addUserToOrg({ orgId: org_id, user: infoMember }));
    onSuccess();
  }
  dispatch(finishLoading({}));
};

export const removeMemberOfOrg = async ({
  orgId,
  userId,
  dispatch,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  orgId: number;
  userId: string;
  dispatch: any;
  onSuccess: () => void;
  onError?: (error: any) => void;
}) => {
  const { error } = await supabase
    .from('user_org')
    .delete()
    .eq('org_id', orgId)
    .eq('user_id', userId);
  if (error) {
    onError(error);
  } else {
    dispatch(removeUserOfOrg({ orgId: orgId, userId: userId }));
    onSuccess();
  }
};

export const deleteOrg = async ({
  orgId,
  dispatch,
  onSuccess,
  onError = () => {},
}: {
  orgId: number;
  dispatch: any;
  onSuccess: () => void;
  onError?: (data: any) => void;
}) => {
  const { error } = await supabase.from('org').delete().eq('id', orgId);
  const { data, error: errorQuery } = await supabase
    .from('org')
    .select('id')
    .eq('id', orgId);

  if (error || data?.length != 0) {
    onError(error);
  } else {
    dispatch(deleteOrgInfo({ id: orgId }));
    onSuccess();
  }
};
export async function  queryAllOrgs({
  dispatch,
  onSuccess,
  onError = (error) => {
    console.log(error);
  },
}: {
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}) {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('org')
    .select(`id,
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
      versions: workflow_version(
        id, 
        data,
        preview_image_url,
        status,
        created_at,
        last_updated
      )
    ),
    templates:template (
      id,
      title,
      desc,
      owner_org_id,
      icon_url,
      banner_url,
      status,
      created_at,
      current_version_id,
      tag_template ( tag (*))
    )`)

  if (error) {
    onError(error);
  } else {
    if (data) {
      onSuccess(data);
    }
  }

  dispatch(finishLoading({}));
}
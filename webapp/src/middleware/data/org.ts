import { supabase } from '@utils/supabaseClient';
import {
  finishLoading, startLoading,
} from '@redux/reducers/ui.reducer';
import {
  changeOrgInfo, setOrgsInfo, setLastFetch,
} from '@redux/reducers/orginfo.reducer';

export const newOrg = async ({
  orgInfo, onSuccess, onError = (error) => {
    console.error(error); // eslint-disable-line
  }, dispatch,
}: {
  orgInfo: {
    title: string;
    desc: string;
    icon_url: string;
    org_size: string;
    org_type: string;
    preset_banner_url: string;
  };
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  const { data, error } = await supabase.from('org')
    .insert(orgInfo).select();
  if (error) {
    onError(error);
  } else {
    const info = structuredClone(orgInfo);
    dispatch(changeOrgInfo({
      id: data[0].id,
      role: 'ADMIN',
      ...info,
    }));
    dispatch(setLastFetch({}));
    onSuccess(data);
  }
};
export const upsertAnOrg = async ({
  org, onLoad, onError = (error) => {
    console.error(error); // eslint-disable-line
  }, dispatch,
  }:{
    org: any;
    onLoad: (data: any) => void;
    onError?: (data: any) => void;
    dispatch: any;
  }) => {
  const newOrg = { ...org };
  dispatch(startLoading({}));
  const props = ['id', 'title', 'desc', 'org_size', 'org_type', 'icon_url', 'banner_url', 'preset_icon_url', 'preset_banner_url'];
  Object.keys(newOrg).forEach((key) => {
    if (props.indexOf(key) === -1) {
      delete newOrg[key];
    }
  });
  if (newOrg.id < 0) { // invalid id, probably a new mission
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
    data.forEach((d: any, index:number) => {
      newData[index].icon_url = d.preset_icon_url ? `preset:${d.preset_icon_url}` : d.icon_url;
      newData[index].banner_url = d.preset_banner_url ? `preset:${d.preset_banner_url}` : d.banner_url;
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
export const queryOrgs = async ({
  filter, onSuccess, onError = (error) => {
    console.error(error);
  }, dispatch,
}:
{
  filter: any, onSuccess: (data: any) => void,
  onError?: (data: any) => void, dispatch: any
}) => {
  const { userId } = filter;
  dispatch(startLoading({}));
  // TODO: add email in table profile, use ref in profile to select user
  // TODO: query list of user
  const { data, error } = await supabase.from('user_org')
  .select(`
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
      profile (
        id,
        email,
        full_name,
        avatar_url
      )
    )
  `).eq('user_id', userId);
  if (!error) {
    const tmp:any[] = [];
      data.forEach((d:any) => {
        const org:any = d?.org || {
          id: '', title: '', desc: '',
        };
        const presetIcon = org?.preset_icon_url ? `preset:${org.preset_icon_url}` : org.preset_icon_url;
        const presetBanner = org?.preset_banner_url ? `preset:${org.preset_banner_url}` : org.preset_banner_url;
        tmp.push({
          id: org?.id,
          role: d.role,
          title: org?.title,
          desc: org.desc,
          icon_url: org.icon_url ? org.icon_url : presetIcon,
          banner_url: org.banner_url ? org.banner_url : presetBanner,
          org_size: org.org_size,
          org_type: org.org_type,
          profile: org.profile || [],
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

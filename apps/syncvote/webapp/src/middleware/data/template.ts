import {
  addTemplateToOrg,
  changeTemplateInfo,
  deleteTemplateFromOrg,
} from '@redux/reducers/orginfo.reducer';
import {
  addTemplate,
  changeTemplate,
  setTemplates,
  deleteTemplate as rmTemplateFromRedux,
} from '@redux/reducers/template.reducer';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { supabase } from 'utils';

export const upsertTemplate = async ({
  dispatch,
  templateId,
  orgId,
  title,
  desc,
  iconUrl,
  bannerUrl,
  status,
  workflowVersionId,
}: {
  dispatch: any;
  templateId?: number;
  orgId?: number;
  title?: string;
  desc?: string;
  iconUrl?: string;
  bannerUrl?: string;
  status?: boolean;
  workflowVersionId?: number;
}) => {
  dispatch(startLoading({}));
  let errorMsg = '';
  if (templateId !== -1) {
    const toUpdate: any = {};
    title ? (toUpdate.title = title) : null;
    desc ? (toUpdate.desc = desc) : null;
    iconUrl ? (toUpdate.icon_url = iconUrl) : null;
    bannerUrl ? (toUpdate.banner_url = bannerUrl) : null;
    status !== undefined ? (toUpdate.status = status) : null;
    const { data, error } = await supabase
      .from('template')
      .update(toUpdate)
      .eq('id', templateId)
      .select('*');
    dispatch(finishLoading({}));
    const toUpdateRedux = {
      id: templateId,
      owner_org_id: orgId,
      ...toUpdate,
    };
    dispatch(changeTemplateInfo(toUpdateRedux));
    dispatch(changeTemplate(toUpdateRedux));
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('template')
      .insert({
        owner_org_id: orgId,
        title,
        desc,
        icon_url: iconUrl,
        banner_url: bannerUrl,
      })
      .select('id');
    if (data) {
      const templateId: number = data[0].id;
      const { data: wversion, error: err } = await supabase
        .from('workflow_version')
        .select('data')
        .eq('id', workflowVersionId);
      if (!err) {
        const { data: tversion, error: terror } = await supabase
          .from('template_version')
          .insert({
            template_id: templateId,
            data: wversion[0].data,
          })
          .select('id');
        if (tversion) {
          const { error: updateTemplateError } = await supabase
            .from('template')
            .update({ current_version_id: tversion[0].id })
            .eq('id', templateId);
          const newTemplate = {
            id: templateId,
            current_version_id: tversion[0].id,
            title,
            desc,
            icon_url: iconUrl,
            banner_url: bannerUrl,
            owner_org_id: orgId,
          };
          if (updateTemplateError) {
            errorMsg = 'Cannot update template current_version_id';
          } else {
            dispatch(finishLoading({}));
            dispatch(addTemplate(newTemplate));
            dispatch(addTemplateToOrg(newTemplate));
            return {
              data: newTemplate,
              error: undefined,
            };
          }
        } else if (terror) {
          errorMsg =
            'Cannot copy data from workflow_version to template_version';
        }
      } else {
        errorMsg = 'Cannot select data from workflow_version';
      }
    } else {
      errorMsg = 'Cannot insert template';
    }
    dispatch(finishLoading({}));
    return { data: undefined, error: errorMsg };
  }
  return { data: undefined, error: 'Cannot upsert template' };
};
export const deleteTemplate = async ({
  dispatch,
  templateId,
  orgId,
}: {
  dispatch: any;
  templateId: number;
  orgId: number;
}) => {
  dispatch(startLoading({}));
  await supabase.from('template').delete().eq('id', templateId);
  const tmpl = { id: templateId, owner_org_id: orgId };
  dispatch(deleteTemplateFromOrg(tmpl));
  dispatch(rmTemplateFromRedux(tmpl));
  dispatch(finishLoading({}));
};
export const queryTemplate = async ({ dispatch }: { dispatch: any }) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('template').select('*');
  if (!error) {
    dispatch(setTemplates(data));
  }
  dispatch(finishLoading({}));
};
export const queryATemplate = async ({
  dispatch,
  templateId,
}: {
  dispatch: any;
  templateId: number;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('template')
    .select('*')
    .eq('id', templateId);
  if (!error) {
    dispatch(addTemplate(data[0]));
  }
  dispatch(finishLoading({}));
  if (data) {
    return { data: data[0], error };
  } else {
    return { data: undefined, error };
  }
};
export const queryCurrentTemplateVersion = async ({
  dispatch,
  current_version_id,
}: {
  dispatch: any;
  current_version_id: number;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('template_version')
    .select('*')
    .eq('id', current_version_id);
  if (!error) {
    dispatch(finishLoading({}));
    return { data: data[0], error };
  }
  return { data: undefined, error };
};
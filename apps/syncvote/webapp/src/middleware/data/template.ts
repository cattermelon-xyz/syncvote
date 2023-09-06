import { addTemplateToOrg } from '@redux/reducers/orginfo.reducer';
import { addTemplate, setTemplate } from '@redux/reducers/template.reducer';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { supabase } from 'utils';

export const newTemplate = async ({
  dispatch,
  templateId,
  orgId,
  workflowId,
  title,
  desc,
  iconUrl,
  bannerUrl,
  workflowVersionId,
}: {
  dispatch: any;
  templateId: number | undefined;
  orgId: number | undefined;
  workflowId: number | undefined;
  title: string;
  desc: string;
  iconUrl: string | undefined;
  bannerUrl: string | undefined;
  workflowVersionId: number | undefined;
}) => {
  dispatch(startLoading({}));
  let errorMsg = '';
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
          org_owner_id: orgId,
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
        errorMsg = 'Cannot copy data from workflow_version to template_version';
      }
    } else {
      errorMsg = 'Cannot select data from workflow_version';
    }
  } else {
    errorMsg = 'Cannot insert template';
  }
  dispatch(finishLoading({}));
  return { data: undefined, error: errorMsg };
};

export const queryTemplate = async ({ dispatch }: { dispatch: any }) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('template').select('*');
  if (!error) {
    dispatch(setTemplate(data));
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

export const queryCurrentTempalateVersion = async ({
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

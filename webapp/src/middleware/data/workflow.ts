import {
  finishLoading, startLoading,
} from '@redux/reducers/ui.reducer';
import {
  setWorkflows, changeWorkflow, setLastFetch, changeWorkflowVersion,
} from '@redux/reducers/workflow.reducer';
import { supabase } from '@utils/supabaseClient';

export const upsertWorkflowVersion = async ({
  dispatch,
  workflowVersion,
  onSuccess,
  onError = (error:any) => { console.error(error); }, // es-lint-disable-line
  mode,
}: {
  workflowVersion: {
    versionId: number;
    workflowId: number,
    version: string,
    status: string,
    versionData: any,
    recommended: boolean,
  }
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  mode?: 'data' | 'info' | undefined,
}) => {
  dispatch(startLoading({}));
  const {
    versionId, workflowId, version, status, versionData, recommended,
  } = workflowVersion;
  const toUpsert:any = {
    id: versionId !== -1 ? versionId : undefined,
    workflow_id: workflowId,
  };
  if (!mode || mode === 'data') {
    toUpsert.data = versionData;
  }
  if (!mode || mode === 'info') {
    toUpsert.version = version;
    toUpsert.status = status;
    toUpsert.recommended = recommended;
  }
  const { data, error } = await supabase.from('workflow_version').upsert(toUpsert).select();
  dispatch(finishLoading({}));
  if (data) {
    dispatch(changeWorkflowVersion(data));
    onSuccess(data);
  } else {
    onError(error);
  }
};
export const queryWorkflow = async ({
  orgId, onLoad, onError = (error) => {
    console.error(error); // eslint-disable-line
  }, dispatch, filter = {}, // eslint-disable-line
}: {
  orgId: number;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
  filter?: any;
}) => {
  dispatch(startLoading({}));
  // TODO: should we stuff workflow_version into workflow?
  const { data, error } = await supabase.from('workflow').select('*, workflow_version ( * )').eq('owner_org_id', orgId).order('created_at', { ascending: false });
  dispatch(finishLoading({}));
  if (data) {
    const wfList = Array.isArray(data) ? data : [data];
    const newData:any[] = [];
    wfList.forEach((d:any, index: number) => {
      newData[index] = { ...structuredClone(d) };
      const presetIcon = d.preset_icon_url ? `preset:${d.preset_icon_url}` : d.icon_url;
      const presetBanner = d.preset_banner_url ? `preset:${d.preset_banner_url}` : d.bann_url;
      newData[index].icon_url = d.icon_url ? d.icon_url : presetIcon;
      newData[index].banner_url = d.banner_url ? d.banner_url : presetBanner;
      delete newData[index].preset_icon_url;
      delete newData[index].preset_banner_url;
      newData[index].workflow_version = [...newData[index].workflow_version] || [];
    });
    // TODO: is the data match the interface?
    dispatch(setWorkflows(newData));
    dispatch(setLastFetch({}));
    onLoad(newData);
  } else if (error) {
    onError(error);
  }
};
export const updateAWorkflowInfo = async ({
  info, dispatch, onSuccess, onError = () => {},
} : {
  info: any,
  dispatch: any,
  onSuccess: (data: any) => void,
  onError?: (data: any) => void,
}) => {
  dispatch(startLoading({}));
  const {
    id, title, desc, iconUrl,
  } = info;
  let icon_url, preset_icon_url; // eslint-disable-line
  if (iconUrl?.startsWith('preset:')) {
    preset_icon_url = iconUrl.replace('preset:', ''); // eslint-disable-line
  } else {
    icon_url = iconUrl; // eslint-disable-line
  }
  const toUpdate:any = {};
  if (title) toUpdate.title = title;
  if (desc) toUpdate.desc = desc;
  if (icon_url) toUpdate.icon_url = icon_url;
  if (preset_icon_url) toUpdate.preset_icon_url = preset_icon_url;
  const { data, error } = await supabase.from('workflow').update(toUpdate).eq('id', id).select('*');
  dispatch(finishLoading({}));
  if (data) {
    const newData = structuredClone(data);
    data.forEach((d:any, index: number) => {
      const presetIcon = d.preset_icon_url ? `preset:${d.preset_icon_url}` : d.icon_url;
      const presetBanner = d.preset_banner_url ? `preset:${d.preset_banner_url}` : d.banner_url;
      newData[index].icon_url = d.icon_url ? d.icon_url : presetIcon;
      newData[index].banner_url = d.banner_url ? d.banner_url : presetBanner;
      delete newData[index].preset_icon_url;
      delete newData[index].preset_banner_url;
    });
    dispatch(changeWorkflow(data[0]));
    onSuccess(data);
  } else {
    onError(error);
  }
};

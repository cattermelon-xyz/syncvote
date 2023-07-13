import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { ITag } from '@types';
import {
  setWorkflows,
  changeWorkflow,
  setLastFetch,
  changeWorkflowVersion,
} from '@redux/reducers/workflow.reducer';
import { IWorkflow } from '@types';
import { supabase } from '@utils/supabaseClient';
import { subtractArray } from '@utils/helpers';

export const upsertWorkflowVersion = async ({
  dispatch,
  workflowVersion,
  onSuccess,
  onError = (error: any) => {
    console.error(error);
  }, // es-lint-disable-line
  mode,
}: {
  workflowVersion: {
    versionId: number;
    workflowId: number;
    version?: string;
    status?: string;
    versionData?: any;
    recommended?: boolean;
  };
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  mode?: 'data' | 'info' | undefined;
}) => {
  dispatch(startLoading({}));
  const { versionId, workflowId, version, status, versionData, recommended } =
    workflowVersion;
  const toUpsert: any = {
    id: versionId !== -1 ? versionId : undefined,
    workflow_id: workflowId,
  };
  if (!mode || mode === 'data') {
    toUpsert.data = versionData;
  }
  if (!mode || mode === 'info') {
    version ? (toUpsert.version = version) : null;
    status ? (toUpsert.status = status) : null;
    recommended ? (toUpsert.recommended = recommended) : null;
  }
  const { data, error } = await supabase
    .from('workflow_version')
    .upsert(toUpsert)
    .select();
  if (data) {
    dispatch(changeWorkflowVersion(data[0]));
    onSuccess(data[0]);
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
};
export const queryWorkflow = async ({
  orgId,
  onLoad,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
  filter = {}, // eslint-disable-line
}: {
  orgId: number;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
  filter?: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('workflow')
    .select('*, workflow_version ( * ), tag_workflow ( tag (*))')
    .eq('owner_org_id', orgId)
    .order('created_at', { ascending: false });
  dispatch(finishLoading({}));
  if (data) {
    const wfList = Array.isArray(data) ? data : [data];
    const newData: any[] = [];
    wfList.forEach((d: any, index: number) => {
      newData[index] = { ...structuredClone(d) };
      const presetIcon =
        d.preset_icon_url && d.preset_icon_url !== ''
          ? `preset:${d.preset_icon_url}`
          : d.icon_url;
      const presetBanner =
        d.preset_banner_url && d.preset_banner_url !== ''
          ? `preset:${d.preset_banner_url}`
          : d.bann_url;
      newData[index].icon_url =
        d.icon_url && d.icon_url !== '' ? d.icon_url : presetIcon;
      newData[index].banner_url =
        d.banner_url && d.banner_url !== '' ? d.banner_url : presetBanner;
      delete newData[index].preset_icon_url;
      delete newData[index].preset_banner_url;
      newData[index].workflow_version =
        [...newData[index].workflow_version] || [];
      const tags: ITag[] = [];
      newData[index].tag_workflow.map((itm: any) => {
        tags.push({
          value: itm.tag.id,
          label: itm.tag.label,
        });
      });
      delete newData[index].tag_workflow;
      newData[index].tags = [...tags];
    });
    // TODO: is the data match the interface?
    dispatch(setWorkflows(newData));
    dispatch(setLastFetch({}));
    onLoad(newData);
  } else if (error) {
    onError(error);
  }
};

export const queryWorkflowVersion = async ({
  orgId,
  onLoad,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
  filter = {}, // eslint-disable-line
  versionId,
  workflowId,
}: {
  orgId: number;
  workflowId: any;
  versionId: any;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
  filter?: any;
}) => {
  dispatch(startLoading({}));
  // TODO: should we stuff workflow_version into workflow?
  const { data, error } = await supabase
    .from('workflow')
    .select('*, workflow_version ( * )')
    .eq('owner_org_id', orgId)
    .eq('id', workflowId)
    .eq('workflow_version.id', versionId)
    .order('created_at', { ascending: false });
  dispatch(finishLoading({}));
  if (data) {
    const wfList = Array.isArray(data) ? data : [data];
    const newData: any[] = [];
    wfList.forEach((d: any, index: number) => {
      newData[index] = { ...structuredClone(d) };
      const presetIcon = d.preset_icon_url
        ? `preset:${d.preset_icon_url}`
        : d.icon_url;
      const presetBanner = d.preset_banner_url
        ? `preset:${d.preset_banner_url}`
        : d.bann_url;
      newData[index].icon_url = d.icon_url ? d.icon_url : presetIcon;
      newData[index].banner_url = d.banner_url ? d.banner_url : presetBanner;
      delete newData[index].preset_icon_url;
      delete newData[index].preset_banner_url;
      newData[index].workflow_version =
        [...newData[index].workflow_version] || [];
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
  info,
  dispatch,
  onSuccess,
  onError = () => {},
}: {
  info: any;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  dispatch(startLoading({}));
  const { id, title, desc, iconUrl } = info;
  let icon_url, preset_icon_url; // eslint-disable-line
  if (iconUrl?.startsWith('preset:')) {
    preset_icon_url = iconUrl.replace('preset:', ''); // eslint-disable-line
    icon_url = '';
  } else {
    preset_icon_url = '';
    icon_url = iconUrl; // eslint-disable-line
  }
  const toUpdate: any = {};
  if (title) toUpdate.title = title;
  if (desc) toUpdate.desc = desc;
  if (icon_url !== undefined) toUpdate.icon_url = icon_url;
  if (preset_icon_url !== undefined) toUpdate.preset_icon_url = preset_icon_url;
  const { data, error } = await supabase
    .from('workflow')
    .update(toUpdate)
    .eq('id', id)
    .select('*');
  dispatch(finishLoading({}));
  if (data) {
    const newData = structuredClone(data);
    data.forEach((d: any, index: number) => {
      const presetIcon = d.preset_icon_url
        ? `preset:${d.preset_icon_url}`
        : d.icon_url;
      const presetBanner = d.preset_banner_url
        ? `preset:${d.preset_banner_url}`
        : d.banner_url;
      newData[index].icon_url = d.icon_url ? d.icon_url : presetIcon;
      newData[index].banner_url = d.banner_url ? d.banner_url : presetBanner;
      delete newData[index].preset_icon_url;
      delete newData[index].preset_banner_url;
    });
    dispatch(changeWorkflow(newData[0]));
    onSuccess(newData);
  } else {
    onError(error);
  }
};
export const updateAWorkflowTag = async ({
  workflow,
  newTags,
  dispatch,
  onSuccess,
  onError = () => {},
}: {
  workflow: IWorkflow;
  newTags: ITag[];
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  const oldSetOfTagIds = workflow.tags?.map((t) => t.value) || [];
  const toInsert = subtractArray({
    minuend: newTags.map((t) => t.value),
    subtrahend: oldSetOfTagIds,
  });
  const toDelete = subtractArray({
    minuend: oldSetOfTagIds,
    subtrahend: newTags.map((t) => t.value),
  });
  dispatch(startLoading({}));
  if (toInsert.length > 0) {
    const toInsertObjects = toInsert.map((tagId) => {
      return {
        workflow_id: workflow.id,
        tag_id: tagId,
      };
    });
    const { data, error } = await supabase
      .from('tag_workflow')
      .insert(toInsertObjects);
    if (!error) {
      dispatch(changeWorkflow({ ...workflow, tags: newTags }));
    } else {
      onError(error);
    }
  }
  if (toDelete.length > 0) {
    const { data, error } = await supabase
      .from('tag_workflow')
      .delete()
      .in('tag_id', toDelete)
      .eq('workflow_id', workflow.id);
    if (!error) {
      dispatch(changeWorkflow({ ...workflow, tags: newTags }));
    } else {
      onError(error);
    }
  }
  onSuccess({});
  dispatch(finishLoading({}));
};

export const deleteAWorkflow = async ({
  workflowId,
  dispatch,
  onSuccess,
  onError = () => {},
}: {
  workflowId: number;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  dispatch(startLoading({}));

  const { data, error } = await supabase
    .from('workflow_version')
    .delete()
    .eq('id', workflowId);

  dispatch(finishLoading({}));

  if (!error) {
    // dispatch(removeWorkflow(workflowId));
    onSuccess(data);
  } else if (error) {
    onError(error);
  }
};

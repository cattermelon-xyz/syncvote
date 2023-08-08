import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { ITag } from '@types';
import {
  setWorkflows,
  changeWorkflow,
  setLastFetch,
  changeWorkflowVersion,
  // deleteWorkflow,
  // deleteWorkflow,
  deleteWorkflowVersion,
} from '@redux/reducers/workflow.reducer';
import {
  changeWorkflowOrg,
  changeWorkflowInfo,
  deleteWorkflow,
  addWorkflowToOrg,
} from '@redux/reducers/orginfo.reducer';
import { IWorkflow } from '@types';
import { supabase } from '@utils/supabaseClient';
import { subtractArray } from '@utils/helpers';
import { log } from 'console';
import { version } from 'os';

export const insertWorkflowAndVersion = async ({
  dispatch,
  props,
  onError,
  onSuccess,
}: {
  dispatch: any;
  props: any;
  onError: (error: any) => void;
  onSuccess: (version: any, insertedId: any) => void;
}) => {
  dispatch(startLoading({}));
  const {
    title,
    desc,
    owner_org_id: orgId,
    emptyStage,
    iconUrl,
    authority: userId,
  } = props;

  let icon_url, preset_icon_url; // eslint-disable-line
  if (iconUrl.startsWith('preset:')) {
    preset_icon_url = iconUrl.replace('preset:', ''); // eslint-disable-line
  } else {
    icon_url = iconUrl; // eslint-disable-line
  }

  const { data, error } = await supabase
    .from('workflow')
    .insert({
      title,
      desc,
      icon_url,
      preset_icon_url,
      owner_org_id: orgId,
      authority: userId,
    })
    .select();

  if (data) {
    const insertedId = data[0].id;
    const toInsert = {
      workflow_id: insertedId,
      status: 'DRAFT',
      data: emptyStage,
    };
    const { data: versions, error: err } = await supabase
      .from('workflow_version')
      .insert(toInsert)
      .select();
    dispatch(finishLoading({}));
    dispatch(
      changeWorkflow({
        id: insertedId,
        title,
        desc,
        icon_url: iconUrl,
        banner_url: '',
        owner_org_id: orgId,
        workflow_version: !err ? versions : [],
      })
    );
    dispatch(finishLoading({}));

    if (!error && versions) {
      const image_name = `${data[0].id}_${versions[0].id}`;

      const { data: d, error: e } = await supabase
        .from('workflow_version')
        .update({
          preview_image_url: `https://uafmqopjujmosmilsefw.supabase.co/storage/v1/object/public/preview_image/${image_name}.jpg`,
        })
        .eq('id', versions[0].id)
        .select();

      onSuccess(versions, insertedId);
      dispatch(
        addWorkflowToOrg({
          workflow: {
            id: insertedId,
            title,
            desc,
            icon_url: iconUrl,
            banner_url: '',
            owner_org_id: orgId,
            workflow_version: versions,
            versions: versions,
          },
        })
      );
    }
  }
  if (error) {
    onError(error);
  }
};

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
    .select('*, workflow_version ( * ), profile(*)')
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
  const { id, title, desc, iconUrl, bannerUrl } = info;
  let icon_url, preset_icon_url; // eslint-disable-line
  let banner_url, preset_banner_url;
  if (iconUrl?.startsWith('preset:')) {
    preset_icon_url = iconUrl.replace('preset:', ''); // eslint-disable-line
    icon_url = '';
  } else {
    preset_icon_url = '';
    icon_url = iconUrl; // eslint-disable-line
  }
  if (bannerUrl?.startsWith('preset:')) {
    preset_banner_url = bannerUrl.replace('preset:', ''); // eslint-disable-line
    banner_url = '';
  } else {
    preset_banner_url = '';
    banner_url = bannerUrl; // eslint-disable-line
  }
  const toUpdate: any = {};
  if (title) toUpdate.title = title;
  if (desc) toUpdate.desc = desc;
  if (icon_url !== undefined) toUpdate.icon_url = icon_url;
  if (banner_url !== undefined) toUpdate.banner_url = banner_url;
  if (preset_icon_url !== undefined) toUpdate.preset_icon_url = preset_icon_url;
  if (preset_banner_url !== undefined)
    toUpdate.preset_banner_url = preset_banner_url;
  const { data, error } = await supabase
    .from('workflow')
    .update(toUpdate)
    .eq('id', id).select(`*, versions: workflow_version(
      id, 
      data,
      preview_image_url,
      status,
      created_at,
      last_updated
    )`);
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
    dispatch(changeWorkflowInfo({ workflow: newData[0] }));
    dispatch(changeWorkflow(newData[0]));
    onSuccess(newData);
  } else {
    onError(error);
  }
};

export const changeAWorkflowOrg = async ({
  orgId,
  workflow,
  dispatch,
  onSuccess = () => {},
  onError = () => {},
}: {
  orgId: any;
  workflow: any;
  dispatch: any;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  dispatch(startLoading({}));
  const orgIdFrom = workflow?.owner_org_id;

  const { data, error } = await supabase
    .from('workflow')
    .update({ owner_org_id: orgId })
    .eq('id', workflow?.id).select(`id,
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
          )`);

  if (data) {
    dispatch(changeWorkflowOrg({ orgIdFrom: orgIdFrom, workflow: data[0] }));
    onSuccess(data);
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
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
  workflow,
  dispatch,
  onSuccess,
  onError = (error: any) => {
    console.log(error);
  },
}: {
  workflow: any;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  const { data, error } = await supabase
    .from('workflow')
    .delete()
    .eq('id', workflow.id)
    .select('*');
  dispatch(finishLoading({}));

  if (!error) {
    dispatch(deleteWorkflow({ workflow: workflow }));
    onSuccess(data);
  } else {
    onError(error);
  }
  // if (!error) {
  //   if (data) {
  //     dispatch(deleteWorkflow({ workflow: workflow }));
  //     onSuccess(data);
  //   }
  // } else {
  //   onError({
  //     message: 'Failed to delete workflow',
  //   });
  // }
  // if (!error) {
  //   if (data) {
  //     dispatch(deleteWorkflow({ workflow: workflow }));
  //     onSuccess(data);
  //   }
  // } else {
  //   onError({
  //     message: 'Failed to delete workflow',
  //   });
  // }
};

export const deleteAWorkflowVersion = async ({
  workflowVersionId,
  dispatch,
  onSuccess,
  onError = () => {},
}: {
  workflowVersionId: number;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  dispatch(startLoading({}));

  const { data, error } = await supabase
    .from('workflow_version')
    .delete()
    .eq('id', workflowVersionId);

  dispatch(finishLoading({}));
  if (!error) {
    onSuccess(data);
  } else if (error) {
    onError(error);
  }
};

export const queryVersionHistory = async ({
  versionId,
  dispatch,
  onSuccess,
  onError = () => {},
}: {
  versionId: number;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  // dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('workflow_version_history_view')
    .select()
    .eq('workflow_version_id', versionId)
    .order('created_at', { ascending: false })
    .limit(5);
  if (!error) {
    // pre-process data
    const newData = structuredClone(data) || [];
    data.forEach((d: any, index: number) => {
      const presetIcon = d.preset_icon_url
        ? `preset:${d.preset_icon_url}`
        : d.icon_url;
      newData[index].icon_url = d.icon_url ? d.icon_url : presetIcon;
      delete newData[index].preset_icon_url;
    });
    onSuccess(data);
  } else {
    console.error('Cannot fetch version history', error);
    onError(error);
  }
  // dispatch(finishLoading({}));
};

export const queryVersionEditor = async ({
  versionId,
  dispatch,
  onSuccess,
  onError,
}: {
  versionId: number;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  // dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('workflow_version_editor_view')
    .select()
    .eq('workflow_version_id', versionId);
  if (!error) {
    const newData = structuredClone(data) || [];
    data.forEach((d: any, index: number) => {
      const presetIcon = d.preset_icon_url
        ? `preset:${d.preset_icon_url}`
        : d.icon_url;
      newData[index].icon_url = d.icon_url ? d.icon_url : presetIcon;
      delete newData[index].preset_icon_url;
    });
    onSuccess(newData);
  } else {
    console.error('Cannot load version editor', error);
  }
  // dispatch(finishLoading({}));
};

export const searchWorflow = async ({
  inputSearch,
  dispatch,
  onSuccess,
  onError = (error) => {
    console.log(error);
  },
}: {
  inputSearch: string;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('workflow')
    .select(
      `*,
      versions: workflow_version(id, status),
      infoOrg: org(title)
  `
    )
    .textSearch('title', `'${inputSearch}'`);

  if (error) {
    onError(error);
  } else {
    if (data) {
      onSuccess(data);
    }
  }

  dispatch(finishLoading({}));
};

export const getWorkflowByStatus = async ({
  status,
  dispatch,
  onSuccess,
  onError,
}: {
  status: any;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('workflow').select(`*,
         versions: workflow_version(id, status),
         infoOrg: org(title)
         `);

  dispatch(finishLoading({}));
  if (error) {
    onError(error);
  } else {
    if (data) {
      const workflowData = data.filter(
        (worfklow) => worfklow?.versions[0]?.status === status
      );
      onSuccess(workflowData);
    }
  }
};

export const insertNewEditor = async ({
  props,
  dispatch,
  onSucess,
  onError = (error: any) => {
    console.log(error);
  },
}: {
  props: any;
  dispatch: any;
  onSucess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  const { workflow_version_id: version_id, user_id: userId } = props;
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('workflow_version_editor')
    .insert({
      workflow_version_id: version_id,
      user_id: userId,
    })
    .select();
  dispatch(finishLoading({}));
  if (error) {
    onError(error);
  } else {
    onSucess(data);
  }
};

export const getWorkflowFromEditor = async ({
  userId,
  dispatch,
  onSuccess,
  onError,
}: {
  userId: any;
  dispatch: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('workflow_version_editor')
    .select(
      `*, 
    workflow_version(
      status,
      id,
      last_updated,
      created_at,
        workflow(*,
          org(*)
          )
    )`
    )
    .eq('user_id', userId);

  dispatch(finishLoading({}));
  if (error) {
    onError(error);
  } else {
    if (data) {
      let tmp = <any>[];
      data.forEach((version: any) => {
        const workflow = {
          banner_url: version.workflow_version.workflow.banner_url,
          icon_url: version.workflow_version.workflow.icon_url,
          id: version.workflow_version.workflow.id,
          org_title: version.workflow_version.workflow.org.title,
          owner_org_id: version.workflow_version.workflow.owner_org_id,
          preset_banner_url:
            version.workflow_version.workflow.preset_banner_url,
          preset_icon_url: version.workflow_version.workflow.preset_icon_url,
          title: version.workflow_version.workflow.title,
          version: [
            {
              created_at: version.workflow_version.created_at,
              id: version.workflow_version.id,
              last_updated: version.workflow_version.last_updated,
              status: version.workflow_version.status,
            },
          ],
        };
        tmp.push(workflow);
      });

      onSuccess(tmp);
    }
  }
};

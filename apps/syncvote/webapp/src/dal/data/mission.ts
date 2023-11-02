import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import {
  deleteMission as reduxDeleteMission,
  setMissions as setReducerMissions,
  changeMission,
  setLastFetch,
} from '@dal/redux/reducers/mission.reducer';
import { supabase } from 'utils';
import { IMission } from '@types';
import { deepEqual } from '@utils/helpers';

export class MissionFunctionClass {
  async queryMission({
    params,
    onSuccess,
    onError = (error) => {
      console.error(error); // eslint-disable-line
    },
    dispatch,
    shouldCache,
    reduxDataReturn,
  }: {
    params: { orgIds: number[] };
    onSuccess: (data: any) => void;
    onError?: (data: any) => void;
    dispatch: any;
    shouldCache: boolean;
    reduxDataReturn: any;
  }) {
    const { orgIds } = params;

    const { missions } = reduxDataReturn;
    if (shouldCache) {
      onSuccess(missions);
    } else {
      dispatch(startLoading({}));
      const { data, error } = await supabase
        .from('mission_view')
        .select('*')
        .in('org_id', orgIds);

      // TODO: check if data is correct
      if (data) {
        const newMissions: IMission[] = [];
        const mList = Array.isArray(data) ? data : [data];
        mList.forEach((d: any) => {
          const newd = { ...d };
          newd.mission_icon_url = d.mission_icon_url
            ? d.mission_icon_url
            : `preset:${d.mission_preset_icon_url}`;

          const orgPresetIcon = d?.org_preset_icon_url
            ? `preset:${d?.org_preset_icon_url}`
            : d?.preset_icon_url;

          newd.org_icon_url = d?.org_icon_url ? d?.org_icon_url : orgPresetIcon;

          delete newd.org_preset_icon_url;
          delete newd.mission_preset_icon_url;
          delete newd.preset_banner_url;
          newMissions.push(newd);
        });
        if (deepEqual(newMissions, missions)) {
          onSuccess(missions);
        } else {
          dispatch(setLastFetch({}));
          dispatch(setReducerMissions(newMissions));
          onSuccess(newMissions);
        }
      } else if (error) {
        onError(error);
      }
      dispatch(finishLoading({}));
    }
  }
}

export const queryAMissionDetail = async ({
  missionId,
  onSuccess,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
}: {
  missionId: number;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('mission_vote_details')
    .select('*')
    .eq('mission_id', missionId);
  if (!error) {
    const { data: dataVoteRecords, error: errorVoteRecord } = await supabase
      .from('vote_record')
      .select('*')
      .eq('current_vote_data_id', data[0].cvd_id);

    const { data: dataProgress, error: errorProgress } = await supabase
      .from('progress_mission_view')
      .select('*')
      .eq('mission_id', data[0].mission_id);

    if (!errorVoteRecord && !errorProgress) {
      const voteRecords = dataVoteRecords.map((voteRecord) => {
        return {
          identify: voteRecord.identify,
          option: voteRecord.option,
        };
      });

      const progress = dataProgress.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const dataMissionAfterHandle = data[0];
      dataMissionAfterHandle.vote_record = voteRecords;
      dataMissionAfterHandle.progress = progress;
      onSuccess(dataMissionAfterHandle);
    } else {
      onError(errorVoteRecord);
    }
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const queryMission = async ({
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
    .from('mission')
    .select('*, workflow_version(id, workflow(owner_org_id))')
    .eq('workflow_version.workflow.owner_org_id', orgId);
  dispatch(finishLoading({}));
  // TODO: check if data is correct
  const newMissions: IMission[] = [];
  const mList = Array.isArray(data) ? data : [data];
  mList.forEach((d: any) => {
    const newd = { ...d };
    newd.icon_url = d.icon_url ? d.icon_url : `preset:${d.preset_icon_url}`;
    delete newd.preset_icon_url;
    delete newd.preset_banner_url;
    newMissions.push(newd);
  });
  dispatch(setReducerMissions(data));
  dispatch(setLastFetch({}));
  if (data) {
    onLoad(newMissions);
  } else if (error) {
    onError(error);
  }
};
export const queryAMission = async ({
  missionId,
  onLoad,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
}: {
  missionId: number;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('mission')
    .select('*')
    .eq('id', missionId);
  dispatch(finishLoading({}));
  if (data) {
    const newData = { ...data };
    data.forEach((d: any, index: number) => {
      newData[index].icon_url = d.icon_url
        ? d.icon_url
        : `preset:${d.preset_icon_url}`;
      delete newData[index].preset_icon_url;
    });
    dispatch(setLastFetch({}));
    dispatch(setReducerMissions(data));
    onLoad(newData);
  } else if (error) {
    onError(error);
  }
};
export const upsertAMission = async ({
  mission,
  onLoad,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
}: {
  mission: any;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const newMission = structuredClone(mission);
  if (newMission.id < 0) {
    // invalid id, probably a new mission
    delete newMission.id;
  }
  if (newMission.icon_url?.indexOf('preset:') === 0) {
    newMission.preset_icon_url = newMission.icon_url.replace('preset:', '');
    newMission.icon_url = '';
  }
  if (newMission.banner_url?.indexOf('preset:') === 0) {
    newMission.preset_banner_url = newMission.banner_url.replace('preset:', '');
    newMission.banner_url = '';
  }
  if (newMission.workflow_version) {
    delete newMission.workflow_version;
  }
  const { data, error } = await supabase
    .from('mission')
    .upsert(newMission)
    .select();
  dispatch(finishLoading({}));
  if (data) {
    const newData = [...data];
    newData.forEach((d: any, index: number) => {
      newData[index].icon_url = d.preset_icon_url
        ? `preset:${d.preset_icon_url}`
        : d.icon_url;
      newData[index].banner_url = d.preset_banner_url
        ? `preset:${d.preset_banner_url}`
        : d.banner_url;
      delete newData[index].preset_icon_url;
      delete newData[index].preset_banner_url;
    });
    dispatch(changeMission(newData[0]));
    onLoad(newData);
  } else if (error) {
    onError(error);
  }
};
export const deleteMission = async ({
  id,
  onLoad,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
  dispatch,
}: {
  id: number;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('mission').delete().eq('id', id);
  dispatch(finishLoading({}));
  if (!error) {
    dispatch(
      reduxDeleteMission({
        id,
      })
    );
    onLoad(data);
  } else {
    onError(error);
  }
};

export const insertMission = async ({
  params,
  dispatch,
  onSuccess = () => {},
  onError = () => {},
}: {
  params: any;
  dispatch: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('mission').insert(params);
  dispatch(finishLoading({}));
  if (!error) {
    onSuccess(data);
  } else {
    onError(error);
    console.log(error);
  }
};

export const insertDocInput = async ({
  content,
  docInputId,
  onSuccess = (data) => {},
  onError = (data) => {},
  dispatch,
}: {
  content: string;
  docInputId: string;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  console.log('content', content);
  const { data, error } = await supabase
    .from('arweave')
    .insert([{ content: content, doc_input_id: docInputId }])
    .select();
  if (!error) {
    console.log('data return create doc', data);
    onSuccess(data[0]);
  } else {
    onError(error);
  }
  dispatch(finishLoading({}));
};

export const queryDocInput = async ({
  idDocInput,
  onSuccess = (data) => {},
  onError = (data) => {},
  dispatch,
}: {
  idDocInput: number;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  // dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('arweave')
    .select('*')
    .eq('id', idDocInput);
  if (!error) {
    onSuccess(data[0]);
  } else {
    onError(error);
  }
  // dispatch(finishLoading({}));
};

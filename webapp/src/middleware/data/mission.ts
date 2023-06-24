import {
  startLoading, finishLoading,
} from '@redux/reducers/ui.reducer';
import {
  deleteMission as reduxDeleteMission,
  setMissions as setReducerMissions,
  changeMission,
  setLastFetch,
} from '@redux/reducers/mission.reducer';
import { supabase } from '@utils/supabaseClient';
import { IMission } from '@types';

export const queryMission = async ({
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
  const { data, error } = await supabase.from('mission')
    .select('*, workflow_version(id, workflow(owner_org_id))')
    .eq('workflow_version.workflow.owner_org_id', orgId);
  dispatch(finishLoading({}));
  // TODO: check if data is correct
  const newMissions:IMission[] = [];
  const mList = Array.isArray(data) ? data : [data];
  mList.forEach((d:any) => {
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
  missionId, onLoad, onError = (error) => {
    console.error(error); // eslint-disable-line
  }, dispatch,
}: {
  missionId: number;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('mission').select('*').eq('id', missionId);
  dispatch(finishLoading({}));
  if (data) {
    const newData = { ...data };
    data.forEach((d:any, index:number) => {
      newData[index].icon_url = d.icon_url ? d.icon_url : `preset:${d.preset_icon_url}`;
      newData[index].banner_url = d.banner_url ? d.banner_url : `preset:${d.preset_banner_url}`;
      delete newData[index].preset_icon_url;
      delete newData[index].preset_banner_url;
    });
    dispatch(setLastFetch({}));
    dispatch(setReducerMissions(data));
    onLoad(newData);
  } else if (error) {
    onError(error);
  }
};
export const upsertAMission = async ({
  mission, onLoad, onError = (error) => {
    console.error(error); // eslint-disable-line
  }, dispatch,
}: {
  mission: any;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const newMission = structuredClone(mission);
  if (newMission.id < 0) { // invalid id, probably a new mission
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
  const { data, error } = await supabase.from('mission').upsert(newMission).select();
  dispatch(finishLoading({}));
  if (data) {
    const newData = [...data];
    newData.forEach((d: any, index:number) => {
      newData[index].icon_url = d.preset_icon_url ? `preset:${d.preset_icon_url}` : d.icon_url;
      newData[index].banner_url = d.preset_banner_url ? `preset:${d.preset_banner_url}` : d.banner_url;
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
  id, onLoad, onError = (error) => {
    console.error(error); // eslint-disable-line
  }, dispatch,
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
    dispatch(reduxDeleteMission({
      id,
    }));
    onLoad(data);
  } else {
    onError(error);
  }
};

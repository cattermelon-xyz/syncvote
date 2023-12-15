import { supabase } from '@configs/supabaseClient';

export const queryMission = async ({
  orgId,
  onSuccess,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
}: {
  orgId: number;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  const { data, error } = await supabase
    .from('mission_view')
    .select('*')
    .eq('org_id', orgId);

  if (data) {
    // TODO: check if data is correct
    const newMissions: any[] = [];
    const mList = Array.isArray(data) ? data : [data];

    for (let d of mList) {
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
    }
    onSuccess(newMissions);
  } else if (error) {
    onError(error);
  }
};

export const queryAMissionDetail = async ({
  missionId,
  onSuccess,
  onError = (error) => {
    console.error(error); // eslint-disable-line
  },
}: {
  missionId: number;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
}) => {
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
};

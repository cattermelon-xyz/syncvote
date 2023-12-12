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

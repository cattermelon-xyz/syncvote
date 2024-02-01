import { supabase } from '../../configs/supabaseClient.ts';

export const insertMissionDatabase = async (props: any) => {
  const { data: newMission, error } = await supabase
    .from('mission')
    .insert({ ...props })
    .select('*');

  if (error) {
    return { error: error };
  } else {
    return {
      data: newMission[0],
    };
  }
};

export const updateMissionDatabase = async ({
  cvd_id,
  mission_id,
}: {
  cvd_id: any;
  mission_id: number;
}) => {
  const { error } = await supabase
    .from('mission')
    .update({
      current_vote_data_id: cvd_id,
    })
    .eq('id', mission_id);

  if (error) {
    return { error: error };
  }

  return {};
};

import { supabase } from '../../configs/supabaseClient.ts';

export const getMissionVoteDetailsDatabase = async ({
  mission_id,
}: {
  mission_id: number;
}) => {
  const { data, error } = await supabase
    .from('mission_vote_details')
    .select(`*`)
    .eq('mission_id', mission_id);

  if (error) {
    return { error: error };
  } else {
    return {
      data: data[0],
    };
  }
};

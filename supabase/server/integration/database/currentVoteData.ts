import { supabase } from '../../configs/supabaseClient.ts';

export const insertCvdDatabase = async (props: any) => {
  const { data: newCVD, error } = await supabase
    .from('current_vote_data')
    .insert({ ...props })
    .select('*');

  if (error) {
    return { error: error };
  } else {
    return {
      data: newCVD[0],
    };
  }
};

import { supabase } from '../../configs/supabaseClient.ts';

export const insertCheckpointDatabase = async (props: any) => {
  const { data: newCheckpoint, error } = await supabase
    .from('checkpoint')
    .insert({ ...props })
    .select('*');

  if (error) {
    return { error: error };
  }

  return {};
};

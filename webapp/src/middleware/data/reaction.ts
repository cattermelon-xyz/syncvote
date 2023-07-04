import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { supabase } from '@utils/supabaseClient';

export const getDataReactionCount = async ({
  where,
  dispatch,
}: {
  where: any;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('reaction_type')
    .select(`id, reaction(count), icon`)
    .eq('reaction.where', where)
    .order('id');
  dispatch(finishLoading({}));
  if (error) {
    console.log(error);
    return [];
  } else {
    return data as any[];
  }
};

export const insertReaction = async (reaction: any, dispatch: any) => {
  dispatch(startLoading({}));
  const { error } = await supabase.from('reaction').insert(reaction);
  dispatch(finishLoading({}));
  if (error) {
    console.log(error);
  }
};

export const deleteReaction = async (reaction: any, dispatch: any) => {
  dispatch(startLoading({}));
  const { error } = await supabase
    .from('reaction')
    .delete()
    .eq('where', reaction?.where)
    .eq('by_who', reaction?.by_who)
    .eq('reaction_type', reaction?.reaction_type);
  dispatch(finishLoading({}));
  if (error) {
    console.log(error);
  }
};

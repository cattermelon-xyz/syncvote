import {
  finishLoading,
  startLoading,
  setTags,
  insertTag,
} from '@redux/reducers/ui.reducer';
import { supabase } from '@utils/supabaseClient';

// TODO: should store the last time of update
export const queryTag = async ({ dispatch }: { dispatch: any }) => {
  dispatch(startLoading({}));
  const { data: tags, error } = await supabase
    .from('tag_view')
    .select()
    .order('count', { ascending: false });
  if (!error) {
    dispatch(setTags(tags));
  }
  dispatch(finishLoading({}));
};

export const newTag = async ({
  dispatch,
  tag,
  onSuccess = (data) => {},
  onError = (data) => {},
}: {
  dispatch: any;
  tag: string;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase
    .from('tag')
    .insert([{ label: tag }])
    .select();
  if (!error) {
    dispatch(insertTag(data[0]));
    const rs = {
      value: data[0].id,
      label: data[0].label,
    };
    onSuccess(rs);
    return { data: rs };
  } else {
    const { data, error } = await supabase
      .from('tag')
      .select('*')
      .eq('label', tag);
    if (data) {
      const rs = {
        value: data[0].id,
        label: data[0].label,
      };
      onSuccess(rs);
      return { data: rs };
    } else {
      onError(error);
      return { error };
    }
    return { error };
  }
};

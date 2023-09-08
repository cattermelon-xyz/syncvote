import {
  finishLoading,
  startLoading,
  insertTags,
  newTag as reduxNewTag,
} from '@redux/reducers/ui.reducer';
import { supabase } from 'utils';

export enum TagObject {
  TEMPLATE = 'template',
  WORKFLOW = 'workflow',
  MISSION = 'mission',
}

export const queryTag = async ({
  dispatch,
  tagTo = TagObject.TEMPLATE,
}: {
  dispatch: any;
  tagTo?: TagObject;
}) => {
  dispatch(startLoading({}));
  const { data: tags, error } = await supabase
    .from('tag_view')
    .select()
    .order('count_' + tagTo, { ascending: false })
    .limit(10);
  dispatch(finishLoading({}));
  if (!error) {
    dispatch(insertTags(tags));
    return {
      data: tags.map((t) => ({
        value: t.id,
        label: t.label,
        count_template: t.count_template,
        count_workflow: t.count_workflow,
        count_mission: t.count_mission,
      })),
      error,
    };
  }
  return { data: undefined, error };
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
  // check if tag already exists before insert!
  const { data: tagData, error: tagError } = await supabase
    .from('tag')
    .select('*')
    .eq('label', tag);
  if (tagData && tagData.length === 0) {
    const { data, error } = await supabase
      .from('tag')
      .insert([{ label: tag }])
      .select();
    if (!error) {
      dispatch(reduxNewTag(data[0]));
      const rs = {
        value: data[0].id,
        label: data[0].label,
      };
      onSuccess(rs);
      return { data: rs };
    } else {
      onError(error);
    }
  } else if (tagData && tagData.length === 1) {
    const rs = {
      value: tagData[0].id,
      label: tagData[0].label,
    };
    return { data: rs };
  } else if (tagError) {
    onError(tagError);
    return { tagError };
  }
  return { tagError };
};

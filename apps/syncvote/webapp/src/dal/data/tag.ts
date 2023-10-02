import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';

import {
  insertTags,
  newTag as reduxNewTag,
  setLastFetch,
} from '@dal/redux/reducers/preset.reducer';

import { supabase } from 'utils';
import { deepEqual } from '@utils/helpers';

export enum TagObject {
  TEMPLATE = 'template',
  WORKFLOW = 'workflow',
  MISSION = 'mission',
  ORGANIZATION = 'organization',
}
export class TagFunctionClass {
  queryTag = async ({
    dispatch,
    params = { tagTo: TagObject.TEMPLATE },
    reduxDataReturn,
    shouldCache,
    onSuccess = () => {},
    onError = () => {},
  }: {
    params?: {
      tagTo?: TagObject;
    };
    dispatch: any;
    shouldCache: boolean;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    reduxDataReturn: any;
  }) => {
    const tagTo = params?.tagTo;

    const { tags } = reduxDataReturn;

    if (shouldCache) {
      onSuccess(tags);
    } else {
      dispatch(startLoading({}));
      const { data, error } = await supabase
        .from('tag_view')
        .select()
        .order('count_' + tagTo, { ascending: false })
        .limit(10);
      dispatch(finishLoading({}));

      if (!error) {
        const dataSetRedux = data.map((t: any) => ({
          value: t.id,
          label: t.label,
          count_template: t.count_template,
          count_workflow: t.count_workflow,
          count_mission: t.count_mission,
        }));

        if (deepEqual(dataSetRedux, tags)) {
          onSuccess(tags);
        } else {
          dispatch(insertTags(data));
          dispatch(setLastFetch({}));
          onSuccess(dataSetRedux);
        }
      } else {
        onError(error);
      }
    }
  };

  newTag = async ({
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
}

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

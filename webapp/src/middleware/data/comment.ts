import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { supabase } from '@utils/supabaseClient';

interface Profile {
  id: any;
  email: any;
  full_name: any;
  avatar_url: any;
}

export interface CommentType {
  id: any;
  text: String;
  where: any;
  comment_id: Number | null;
  comment: any;
  profile: Profile | null;
  created_at: any;
  by_who: any;
}

export const addComment = async ({
  commentInsert,
  dispatch,
}: {
  commentInsert: any;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { error } = await supabase.from('comment').insert(commentInsert);
  dispatch(finishLoading({}));
};

export const getDataComment = async ({
  where,
  offset,
  limit,
  dispatch,
}: {
  dispatch: any;
  offset: any;
  limit: any;
  where: any;
}) => {
  dispatch(startLoading({}));
  const start = offset;
  const end = offset + limit - 1;

  const { data, error } = await supabase
    .from('comment')
    .select(
      `
      id,
      created_at,
      text,
      comment_id,
      where,
      by_who,
      comment(count),
    profile (
      id,
      email,
      full_name,
      avatar_url
    )`
    )
    .range(start, end)
    .eq('where', where)
    .is('comment_id', null)
    .order('created_at', { ascending: false });
  dispatch(finishLoading({}));

  if (error) {
    console.log(error);
  }

  return data as unknown as CommentType[];
};

export const getDataReply = async ({
  comment,
  dispatch,
  offset,
  limit,
}: {
  offset: number;
  limit: number;
  comment: CommentType | undefined;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const start = offset;
  const end = offset + limit - 1;

  const { data, error } = await supabase
    .from('comment')
    .select(
      `
      id,
      created_at,
      text,
      comment_id,
    profile (
      id,
      email,
      full_name,
      avatar_url
    )`
    )
    .range(start, end)
    .eq('where', comment?.where)
    .eq('comment_id', comment?.id)
    .order('created_at', { ascending: false });
  dispatch(finishLoading({}));

  if (error) {
    console.log(error);
  }

  return data as unknown as CommentType[];
};

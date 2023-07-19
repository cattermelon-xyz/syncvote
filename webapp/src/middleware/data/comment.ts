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
      icon_url,
      preset_icon_url
    )`
    )
    .range(start, end)
    .eq('where', where)
    .is('comment_id', null)
    .order('created_at', { ascending: false });
  dispatch(finishLoading({}));

  const tmp: any[] = [];
  if (error) {
    console.log(error);
  } else {
    data.forEach((d: any) => {
      const presetIcon = d.profile.preset_icon_url
        ? `preset:${d.profile.preset_icon_url}`
        : d.profile.preset_icon_url;

      tmp.push({
        id: d?.id,
        created_at: d?.created_at,
        text: d?.text,
        comment_id: d?.comment_id,
        where: d?.where,
        by_who: d?.by_who,
        comment: [
          {
            count: d?.comment[0].count,
          },
        ],
        profile: {
          id: d?.profile?.id,
          email: d?.profile?.email,
          full_name: d?.profile?.full_name,
          avatar_url: d.profile.icon_url ? d.profile.icon_url : presetIcon,
        },
      });
    });
  }

  return tmp as unknown as CommentType[];
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
      icon_url,
      preset_icon_url
    )`
    )
    .eq('where', comment?.where)
    .eq('comment_id', comment?.id)
    .order('created_at', { ascending: false })
    .range(start, end);

  dispatch(finishLoading({}));
  const tmp: any[] = [];
  if (error) {
    console.log(error);
  } else {
    data.forEach((d: any) => {
      const presetIcon = d.profile.preset_icon_url
        ? `preset:${d.profile.preset_icon_url}`
        : d.profile.preset_icon_url;

      tmp.push({
        id: d?.id,
        created_at: d?.created_at,
        text: d?.text,
        comment_id: d?.comment_id,
        profile: {
          id: d?.profile?.id,
          email: d?.profile?.email,
          full_name: d?.profile?.full_name,
          avatar_url: d.profile.icon_url ? d.profile.icon_url : presetIcon,
        },
      });
    });
  }

  return tmp as unknown as CommentType[];
};

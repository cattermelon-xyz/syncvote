import { finishLoading, startLoading } from "@redux/reducers/ui.reducer";
import { supabase } from "@utils/supabaseClient";

interface CommentType {
  id: Number;
  text: String;
  by_who: any;
  where: any;
  parent_id: Number | null;
  children_count: Number | null;
}

export const addComment = async ({
  commentInfo,
  dispatch,
  onLoad,
}: {
  commentInfo: any;
  dispatch: any;
  onLoad: (data: any) => void;
}) => {
  const { data, error } = await supabase.from("comment").insert(commentInfo);
  onLoad(data);
};

export const loadCommentParent = async ({
  where,
  onLoad,
  offset,
  limit,
}: {
  offset: any;
  limit: any;
  where: any;
  onLoad: (data: any) => void;
}) => {
  const start = offset;
  const end = offset + limit - 1;
  const { data, error } = await supabase
    .from("comment")
    .select(
      `
      id,
      created_at,
      text,
      parent_id,
      children_count,
      where,
    profile (
      id,
      email,
      full_name,
      avatar_url
    )`
    )
    .range(start, end)
    .eq("where", where)
    .order("created_at", { ascending: false });
  onLoad(data);

  return data;
};

export const loadCommentChildren = async ({
  comment,
  dispatch,
  onLoad,
}: {
  comment: CommentType;
  dispatch: any;
  onLoad: (data: any) => void;
}) => {
  dispatch(startLoading({}));
  console.log(comment);

  const { data, error } = await supabase
    .from("comment")
    .select(
      `
      id,
      created_at,
      text,
      parent_id,
      children_count,
    profile (
      id,
      email,
      full_name,
      avatar_url
    )`
    )
    .eq("where", comment.where)
    .eq("parent_id", comment.id)
    .order("created_at", { ascending: false });
  dispatch(finishLoading({}));
  console.log("Reply", data);

  onLoad(data);
};

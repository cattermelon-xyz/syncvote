import { finishLoading, startLoading } from "@redux/reducers/ui.reducer";
import { supabase } from "@utils/supabaseClient";

export const addComment = async ({
  commentInfo,
  dispatch,
}: {
  commentInfo: any;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  //   const { text, by_who, children, where, parent } = commentInfo;

  const { data, error } = await supabase.from("comment").insert(commentInfo);
  console.log(error);
  
  dispatch(finishLoading({}));
};

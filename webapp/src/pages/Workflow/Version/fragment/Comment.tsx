import { useEffect, useState } from "react";
import { Button, Input, Space } from "antd";
import { FiSend } from "react-icons/fi";
import { supabase } from "@utils/supabaseClient";
import { addComment } from "@middleware/data/comment";
import { useDispatch } from "react-redux";

const Comment = ({
  orgId,
  workflowId,
  versionId,
  profile,
}: {
  orgId: number | undefined;
  workflowId: number | undefined;
  versionId: number | undefined;
  profile: any,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    // Perform submit action with the input value
    const commentInfo = {
      text: inputValue,
      by_who: profile?.id,
      where: `${orgId}$/${workflowId}$/${versionId}$`,
      parent_id: null,
      children_count: null,
    };
    await addComment({ commentInfo, dispatch });
    // Clear the input field
    setInputValue("");
  };
  return (
    <div>
      <div></div>
      <div className="">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          className="w-full h-12"
          suffix={
            <FiSend onClick={handleSubmit} className="w-5	h-5 cursor-pointer" />
          }
        />
      </div>

      {/* <Button type="primary" onClick={handleSubmit} className="">
            <FiSend />
          </Button> */}
    </div>
  );
};

export default Comment;

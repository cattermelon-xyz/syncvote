import { useEffect, useState } from "react";
import {
  Avatar,
  Input,
  List,
  Space,
} from "antd";
import { FiSend } from "react-icons/fi";
import VirtualList from "rc-virtual-list";

import {
  addComment,
  loadCommentChildren,
  loadCommentParent,
} from "@middleware/data/comment";
import { useDispatch } from "react-redux";
import type {
  NotificationInstance,
  NotificationPlacement,
} from "antd/es/notification/interface";
import { Session } from "@supabase/supabase-js";
import moment from "moment";
import { finishLoading, startLoading } from "@redux/reducers/ui.reducer";

interface Profile {
  id: String;
  email: any;
  full_name: any;
  avatar_url: any;
}

interface CommentType {
  id: Number | null;
  text: String;
  by_who: any;
  where: any;
  parent_id: Number | null;
  children_count: Number | null;
  profile: Profile;
  created_at: any;
}

const Comment = ({
  orgId,
  workflowId,
  versionId,
  session,
  api,
}: {
  orgId: number | undefined;
  workflowId: number | undefined;
  versionId: number | undefined;
  session: Session | null;
  api: NotificationInstance;
}) => {
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const notLoginText = "You need login to comment";
  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };
  let comments: any[] = [];
  const [commentParent, setCommentParent] = useState<any>();

  const where = `${orgId}$/${workflowId}$/${versionId}$`;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const currentPage = Math.floor(data.length / 10) + 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const commentList = await loadCommentParent({
        limit: pageSize,
        offset: offset,
        where: where,
        onLoad: (data: any) => {
          setCommentParent(data);
        },
      });

      setData(data.concat(commentList));
    } catch (error) {
      console.error("Failed to load more comments:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const handleSubmit = async () => {
    const commentInfo = {
      text: inputValue,
      by_who: session?.user?.id,
      avatar_url: "",
      where: where,
      parent_id: null,
      children_count: null,
    };

    if (commentInfo.text !== "") {
      await addComment({ commentInfo, dispatch, onLoad: (data: any) => {} });
      dispatch(startLoading({}));
      setData([commentInfo, ...data]);
      dispatch(finishLoading({}));
    } else {
      openNotification("top", "Cannot comment null");
    }

    setInputValue("");
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      loadMoreData();
    }
  };

  const openNotification = (
    placement: NotificationPlacement,
    content: String
  ) => {
    api.info({
      message: `Notification`,
      description: content,
      placement,
    });
  };

  return (
    <>
      <div className="2">
        <Space direction="vertical" className="w-full p-4 cursor-pointer">
          <div className="text-lg	font-semibold">Comments</div>
          <List>
            <VirtualList
              data={data}
              height={400}
              itemHeight={47}
              itemKey="email"
              onScroll={onScroll}
            >
              {(item: CommentType) => (
                <div>
                  {item.children_count?.toString() !== undefined ? (
                    <List.Item key={item.id?.toString()}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={"large"}
                            src={item.profile.avatar_url}
                          />
                        }
                        title={
                          <div className="flex">
                            <a href="https://ant.design" className="text-sm">
                              {item.profile.full_name}
                            </a>
                            <p className="text-[#575655] text-sm ml-2">
                              {moment(item?.created_at).fromNow()}
                            </p>
                          </div>
                        }
                        description={item.text}
                      />
                    </List.Item>
                  ) : (
                    <List.Item key={item.id?.toString()}>
                      <List.Item.Meta
                        avatar={<Avatar src={item.profile.avatar_url} />}
                        title={
                          <div className="flex">
                            <a href="https://ant.design" className="text-sm">
                              {item.profile.full_name}
                            </a>
                            <p className="text-[#575655] text-sm ml-2">
                              {moment(item?.created_at).fromNow()}
                            </p>
                          </div>
                        }
                        description={item.text}
                      />
                    </List.Item>
                  )}
                </div>
              )}
            </VirtualList>
          </List>
        </Space>
      </div>
      <div
        style={{
          borderTop: "1px solid var(--foundation-grey-g-3, #E3E3E2)",
          width: "100%",
        }}
      >
        <div className="p-4">
          {session?.user?.id === undefined ? (
            <>
              <Input
                value={inputValue}
                onChange={handleInputChange}
                className="w-full h-12 m-2.5"
                placeholder="Please login to comment"
                suffix={
                  <FiSend
                    onClick={() => openNotification("top", notLoginText)}
                    className="w-5	h-5 cursor-pointer"
                  />
                }
              />
            </>
          ) : (
            <Input
              value={inputValue}
              onChange={handleInputChange}
              className="h-12"
              placeholder="Comment"
              suffix={
                <FiSend
                  onClick={handleSubmit}
                  className="w-5 h-5 cursor-pointer"
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;

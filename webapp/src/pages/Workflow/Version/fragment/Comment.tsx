import { useEffect, useState } from 'react';
import { Avatar, Button, Input, List, Space } from 'antd';
import { FiSend } from 'react-icons/fi';
import VirtualList from 'rc-virtual-list';

import {
  addComment,
  loadCommentChildren,
  loadCommentParent,
} from '@middleware/data/comment';
import { useDispatch } from 'react-redux';
import type {
  NotificationInstance,
  NotificationPlacement,
} from 'antd/es/notification/interface';
import { Session } from '@supabase/supabase-js';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';

interface Profile {
  id: any;
  email: any;
  full_name: any;
  avatar_url: any;
}

interface CommentType {
  id: any;
  text: String;
  where: any;
  comment_id: Number | null;
  comment: any;
  profile: Profile | null;
  created_at: any;
  by_who: any;
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
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const notLoginText = 'You need login to comment';
  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };
  const [commentStatus, setCommentStatus] = useState(true);
  const [replyStatus, setReplyStatus] = useState(false);
  const [commentParent, setCommentParent] = useState<CommentType[]>();
  const [commentChildren, setCommentChildren] = useState<CommentType[]>();
  const [currentComment, setCurrentComment] = useState<CommentType>();
  const where = `${orgId}$/${workflowId}$/${versionId}$`;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CommentType[]>([]);
  const [dataReply, setDataReply] = useState<CommentType[]>([]);

  const currentPage = Math.floor(data.length / 10) + 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  useEffect(() => {
    loadMoreData();
  }, []);

  const backToComment = () => {
    setCommentStatus(!commentStatus);
    setReplyStatus(!replyStatus);
    setDataReply([]);
    setCurrentComment(undefined);
  };

  const toReply = (item: CommentType) => {
    setCommentStatus(false);
    setReplyStatus(true);
    setCurrentComment(item);
    loadReplyData(item);
  };

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
        dispatch: dispatch,
        onLoad: (data: any) => {
          setCommentParent(data);
        },
      });

      setData(data.concat(commentList));
    } catch (error) {
      console.error('Failed to load more comments:', error);
    }

    setLoading(false);
  };

  const loadReplyData = async (comment: CommentType) => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const commentList = await loadCommentChildren({
        comment: comment,
        dispatch: dispatch,
        onLoad: (data: any) => {
          setCommentChildren(data);
        },
      });

      setDataReply(dataReply.concat(commentList));
    } catch (error) {
      console.error('Failed to load more comments:', error);
    }

    setLoading(false);
  };

  const handleSubmit = async (item: any) => {
    const commentInsert = {
      text: inputValue,
      by_who: session?.user?.id,
      where: where,
      comment_id: item?.id,
    };

    const commentInfo: CommentType = {
      id: data.length,
      text: commentInsert.text,
      where: commentInsert.where,
      comment_id: item?.id,
      profile: {
        id: session?.user?.id,
        email: session?.user?.email,
        full_name: session?.user?.user_metadata?.full_name,
        avatar_url: session?.user?.user_metadata?.avatar_url,
      },
      created_at: moment.now(),
      by_who: session?.user?.id,
      comment: undefined,
    };

    if (commentInsert.text !== '') {
      await addComment({ commentInsert, dispatch, onLoad: (data: any) => {} });
      if (item) {
        setDataReply((prevData) => [commentInfo, ...prevData]);
      } else {
        setData((prevData) => [commentInfo, ...prevData]);
      }
    } else {
      openNotification('top', 'Cannot comment null');
    }

    setInputValue('');
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
      {commentStatus && (
        <>
          <div>
            <div className=''>
              <Space direction='vertical' className='w-full p-4 cursor-pointer'>
                <div className='text-lg	font-semibold'>Comments</div>
                <List>
                  <VirtualList
                    data={data}
                    height={400}
                    itemHeight={47}
                    itemKey='email'
                    onScroll={onScroll}
                  >
                    {(item: CommentType) => (
                      <div
                        className='rounded-xl	m-1.5'
                        style={{
                          border:
                            '1px solid var(--foundation-grey-g-3, #E3E3E2)',
                        }}
                      >
                        <div className='px-3'>
                          {item.comment[0]?.count === 0 ? (
                            <List.Item
                              key={item.id?.toString()}
                              onClick={() => toReply(item)}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    size={'large'}
                                    src={item?.profile?.avatar_url}
                                  />
                                }
                                title={
                                  <div className='flex'>
                                    <a href='#' className='text-sm'>
                                      {item?.profile?.full_name}
                                    </a>
                                    <p className='text-[#575655] text-sm ml-2'>
                                      {moment(item?.created_at).fromNow()}
                                    </p>
                                  </div>
                                }
                                description={item.text}
                              />
                            </List.Item>
                          ) : (
                            <>
                              {item.comment[0]?.count === 1 ? (
                                <List.Item
                                  key={item.id?.toString()}
                                  onClick={() => toReply(item)}
                                >
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar src={item?.profile?.avatar_url} />
                                    }
                                    title={
                                      <div className='flex'>
                                        <a href='#' className='text-sm'>
                                          {item?.profile?.full_name}
                                        </a>
                                        <p className='text-[#575655] text-sm ml-2'>
                                          {moment(item?.created_at).fromNow()}
                                        </p>
                                      </div>
                                    }
                                    description={
                                      <div>
                                        {item.text} <br />
                                        {item?.comment[0]?.count} reply
                                      </div>
                                    }
                                  />
                                </List.Item>
                              ) : (
                                <List.Item
                                  key={item.id?.toString()}
                                  onClick={() => toReply(item)}
                                >
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar src={item?.profile?.avatar_url} />
                                    }
                                    title={
                                      <div className='flex'>
                                        <a href='#' className='text-sm'>
                                          {item?.profile?.full_name}
                                        </a>
                                        <p className='text-[#575655] text-sm ml-2'>
                                          {moment(item?.created_at).fromNow()}
                                        </p>
                                      </div>
                                    }
                                    description={
                                      <div>
                                        {item.text} <br />
                                        {item?.comment[0]?.count} replies
                                      </div>
                                    }
                                  />
                                </List.Item>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </VirtualList>
                </List>
              </Space>
            </div>
          </div>
          <div className='p-4'>
            {session?.user?.id === undefined ? (
              <>
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  className='w-full h-12 m-2.5'
                  placeholder='Please login to comment'
                  suffix={
                    <FiSend
                      onClick={() => openNotification('top', notLoginText)}
                      className='w-5	h-5 cursor-pointer'
                    />
                  }
                />
              </>
            ) : (
              <>
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  className='h-12'
                  placeholder='Comment'
                  suffix={
                    <FiSend
                      onClick={() => handleSubmit(null)}
                      className='w-5 h-5 cursor-pointer'
                    />
                  }
                />
              </>
            )}
          </div>
        </>
      )}

      {replyStatus && (
        <>
          <div>
            <div className=''>
              <Space direction='vertical' className='w-full p-4 cursor-pointer'>
                <div className='flex items-center'>
                  <Button
                    shape='circle'
                    icon={<LeftOutlined size={36} />}
                    className='bg-white flex items-center justify-center mr-6'
                    onClick={backToComment}
                  ></Button>
                  <div className='text-lg	font-semibold'>Back to comments</div>
                </div>

                <List>
                  <VirtualList
                    data={dataReply}
                    height={400}
                    itemHeight={47}
                    itemKey='email'
                    onScroll={onScroll}
                  >
                    {(item: CommentType) => (
                      <div className='rounded-xl	m-1.5'>
                        <div className='px-3'>
                          <List.Item key={item.id?.toString()}>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  size={'large'}
                                  src={item?.profile?.avatar_url}
                                />
                              }
                              title={
                                <div className='flex'>
                                  <a href='#' className='text-sm'>
                                    {item?.profile?.full_name}
                                  </a>
                                  <p className='text-[#575655] text-sm ml-2'>
                                    {moment(item?.created_at).fromNow()}
                                  </p>
                                </div>
                              }
                              description={item.text}
                            />
                          </List.Item>
                        </div>
                      </div>
                    )}
                  </VirtualList>
                </List>
              </Space>
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid var(--foundation-grey-g-3, #E3E3E2)',
              width: '100%',
            }}
          >
            <div className='p-4'>
              {session?.user?.id === undefined ? (
                <>
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    className='w-full h-12 m-2.5'
                    placeholder='Please login to comment'
                    suffix={
                      <FiSend
                        onClick={() => openNotification('top', notLoginText)}
                        className='w-5	h-5 cursor-pointer'
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    className='h-12'
                    placeholder='Reply'
                    suffix={
                      <FiSend
                        onClick={() => handleSubmit(currentComment)}
                        className='w-5 h-5 cursor-pointer'
                      />
                    }
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Comment;

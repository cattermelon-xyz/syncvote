import { useEffect, useState } from 'react';
import { Avatar, Button, Input, List, Space } from 'antd';
import { FiSend } from 'react-icons/fi';
import VirtualList from 'rc-virtual-list';

import { getDataReply, getDataComment, CommentType } from '@dal/data/comment';
import { useDispatch } from 'react-redux';
import type {
  NotificationInstance,
  NotificationPlacement,
} from 'antd/es/notification/interface';
import { Session } from '@supabase/supabase-js';
import moment from 'moment';
import { CloseOutlined, LeftOutlined } from '@ant-design/icons';
import ReactionBox from './Reaction';
import { Icon } from 'icon';
import { useGetDataHook, useSetData } from 'utils';
import { config } from '@dal/config';

const Comment = ({
  where,
  session,
  api,
  collapse,
}: {
  where: any;
  session: Session | null;
  api: NotificationInstance;
  collapse: () => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const notLoginText = 'You need login to comment';
  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };
  const [commentStatus, setCommentStatus] = useState(true);
  const [replyStatus, setReplyStatus] = useState(false);
  const [currentComment, setCurrentComment] = useState<CommentType>();
  const [dataComment, setDataComment] = useState<CommentType[]>([]);
  const [dataReply, setDataReply] = useState<CommentType[]>([]);
  const [offset, setOffset] = useState(0);
  const [offsetReply, setOffsetReply] = useState(0);

  const limit = 5;

  useEffect(() => {
    loadCommentData(offset, limit);
  }, []);

  const backToComment = () => {
    setCommentStatus(!commentStatus);
    setReplyStatus(!replyStatus);
    setDataReply([]);
    setCurrentComment(undefined);
    setOffsetReply(0);
    setDataReply([]);
    loadCommentData(offset, limit);
  };

  const toReply = (item: CommentType) => {
    setCommentStatus(false);
    setReplyStatus(true);
    setCurrentComment(item);
    setOffset(0);
    setOffsetReply(0);
    setDataComment([]);
    loadReplyData(item, 0, limit);
  };

  const loadCommentData = async (offset: number, limit: number) => {
    const newComments =
      (await getDataComment({
        limit: limit,
        offset: offset,
        where: where,
        dispatch: dispatch,
      })) || [];
    setDataComment((prevData) => [...prevData, ...newComments]);

    setOffset(offset);
  };

  const loadReplyData = async (
    comment: CommentType | undefined,
    offset: number,
    limit: number
  ) => {
    const newComments = await getDataReply({
      comment: comment,
      dispatch: dispatch,
      offset: offset,
      limit: limit,
    });

    setDataReply((prevData) => [...prevData, ...newComments]);
    setOffsetReply(offset);
  };

  const handleSubmit = async (item: any) => {
    const commentInsert = {
      text: inputValue,
      by_who: session?.user?.id,
      where: where,
      comment_id: item?.id,
    };

    if (commentInsert.text !== '') {
      await useSetData({
        params: {
          commentInsert: commentInsert,
        },
        configInfo: config.addComment,
        dispatch: dispatch,
      });
      // await addComment({ commentInsert, dispatch });
      if (item) {
        setOffsetReply(0);
        setDataReply([]);
        loadReplyData(item, offsetReply, limit);
      } else {
        setOffset(0);
        setDataComment([]);
        loadCommentData(offset, limit);
      }
    } else {
      openNotification('top', 'Cannot comment null');
    }

    setInputValue('');
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 330) {
      loadCommentData(offset + limit, limit);
    }
  };

  const onScrollReply = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      loadReplyData(currentComment, offsetReply + limit, limit);
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

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  return (
    <>
      {commentStatus && (
        <>
          <div>
            <div className=''>
              <Space direction='vertical' className='w-full cursor-pointer'>
                <Space
                  direction='horizontal'
                  className='flex justify-between w-full p-2 bg-white drop-shadow'
                >
                  <div className='text-md	font-bold'>Comments</div>
                  <Button
                    icon={<CloseOutlined />}
                    shape='circle'
                    className='bg-white'
                    onClick={() => collapse()}
                  />
                </Space>
                <ReactionBox
                  where={where}
                  by_who={session?.user?.id}
                  dispatch={dispatch}
                  api={api}
                />
                <List>
                  <VirtualList
                    data={dataComment}
                    height={330}
                    itemHeight={47}
                    itemKey='email'
                    onScroll={onScroll}
                  >
                    {(item: CommentType) => (
                      <div
                        key={item.id.toString()}
                        className='m-1.5'
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
                                  <Icon
                                    presetIcon={presetIcons}
                                    size='large'
                                    iconUrl={item?.profile?.avatar_url}
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
                                      // <Avatar src={item?.profile?.avatar_url} />
                                      <Icon
                                        presetIcon={presetIcons}
                                        size='large'
                                        iconUrl={item?.profile?.avatar_url}
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
                                      // <Avatar src={item?.profile?.avatar_url} />
                                      <Icon
                                        presetIcon={presetIcons}
                                        size='large'
                                        iconUrl={item?.profile?.avatar_url}
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
          <div className='px-4 pt-2 pb-2'>
            {session?.user?.id === undefined ? (
              <>
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  className='w-full h-12'
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
                  className='w-full h-12'
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
                    onScroll={onScrollReply}
                  >
                    {(item: CommentType) => (
                      <div className='m-1.5' key={item.id?.toString()}>
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
            <div className='pt-2 pb-2 px-4'>
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

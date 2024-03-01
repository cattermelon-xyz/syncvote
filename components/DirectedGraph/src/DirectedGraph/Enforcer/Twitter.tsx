import { FlagOutlined, PlusOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tag } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useState } from 'react';

const getName = () => 'twitter';
const getIcon = () => <TwitterOutlined />;

const Add = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  const { username } = data;
  const [tmpTweet, setTmpTweet] = useState<string>('');
  return (
    // TODO: inject editable here and hide conte area
    <Space direction='vertical' className='w-full' size='large'>
      <Space
        direction='vertical'
        className='w-full flex justify-between'
        size='small'
      >
        <div className='flex items-center'>
          <TwitterOutlined className='mr-2' />
          {` from ${username}`}
        </div>
        <Input.TextArea
          value={tmpTweet}
          onChange={(e) => {
            setTmpTweet(e.target.value);
          }}
        />
      </Space>
      <div className='flex justify-end'>
        <Button
          type='default'
          className='flex items-center'
          icon={<PlusOutlined />}
          onClick={() => {
            onChange({
              provider: data.provider,
              idString: data.id_string,
              params: {
                tweet: tmpTweet,
                username: data.username,
              },
            });
            setTmpTweet('');
          }}
        >
          Add
        </Button>
      </div>
    </Space>
  );
};

const Display = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  const { params, allNodes, triggerAt } = data;
  const { username, tweet } = params;
  const nodeTitle = allNodes.find((node: any) => node.id === triggerAt).title;
  return (
    <Space direction='vertical' size='middle' className='w-full p-2 rounded-md'>
      <Space
        direction='horizontal'
        size='small'
        className='w-full flex items-center border-2 rounded-md justify-between'
      >
        <Space direction='horizontal' size='small'>
          <TwitterOutlined className='mr-1 text-blue-500' />
          Post a tweet
        </Space>
        <Space direction='horizontal' size='small'>
          via
          <span className='text-violet-500 font-bold flex items-center'>
            @{username}
          </span>
        </Space>
      </Space>
      {tweet ? (
        <div className='w-full flex items-center p-2 border-2 rounded-md'>
          <Paragraph
            className='w-full'
            style={{ marginBottom: '0px' }}
            editable={{
              onChange: (val: string) => {
                onChange({
                  ...data,
                  params: {
                    ...data.params,
                    tweet: val,
                  },
                });
              },
            }}
          >
            {tweet}
          </Paragraph>
        </div>
      ) : null}
      <div className='flex items-center'>
        <FlagOutlined className='mr-2' />
        When
        <Tag className='mx-2'>{nodeTitle}</Tag>
        is choosen
      </div>
    </Space>
  );
};

// TODO: produce an interface for the Enforcer
// Display for Workflow
// should be different to Display for Mission
export default {
  Add,
  Display,
  getName,
  getIcon,
};

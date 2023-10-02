import { FlagOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tag } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useState } from 'react';

const getName = () => 'custom';
const getIcon = () => <SettingOutlined />;
// TODO: user can use any kind of trigger imaginable!
const Add = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  const { key, value } = data;
  const [tmpKey, setTmpKey] = useState(key || '');
  const [tmpValue, setTmpValue] = useState(value || '');
  return (
    <Space direction='vertical' className='w-full' size='large'>
      <Space
        direction='vertical'
        className='w-full flex justify-between'
        size='small'
      >
        <Space direction='horizontal' className='w-full flex justify-between'>
          <div className='flex gap-2 items-center'>
            <SettingOutlined className='mr-1' />
            <span>Custom trigger</span>
          </div>
          <Input
            value={tmpKey}
            onChange={(e) => {
              setTmpKey(e.target.value);
            }}
            className='w-full'
          />
        </Space>
        <Input.TextArea
          value={tmpValue}
          onChange={(e) => {
            setTmpValue(e.target.value);
          }}
        />
      </Space>
      <div className='flex justify-end'>
        <Button
          type='default'
          className='flex items-center'
          icon={<PlusOutlined />}
          onClick={() => {
            onChange({ ...data, key: tmpKey, value: tmpValue });
            setTmpKey('');
            setTmpValue('');
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
  const { key, value, allNodes, triggerAt } = data;
  const title =
    triggerAt === 'this'
      ? 'the start'
      : allNodes.find((node: any) => node.id === triggerAt).title;
  return (
    <Space direction='vertical' size='small' className='w-full'>
      <div className='flex items-center'>
        <FlagOutlined className='mr-2' />
        Trigger action at
        <Tag className='mx-2'>{title}</Tag>
      </div>
      <Space direction='vertical' size='middle' className='w-full flex'>
        <Space direction='horizontal' size='small'>
          <SettingOutlined />
          <Tag>{key}</Tag>
        </Space>
        <Paragraph
          className='w-full'
          style={{ marginBottom: '0px' }}
          editable={{
            onChange: (val: string) => {
              onChange({ ...data, value: val });
            },
          }}
        >
          {value}
        </Paragraph>
      </Space>
    </Space>
  );
};

export default {
  Add,
  Display,
  getName,
  getIcon,
};

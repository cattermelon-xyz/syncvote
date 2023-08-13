import {
  CommentOutlined,
  EditOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import TextEditor from '@components/Editor/TextEditor';
import { Button, Modal, Space } from 'antd';
import { ReactNode, useState } from 'react';
import parse from 'html-react-parser';
import { isRTE } from '../utils';

const SideNote = ({
  value,
  setValue = undefined,
  className = '',
  buttonLabel = 'Add Side Note',
  title = (
    <span>
      <MessageOutlined className='mr-1' /> Side Note
    </span>
  ),
}: {
  value: string | undefined;
  setValue?: (val: string) => void;
  className?: string;
  buttonLabel?: string;
  title?: React.ReactNode;
}) => {
  const [showSideNote, setShowSideNote] = useState(false);
  const [tmpValue, setTmpValue] = useState(value || '');
  return (
    <>
      {setValue !== undefined ? (
        <>
          <Modal
            title='Side note'
            open={showSideNote}
            onCancel={() => setShowSideNote(false)}
            onOk={async () => {
              setValue(tmpValue);
              setShowSideNote(false);
            }}
          >
            <TextEditor
              value={tmpValue}
              setValue={(val: any) => {
                setTmpValue(val);
              }}
            />
          </Modal>
          {!value ? (
            <div className={className}>
              <Button
                icon={<CommentOutlined />}
                onClick={() => setShowSideNote(true)}
              >
                {buttonLabel}
              </Button>
            </div>
          ) : (
            <Space
              direction='vertical'
              className={`w-full border border-zinc-300 border-solid rounded-lg p-2 ${className}`}
              size='middle'
            >
              <Space direction='horizontal' className='w-full justify-between'>
                <div>{title}</div>
                <Button
                  type='text'
                  icon={<EditOutlined />}
                  className='hover:text-violet-500'
                  onClick={() => setShowSideNote(true)}
                />
              </Space>
              {parse(value)}
            </Space>
          )}
        </>
      ) : isRTE(value) ? (
        <div className='p-2 border border-solid border-zinc-100 mt-2 rounded-lg border-zinc-200 bg-zinc-100'>
          {parse(value || '')}
        </div>
      ) : null}
    </>
  );
};

export default SideNote;

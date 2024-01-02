import { Button, Input, Select, Space } from 'antd';
import { IVoteUIWebProps } from 'directed-graph';
import { useEffect, useState } from 'react';
import { TextEditor } from 'rich-text-editor';

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { checkpointData, missionData, onSubmit } = props;
  const [title, setTitle] = useState<any>();
  const [missionDesc, setMissionDesc] = useState<any>();
  const action = checkpointData?.data?.action;
  let topicId = '';
  let firstPostId = '';
  if (action === 'update-topic' || action === 'move-topic') {
    const k = checkpointData?.data?.variables[0];
    const v = missionData?.data?.variables[k];
    topicId = v.split(',')[0];
    firstPostId = v.split(',')[1];
    console.log('topicId: ', topicId, '; firstPostId: ', firstPostId);
  }
  return (
    <>
      <div className='flex flex-col gap-4 mt-5'>
        {action === 'create-topic' && (
          <Space direction='vertical' className='w-full'>
            <div className='text-md text-[#575655]'>Title</div>
            <div>
              <Input
                className='w-full'
                placeholder={'Governance revision'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='text-md text-[#575655] mb-2'>Description</div>
            <div>
              <TextEditor
                value={missionDesc}
                setValue={(val: any) => {
                  setMissionDesc(val);
                }}
                id='text-editor'
              />
            </div>
            <Button
              type='primary'
              className='w-full'
              onClick={() => {
                onSubmit({
                  option: 1,
                  submission: {
                    action: checkpointData?.data?.action,
                    variable: checkpointData?.data?.variables[0],
                    title,
                    raw: missionDesc,
                  },
                });
              }}
            >
              Confirm
            </Button>
          </Space>
        )}
        {action === 'move-topic' && (
          <div>
            <div>Move your Topic to other category:</div>
            <div>Move to category id: {checkpointData?.data?.categoryId}</div>
            <Button
              type='primary'
              className='w-full'
              onClick={() => {
                onSubmit({
                  option: 1,
                  submission: {
                    action: checkpointData?.data?.action,
                    variables: checkpointData?.data?.variables[0],
                    // TODO: security risk! this data must be provided by the backend
                    categoryId: checkpointData?.data?.categoryId,
                  },
                });
              }}
            >
              Move
            </Button>
          </div>
        )}
        {action === 'update-topic' && (
          <div>
            <div>Update your topic description:</div>
            <TextEditor
              value={missionDesc}
              setValue={(val: any) => {
                setMissionDesc(val);
              }}
              id='text-editor'
            />
            <Button
              type='primary'
              className='w-full'
              onClick={() => {
                onSubmit({
                  option: 1,
                  submission: {
                    action: checkpointData?.data?.action,
                    variables: checkpointData?.data?.variables[0],
                    raw: missionDesc,
                  },
                });
              }}
            >
              Confirm
            </Button>
          </div>
        )}
        {action === 'create-post' && (
          <Space direction='vertical' className='w-full'>
            <div className='text-md text-[#575655] mb-2'>Post content</div>
            <div>
              <TextEditor
                value={missionDesc}
                setValue={(val: any) => {
                  setMissionDesc(val);
                }}
                id='text-editor'
              />
            </div>
            <Button
              type='primary'
              className='w-full'
              onClick={() => {
                onSubmit({
                  option: 1,
                  submission: {
                    action: checkpointData?.data?.action,
                    variables: checkpointData?.data?.variables[0],
                    raw: missionDesc,
                  },
                });
              }}
            >
              Confirm
            </Button>
          </Space>
        )}
      </div>
    </>
  );
};

export default VoteUIWeb;

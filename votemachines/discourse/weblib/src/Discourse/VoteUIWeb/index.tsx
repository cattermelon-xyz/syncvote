import { Button, Input, Select, Space } from 'antd';
import { IVoteUIWebProps, replaceVariables } from 'directed-graph';
import { useEffect, useState } from 'react';
import { TextEditor } from 'rich-text-editor';
import ModalSubmission from './ModalSubmission';

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { checkpointData, missionData, onSubmit, isEditorUI } = props;
  const [title, setTitle] = useState<any>(missionData?.m_title || '');
  const action = checkpointData?.data?.action;
  let topicId = '';
  let firstPostId = '';
  const defaultDescription = checkpointData?.data?.template || '';
  const variables = props?.missionData?.data?.variables || {};
  const [missionDesc, setMissionDesc] = useState<any>('');
  const [openModalSubmission, setOpenModalSubmission] =
    useState<boolean>(false);
  const [submissionData, setSubmissionData] = useState<any>();

  useEffect(() => {
    replaceVariables(defaultDescription, variables, (val: any) => {
      setMissionDesc(val);
    });
  }, []);
  if (action === 'update-topic' || action === 'move-topic') {
    const k = checkpointData?.data?.variables[0];
    const v = missionData?.data?.variables[k];
    topicId = v.split(',')[0];
    firstPostId = v.split(',')[1];
    console.log('topicId: ', topicId, '; firstPostId: ', firstPostId);
  }
  return (
    <>
      <div className='flex flex-col gap-4'>
        {action === 'create-topic' && (
          <Space direction='vertical' className='w-full'>
            {isEditorUI ? null : (
              <div className='text-md text-[#575655]'>Title</div>
            )}
            <div>
              {isEditorUI ? (
                <input
                  type='text'
                  className='w-full border-none text-4xl focus:outline-none focus:border-none mb-2'
                  placeholder='Proposal title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              ) : (
                <Input
                  className='w-full'
                  placeholder='Governance revision'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              )}
            </div>
            {isEditorUI ? null : (
              <div className='text-md text-[#575655] mb-2'>Description</div>
            )}
            <div>
              <TextEditor
                value={missionDesc}
                setValue={(val: any) => {
                  setMissionDesc(val);
                }}
                id='text-editor'
                isEditorUI={isEditorUI}
              />
            </div>
            <Button
              type='primary'
              className='w-full '
              onClick={() => {
                setSubmissionData({
                  option: 1,
                  submission: {
                    action: checkpointData?.data?.action,
                    variable: checkpointData?.data?.variables[0],
                    title,
                    raw: missionDesc,
                  },
                });
                setOpenModalSubmission(true);
              }}
            >
              Submit
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
              isEditorUI={isEditorUI}
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
              Submit
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
                isEditorUI={isEditorUI}
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
              Submit
            </Button>
          </Space>
        )}
      </div>
      <ModalSubmission
        open={openModalSubmission}
        onClose={() => setOpenModalSubmission(false)}
        onSubmit={onSubmit}
        submissionData={submissionData}
      />
    </>
  );
};

export default VoteUIWeb;

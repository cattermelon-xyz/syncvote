import { Button, Divider, Drawer, Input, Modal, Select, Space } from 'antd';
import {
  IVoteUIWebProps,
  replaceVariables,
  shortenString,
} from 'directed-graph';
import { useEffect, useState } from 'react';
import { TextEditor } from 'rich-text-editor';
import ModalSubmission from './ModalSubmission';
import { FileOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { checkpointData, missionData, onSubmit } = props;
  const [title, setTitle] = useState<any>(missionData?.m_title || '');
  const action = checkpointData?.data?.action;
  let topicId = '';
  let firstPostId = '';
  const defaultDescription = checkpointData?.data?.template || '';
  const variables = props?.missionData?.data?.variables || {};
  const [missionDesc, setMissionDesc] = useState<any>('');

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
  const [showTemplate, setShowTemplate] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  return (
    <>
      <Drawer
        title={<span style={{ fontSize: '32px' }}>Template</span>}
        placement='right' // or 'left', 'top', 'bottom' as per your requirement
        closable={true}
        onClose={() => setShowTemplate(false)}
        visible={showTemplate}
        getContainer={false}
        style={{ position: 'absolute' }}
        width={'40vw'} // or height in case of 'top' or 'bottom' placement
        className='pl-5'
      >
        <div
          className='border rounded-md overscroll-y-auto'
          style={{ maxHeight: '70%', overscrollBehaviorY: 'contain' }}
        >
          {parse(checkpointData?.data?.template || '')}
        </div>
      </Drawer>

      <Modal
        centered
        open={showConfirm}
        title='Confirm submission'
        onCancel={() => setShowConfirm(false)}
        footer={
          <div>
            <Button
              type='primary'
              onClick={() => {
                onSubmit({
                  option: 1,
                  submission: {
                    action: checkpointData?.data?.action,
                    variables: checkpointData?.data?.variables[0],
                    title: title,
                    raw: missionDesc,
                  },
                });
                setShowConfirm(false);
              }}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <p className='text-base text-gray-400'>
          Please double-check the information you have input. Once you click
          'Confirm', this action cannot be reversed.
        </p>
      </Modal>
      <div className='h-full flex flex-col items-center'>
        {action === 'create-topic' && (
          <>
            <div className='w-full flex flex-col items-center'>
              <div
                className='w-full flex flex-col'
                style={{ maxWidth: '700px' }}
              >
                <div className='mb-8'>
                  <div className='mb-2 text-gray-400'>
                    Create a new Topic on Discourse
                  </div>
                  <input
                    type='text'
                    className='w-full border-none text-4xl focus:outline-none focus:border-none'
                    placeholder='Proposal Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className='flex flex-row relative mb-3'>
                  <Button
                    icon={<FileOutlined />}
                    shape='circle'
                    size='large'
                    className='absolute '
                    style={{ left: '-72px' }}
                    onClick={() => setShowTemplate(true)}
                    disabled={!checkpointData?.data?.template}
                    title='Show Template'
                  />
                  <div className='flex flex-col'>
                    <TextEditor
                      value={missionDesc}
                      setValue={setMissionDesc}
                      onReady={(editor) => {
                        editor.editing.view.change((writer: any) => {
                          writer.setStyle(
                            //use max-height(for scroll) or min-height(static)
                            'min-height',
                            '63vh',
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full'>
              <Divider className='m-0' />
              <div
                className='w-full flex py-3 pr-5 items-center'
                style={{ flexDirection: 'row-reverse' }}
              >
                <Button
                  type='primary'
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </>
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
          <>
            <div className='w-full flex flex-col items-center'>
              <div
                className='w-full flex flex-col'
                style={{ maxWidth: '700px' }}
              >
                <div className='mb-8'>
                  <div className='mb-2 text-gray-500'>Update Topic</div>
                  <input
                    type='text'
                    className='w-full border-none text-4xl focus:outline-none focus:border-none'
                    placeholder='Proposal Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className='flex flex-row relative mb-3'>
                  <Button
                    icon={<FileOutlined />}
                    shape='circle'
                    size='large'
                    className='absolute '
                    style={{ left: '-60px' }}
                    onClick={() => setShowTemplate(true)}
                    disabled={!checkpointData?.data?.template}
                    title='Show Template'
                  />
                  <div className='flex flex-col'style={{ maxWidth: '700px' }}>
                    <TextEditor
                      value={missionDesc}
                      setValue={setMissionDesc}
                      onReady={(editor) => {
                        editor.editing.view.change((writer: any) => {
                          writer.setStyle(
                            //use max-height(for scroll) or min-height(static)
                            'min-height',
                            '63vh',
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full'>
              <Divider className='m-0' />
              <div
                className='w-full flex py-3 pr-5 items-center'
                style={{ flexDirection: 'row-reverse' }}
              >
                <Button
                  type='primary'
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </>
        )}
        {action === 'create-post' && (
          <>
            <div className='w-full flex flex-col items-center'>
              <div
                className='w-full flex flex-col'
                style={{ maxWidth: '700px' }}
              >
                <div className='mb-8'>
                  <div className='mb-2 text-gray-500'>
                    Create a new Post on Discourse
                  </div>
                </div>
                <div className='flex flex-row relative mb-3'>
                  <Button
                    icon={<FileOutlined />}
                    shape='circle'
                    size='large'
                    className='absolute '
                    style={{ left: '-60px' }}
                    onClick={() => setShowTemplate(true)}
                    disabled={!checkpointData?.data?.template}
                    title='Show Template'
                  />
                  <div className='flex flex-col'>
                    <TextEditor
                      value={missionDesc}
                      setValue={setMissionDesc}
                      onReady={(editor) => {
                        editor.editing.view.change((writer: any) => {
                          writer.setStyle(
                            //use max-height(for scroll) or min-height(static)
                            'min-height',
                            '63vh',
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full'>
              <Divider className='m-0' />
              <div
                className='w-full flex py-3 pr-5 items-center'
                style={{ flexDirection: 'row-reverse' }}
              >
                <Button
                  type='primary'
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VoteUIWeb;

import {
  CheckCircleOutlined,
  CodeOutlined,
  GlobalOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import Icon from '@components/Icon/Icon';
import { queryVersionEditor } from '@middleware/data';
import { IWorkflow } from '@types';
import { createIdString } from '@utils/helpers';
import {
  Button,
  Input,
  Modal,
  Space,
  Switch,
  Tabs,
  TabsProps,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

type TabProps = {
  workflow: IWorkflow;
  handleWorkflowStatusChanged: (data: any) => void;
  setShowShareModal: (data: any) => void;
};

const InviteTab = ({ workflow }: { workflow: IWorkflow }) => {
  const [newInvitee, setNewInvitee] = useState('');
  const [invitees, setInvitees] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const versionId = workflow?.workflow_version[0]?.id;
    if (versionId) {
      queryVersionEditor({
        versionId: versionId,
        dispatch,
        onSuccess: (data: any) => {
          setInvitees(data);
        },
        onError: (err: any) => {},
      });
    }
  }, [workflow]);
  return (
    <Space direction='vertical' className='w-full flex' size='middle'>
      <div className='font-2xl font-bold'>Share "{workflow.title}"</div>
      <div className='w-full flex items-center justify-between'>
        <Input
          placeholder='Add someone'
          value={newInvitee}
          onChange={(e) => setNewInvitee(e.target.value)}
          className='w-full flex-grow mr-2 flex'
        />
        <Button
          type='default'
          className='text-violet-500 bg-violet-100'
          disabled={newInvitee === ''}
        >
          Invite
        </Button>
      </div>
      <Space direction='vertical' size='middle'>
        <div>Who can access</div>
        <Space direction='vertical' size='small'>
          {invitees.map((invitee: any) => (
            <Space
              direction='horizontal'
              className='w-full flex justify-between'
            >
              <Space direction='horizontal'>
                <Icon iconUrl={invitee.icon_url} size='medium' />
                <Space direction='vertical'>
                  {invitee.full_name}
                  {invitee.email}
                </Space>
              </Space>
              <div>Editor</div>
            </Space>
          ))}
        </Space>
      </Space>
      <Space direction='horizontal'>
        <Button
          type='link'
          icon={<LinkOutlined />}
          className='text-violet-500 pl-0'
        >
          Copy link
        </Button>
        <Button type='link' icon={<CodeOutlined />} className='text-violet-500'>
          Get embeded
        </Button>
      </Space>
    </Space>
  );
};

const DraftWorkflow = ({
  workflow,
  handleWorkflowStatusChanged,
  setShowShareModal,
}: TabProps) => {
  return (
    <Space className='w-full text-center' direction='vertical' size='large'>
      <Space className='w-full text-center' direction='vertical' size='small'>
        <GlobalOutlined />
        <Typography.Text>
          Publish viewer page of this workflow. Others can view, comment, react,
          share or download.
        </Typography.Text>
      </Space>
      <Button
        type='primary'
        className='w-full'
        onClick={() => {
          setShowShareModal(false);
          handleWorkflowStatusChanged({
            versionId: workflow?.workflow_version[0]?.id,
            status: 'PUBLISHED',
            onSuccess: () => {
              Modal.success({
                title: 'Success',
                content: `Workflow is published!`,
              });
            },
            onError: () => {
              Modal.error({
                title: 'Error',
                content: 'Something went wrong, cannot change status',
              });
            },
          });
        }}
      >
        Publish
      </Button>
    </Space>
  );
};

const PublishedWorkflow = ({
  workflow,
  handleWorkflowStatusChanged,
  setShowShareModal,
}: TabProps) => {
  const status = workflow?.workflow_version[0]?.status;
  return (
    <Space direction='vertical' className='w-full' size='middle'>
      <Typography.Text type='success'>
        <CheckCircleOutlined className='mr-2' />
        This workflow has been published
      </Typography.Text>
      <Space.Compact direction='horizontal' className='w-full'>
        <Input
          type='text'
          disabled
          // TODO: this link is fake
          value={`https://syncvote.com/${createIdString(
            workflow.title || '',
            workflow.id?.toString() || ''
          )}`}
        />
        <Button type='default' icon={<LinkOutlined />}>
          Copy link
        </Button>
      </Space.Compact>
      <Space className='w-full bg-zinc-100 justify-between p-2 rounded-lg'>
        <div>Publish to Syncvote community?</div>
        <Switch
          checked={status === 'PUBLIC_COMMUNITY'}
          onClick={(val) => {
            setShowShareModal(false);
            handleWorkflowStatusChanged({
              versionId: workflow?.workflow_version[0]?.id,
              status: val ? 'PUBLIC_COMMUNITY' : 'PUBLIC',
              onSuccess: () => {
                Modal.success({
                  title: 'Success',
                  content: `Workflow ${
                    val
                      ? 'is published to community'
                      : 'is no longer published to community'
                  }!`,
                });
              },
              onError: () => {
                Modal.error({
                  title: 'Error',
                  content: 'Something went wrong, cannot change status',
                });
              },
            });
          }}
        />
      </Space>
      <Space className='w-full flex justify-between'>
        <Button
          type='primary'
          onClick={() => {
            setShowShareModal(false);
            handleWorkflowStatusChanged({
              versionId: workflow?.workflow_version[0]?.id,
              status: 'DRAFT',
              onSuccess: () => {
                Modal.success({
                  title: 'Success',
                  content: `Workflow is not published any more!`,
                });
              },
              onError: () => {
                Modal.error({
                  title: 'Error',
                  content: 'Something went wrong, cannot change status',
                });
              },
            });
          }}
        >
          Unpublish
        </Button>
        <Button type='primary' disabled>
          Publish new changes
        </Button>
      </Space>
    </Space>
  );
};

const PublishTab = ({
  workflow,
  handleWorkflowStatusChanged,
  setShowShareModal,
}: TabProps) => {
  const status = workflow?.workflow_version[0]?.status;
  return (
    <Space direction='vertical' size='large' className='w-full'>
      {status === 'DRAFT' ? (
        <DraftWorkflow
          workflow={workflow}
          handleWorkflowStatusChanged={handleWorkflowStatusChanged}
          setShowShareModal={setShowShareModal}
        />
      ) : (
        <PublishedWorkflow
          workflow={workflow}
          handleWorkflowStatusChanged={handleWorkflowStatusChanged}
          setShowShareModal={setShowShareModal}
        />
      )}
    </Space>
  );
};

const ShareModal = ({
  workflow,
  showShareModal,
  setShowShareModal,
  handleWorkflowStatusChanged,
}: {
  workflow: IWorkflow;
  showShareModal: boolean;
  setShowShareModal: (data: any) => void;
  handleWorkflowStatusChanged: (status: any) => void;
}) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Invite',
      children: <InviteTab workflow={workflow} />,
    },
    {
      key: '2',
      label: 'Publish',
      children: (
        <PublishTab
          workflow={workflow}
          handleWorkflowStatusChanged={handleWorkflowStatusChanged}
          setShowShareModal={setShowShareModal}
        />
      ),
    },
  ];
  return (
    <Modal
      open={showShareModal}
      title={null}
      onCancel={() => setShowShareModal(false)}
      footer={null}
    >
      <Tabs defaultActiveKey='1' items={items} />
    </Modal>
  );
};

export default ShareModal;
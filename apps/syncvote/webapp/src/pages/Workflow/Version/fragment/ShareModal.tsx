import {
  CheckCircleOutlined,
  CodeOutlined,
  GlobalOutlined,
  LinkOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Icon } from 'icon';
import { insertNewEditor, isEmailExisted, queryVersionEditor } from '@dal/data';
import { IWorkflow } from '@types';
import { createIdString, extractIdFromIdString, useGetDataHook } from 'utils';
import {
  Alert,
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
import { useParams } from 'react-router-dom';
import { config } from '@dal/config';
import ModalEditTemplate from '@fragments/ModalEditTemplate';
import { ModalChooseTemplate } from '@fragments/ModalChooseTemplate';
const env = import.meta.env.VITE_ENV;
const baseUrl =
  env === 'dev' ? `https://main.syncvote.com` : `https://app.syncvote.com`;

type TabProps = {
  workflow: IWorkflow;
  handleWorkflowStatusChanged: (data: any) => void;
  setShowShareModal: (data: any) => void;
};

const InviteTab = ({ workflow }: { workflow: IWorkflow }) => {
  const [newInvitee, setNewInvitee] = useState({
    email: '',
    userId: null,
  });
  const [invitees, setInvitees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emailExisted, setEmailExisted] = useState('');
  const dispatch = useDispatch();
  const versionId = workflow?.workflow_version[0]?.id;

  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  const { orgIdString, versionIdString } = useParams();
  const publicUrl = `${baseUrl}/public/${orgIdString}/${createIdString(
    workflow.title || '',
    workflow.id?.toString() || ''
  )}/${versionIdString}`;
  useEffect(() => {
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
      <Space direction='vertical' size='small' className='w-full'>
        <div className='font-2xl font-bold'>Share "{workflow.title}"</div>
        <div className='w-full flex items-top justify-between'>
          <Input
            placeholder='Add someone'
            value={newInvitee.email}
            onChange={(e) => {
              setNewInvitee({ email: e.target.value, userId: null });
              setEmailExisted('');
            }}
            className='w-full flex-grow mr-2 flex'
            onBlur={async () => {
              setIsLoading(true);
              const { existed, userId } = await isEmailExisted({
                email: newInvitee.email,
              });
              if (userId) {
                setNewInvitee({
                  email: newInvitee.email,
                  userId: userId,
                });
              }

              setIsLoading(false);
              setEmailExisted(
                existed
                  ? 'User existed'
                  : 'User not existed, invite to SyncVote'
              );
            }}
          />
          <Button
            type='default'
            className='text-violet-500 bg-violet-100'
            disabled={newInvitee.email === '' || isLoading}
            onClick={async () => {
              await insertNewEditor({
                props: {
                  workflow_version_id: versionId,
                  user_id: newInvitee.userId,
                },
                dispatch,
                onError: (error: any) => {
                  console.log(error);
                },
                onSucess: (data: any) => {
                  console.log(data);
                },
              });

              setNewInvitee({
                email: '',
                userId: null,
              });
            }}
          >
            {isLoading ? <LoadingOutlined className='mr-1' /> : null}
            Invite
          </Button>
        </div>
        {emailExisted ? (
          <Alert
            type={emailExisted === 'User existed' ? 'info' : 'warning'}
            message={emailExisted}
          />
        ) : null}
      </Space>
      <Space direction='vertical' size='middle'>
        <div>Who can access</div>
        <Space direction='vertical' size='small'>
          {invitees.map((invitee: any) => (
            <Space
              direction='horizontal'
              className='w-full flex justify-between'
            >
              <Space direction='horizontal'>
                <Icon
                  presetIcon={presetIcons}
                  iconUrl={invitee.icon_url}
                  size='medium'
                />
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
          type='default'
          icon={<LinkOutlined />}
          onClick={() => {
            navigator.clipboard.writeText(publicUrl);
            Modal.success({
              title: 'Url copied!',
              content: `"${publicUrl}" is copied to your clipboard`,
            });
          }}
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
  const { orgIdString, versionIdString } = useParams();
  const publicUrl = `${baseUrl}/public/${orgIdString}/${createIdString(
    workflow.title || '',
    workflow.id?.toString() || ''
  )}/${versionIdString}`;
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
          value={`${baseUrl}/public/${createIdString(
            workflow.title || '',
            workflow.id?.toString() || ''
          )}`}
        />
        <Button
          type='default'
          icon={<LinkOutlined />}
          onClick={() => {
            navigator.clipboard.writeText(publicUrl);
            Modal.success({
              title: 'Url copied!',
              content: `"${publicUrl}" is copied to your clipboard`,
            });
          }}
        >
          Copy link
        </Button>
      </Space.Compact>
      {env === 'dev' ? (
        <></>
      ) : // <Space className='w-full bg-zinc-100 justify-between p-2 rounded-lg'>
      //   <div>Publish to Syncvote community?</div>
      //   <Switch
      //     checked={status === 'PUBLIC_COMMUNITY'}
      //     onClick={(val) => {
      //       setShowShareModal(false);
      //       handleWorkflowStatusChanged({
      //         versionId: workflow?.workflow_version[0]?.id,
      //         status: val ? 'PUBLIC_COMMUNITY' : 'PUBLIC',
      //         onSuccess: () => {
      //           Modal.success({
      //             title: 'Success',
      //             content: `Workflow ${
      //               val
      //                 ? 'is published to community'
      //                 : 'is no longer published to community'
      //             }!`,
      //           });
      //         },
      //         onError: () => {
      //           Modal.error({
      //             title: 'Error',
      //             content: 'Something went wrong, cannot change status',
      //           });
      //         },
      //       });
      //     }}
      //   />
      // </Space>
      null}

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
        {env === 'dev' ? (
          <Button type='primary' disabled>
            Publish new changes
          </Button>
        ) : null}
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

const PublishTemplate = ({ workflow }: { workflow: any }) => {
  const { orgIdString } = useParams();
  const orgId = extractIdFromIdString(orgIdString);
  const [showModalEditTemplate, setShowModalEditTemplate] = useState(false);
  const [showModalChooseTemplate, setShowModalChooseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>({});
  const [editingTemplateId, setEditingTemplateId] = useState(-1);

  return (
    <>
      <Space direction='vertical' className='w-full'>
        <ModalEditTemplate
          templateId={editingTemplateId}
          open={showModalEditTemplate}
          onCancel={() => {
            setShowModalEditTemplate(false);
          }}
          template={selectedTemplate}
          selectedOrgId={orgId}
          workflow={workflow}
        />

        <ModalChooseTemplate
          open={showModalChooseTemplate}
          onOk={(template: any) => {
            setEditingTemplateId(template.id);
            setSelectedTemplate(template);
            setShowModalEditTemplate(true);
            setShowModalChooseTemplate(false);
          }}
          onCancel={() => {
            setShowModalChooseTemplate(false);
          }}
        />
        <>
          {/* <Input className='w-full h-28' value={''}>
            'Publish a version of this file to the Community for the public to
            duplicate and use'
          </Input> */}
          <Input
            className='w-full h-28'
            prefix={
              <div className='flex-col'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'
                    stroke='#6200EE'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M2 12H22'
                    stroke='#6200EE'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z'
                    stroke='#6200EE'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <br />
                <span className='text-[#6200EE]'>
                  Publish a version of this file to the Community for the public
                  to <br /> duplicate and use
                </span>
              </div>
            }
          />
          <div className='flex'>
            <Button
              className='bg-[#6200EE] text-[#E3E3E2] h-10 w-1/2 mr-8'
              onClick={() => {
                setShowModalChooseTemplate(true);
              }}
            >
              Replace another template
            </Button>
            <Button
              className='bg-[#6200EE] text-[#E3E3E2] h-10 w-1/2'
              onClick={() => {
                setShowModalEditTemplate(true);
              }}
            >
              Publish a new template
            </Button>
          </div>
        </>
      </Space>
    </>
  );
};

const ShareModal = ({
  workflow,
  showShareModal,
  setShowShareModal,
  handleWorkflowStatusChanged,
  onClose = () => {},
}: {
  workflow: IWorkflow;
  showShareModal: boolean;
  setShowShareModal: (data: any) => void;
  handleWorkflowStatusChanged: (status: any) => void;
  onClose?: () => void;
}) => {
  const items: TabsProps['items'] =
    env === 'dev'
      ? [
          // {
          //   key: '1',
          //   label: 'Invite',
          //   children: <InviteTab workflow={workflow} />,
          // },
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
          {
            key: '3',
            label: 'Community',
            children: <PublishTemplate workflow={workflow} />,
          },
        ]
      : [
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
          {
            key: '3',
            label: 'Community',
            children: <PublishTemplate workflow={workflow} />,
          },
        ];
  return (
    <Modal
      open={showShareModal}
      title={null}
      onCancel={() => {
        setShowShareModal(false);
        onClose();
      }}
      footer={null}
    >
      <Tabs defaultActiveKey='1' items={items} />
    </Modal>
  );
};

export default ShareModal;

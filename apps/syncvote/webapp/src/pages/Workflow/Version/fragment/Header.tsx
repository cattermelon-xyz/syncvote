import { L } from '@utils/locales/L';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import { supabase, useGetDataHook } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { extractIdFromIdString, getImageUrl } from 'utils';
import { Button, Divider, Drawer, Modal, Popover, Space, Timeline } from 'antd';
import {
  BellOutlined,
  FolderOutlined,
  SaveOutlined,
  CheckOutlined,
  EllipsisOutlined,
  QuestionCircleOutlined,
  ShareAltOutlined,
  EyeOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { Icon } from 'icon';
import EditWorkflow from '@pages/Workflow/BluePrint/fragment/EditWorkflow';
import {
  deleteAWorkflow,
  updateAWorkflowInfo,
  upsertWorkflowVersion,
} from '@dal/data';
import moment from 'moment';
import VersionHistoryDialog from './VersionHistoryDialog';
import ShareModal from './ShareModal';
import { GraphViewMode, shortenString } from 'directed-graph';
import AvatarAndNoti from '@layout/fragments/AvatarAndNoti';
import { config } from '@dal/config';
import { GrOverview } from 'react-icons/gr';
import parse from 'html-react-parser';
import PhaseDrawer from './PhaseDrawer';
const env = import.meta.env.VITE_ENV;

type HeaderProps = {
  session: any;
  workflow: any;
  dataChanged: boolean;
  handleSave: (mode: 'data' | 'info' | undefined, changedData?: any) => void;
  lastSaved: number;
  handleDownloadImage: (data: any) => void;
  viewMode: GraphViewMode;
  setViewMode: (data: GraphViewMode) => void;
};

function Header({
  session,
  workflow,
  dataChanged,
  handleSave,
  lastSaved,
  handleDownloadImage,
  viewMode,
  setViewMode,
}: HeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orgIdString, workflowIdString, versionIdString } = useParams();
  const workflowId = extractIdFromIdString(workflowIdString);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const handleClearStore = () => {};
  const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams('');
  const cp = searchParams.get('cp');
  const presetIcons = useGetDataHook({
    configInfo: config.queryPresetIcons,
  }).data;

  const handleSaveWorkflowInfo = async ({
    title,
    desc,
    iconUrl,
    bannerUrl,
  }: {
    title?: string | undefined;
    desc?: string | undefined;
    iconUrl?: string | undefined;
    bannerUrl?: string | undefined;
  }) => {
    const toUpdate: any = {};
    if (title && title !== workflow.title) toUpdate.title = title;
    if (desc && desc !== workflow.desc) toUpdate.desc = desc;
    if (iconUrl && iconUrl !== workflow.icon_url) toUpdate.iconUrl = iconUrl;
    if (bannerUrl && bannerUrl !== workflow.banner_url)
      toUpdate.bannerUrl = bannerUrl;
    await updateAWorkflowInfo({
      info: {
        id: workflowId,
        ...toUpdate,
      },
      dispatch,
      onSuccess: () => {},
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Failed to update workflow info',
        });
      },
    });
  };
  const handleWorkflowStatusChanged = async ({
    versionId,
    status,
    onSuccess,
    onError,
  }: {
    versionId: number;
    status: string;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
  }) => {
    const workflowVersion = {
      versionId,
      workflowId,
      status,
    };
    await upsertWorkflowVersion({
      dispatch,
      mode: 'info',
      workflowVersion,
      onSuccess: (data) => {
        onSuccess(data);
      },
      onError: (error) => {
        Modal.error({
          title: 'Error',
          content: 'Failed to update workflow status',
        });
        onError(error);
      },
    });
  };

  const handleDeleteWorkflow = async () => {
    deleteAWorkflow({
      workflow: workflow,
      dispatch,
      onSuccess: () => {
        Modal.success({
          title: 'Success',
          content: 'Workflow deleted',
          maskClosable: false,
          onOk: () => {
            navigate(`/my-spaces/${orgIdString}`);
          },
        });
      },
      onError: () => {
        Modal.error({
          title: 'Error',
          content: 'Failed to delete workflow',
        });
      },
    });
  };
  const [showOverView, setShowOverView] = useState(cp === 'overview' || false);
  return (
    <>
      <PhaseDrawer
        workflow={workflow}
        shown={showOverView}
        setShown={setShowOverView}
      />
      <EditWorkflow
        open={showWorkflowPanel}
        setOpen={setShowWorkflowPanel}
        workflow={workflow}
        onSave={handleSaveWorkflowInfo}
        onStatusChange={handleWorkflowStatusChanged}
        handleSave={handleSave}
      />
      <VersionHistoryDialog
        workflow={workflow}
        visible={showVersionHistory}
        onCancel={() => setShowVersionHistory(false)}
      />
      <ShareModal
        workflow={workflow}
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        handleWorkflowStatusChanged={handleWorkflowStatusChanged}
      />
      <VersionHistoryDialog
        workflow={workflow}
        visible={showVersionHistory}
        onCancel={() => setShowVersionHistory(false)}
      />
      <div
        className={`flex justify-between items-center p-3 h-18 w-full border-b-b_1 border-gray-normal font-sans z-20 bg-white border-solid`}
      >
        <Space
          className='flex items-center'
          direction='horizontal'
          size='middle'
        >
          <div
            onClick={() => {
              handleClearStore();
              navigate('/');
            }}
          >
            <div className='flex items-center cursor-pointer gap-2'>
              <LogoSyncVote />
            </div>
          </div>
          <Divider type='vertical' />
          <div
            className='p-1 rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer'
            onClick={() => navigate(`/${orgIdString}`)}
          >
            <FolderOutlined className='stroke-2' />
          </div>
          <Space
            direction='horizontal'
            size='small'
            className='cursor-pointer hover:text-violet-500'
            onClick={() => setShowWorkflowPanel(true)}
          >
            <Icon
              presetIcon={presetIcons}
              iconUrl={workflow?.icon_url}
              size='medium'
            />
            <div className='flex items-center font-semibold mr-4 max-w-md'>
              {workflow?.title}
            </div>
          </Space>
        </Space>
        <Space
          className='flex items-center justify-end'
          direction='horizontal'
          size='small'
        >
          {viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION ? (
            <>
              <Space direction='horizontal'>
                {dataChanged ? (
                  <div>
                    <Button
                      type='primary'
                      shape='circle'
                      icon={<SaveOutlined />}
                      className='text-violet-500 bg-violet-100'
                      onClick={() => handleSave('data')}
                    />
                  </div>
                ) : (
                  <div className='p-1 rounded-full bg-green-100 w-[24px] h-[24px] flex items-center'>
                    <CheckOutlined className='text-green-500' />
                  </div>
                )}
                <div className='text-zinc-500 text-xs flex truncate'>
                  {lastSaved !== -1 ? moment(lastSaved).fromNow() : ''}
                </div>
              </Space>
              <Divider type='vertical' />
            </>
          ) : null}
          <Space direction='horizontal' size='small'>
            <Button
              type='default'
              className={`flex justify-center items-center text-violet-500 bg-violet-100 ${
                viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION
                  ? `border-0`
                  : `border-1 border-violet-500`
              } `}
              icon={<EyeOutlined />}
              onClick={() => {
                if (env === 'production') {
                  window.open(
                    `/public/${orgIdString}/${workflowIdString}/${versionIdString}`,
                    '_blank'
                  );
                } else if (env === 'dev') {
                  window.open(
                    `/public/${orgIdString}/${workflowIdString}/${versionIdString}`,
                    '_blank'
                  );
                  setViewMode(
                    viewMode === GraphViewMode.EDIT_WORKFLOW_VERSION
                      ? GraphViewMode.VIEW_ONLY
                      : GraphViewMode.EDIT_WORKFLOW_VERSION
                  );
                }
              }}
            >
              Preview
            </Button>
            <Button
              type='primary'
              className='flex justify-center items-center'
              icon={<ShareAltOutlined />}
              onClick={() => setShowShareModal(true)}
            >
              Share
            </Button>
            {env === 'dev' ? (
              <Button
                type='default'
                className='flex justify-center items-center text-violet-500 bg-violet-100 border-0'
                icon={<QuestionCircleOutlined />}
                onClick={() => {
                  window.open('https://docs.syncvote.com', '_blank');
                }}
              />
            ) : null}
            <Popover
              trigger='hover'
              content={
                <Space direction='vertical' className='w-full'>
                  <Button
                    type='link'
                    icon={<GrOverview />}
                    className='flex items-center p-0 m-0 text-zinc-500 hover:text-violet-500'
                    onClick={() => setShowOverView(true)}
                  >
                    Overview
                  </Button>
                  <Button
                    type='link'
                    icon={<ClockCircleOutlined />}
                    className='flex items-center p-0 m-0 text-zinc-500 hover:text-violet-500'
                    onClick={() => setShowVersionHistory(true)}
                  >
                    History
                  </Button>
                  <Button
                    type='link'
                    icon={<DownloadOutlined />}
                    className='flex items-center p-0 m-0 text-zinc-500 hover:text-violet-500'
                    onClick={() => handleDownloadImage(true)}
                  >
                    Download Image
                  </Button>
                  <Button
                    type='link'
                    icon={<CopyOutlined />}
                    className='flex items-center p-0 m-0 text-zinc-500 hover:text-violet-500'
                    disabled
                  >
                    Duplicate new
                  </Button>
                  <Button
                    type='link'
                    danger
                    icon={<DeleteOutlined />}
                    className='flex items-center p-0 m-0 text-zinc-500 hover:text-violet-500'
                    onClick={handleDeleteWorkflow}
                  >
                    Delete
                  </Button>
                </Space>
              }
            >
              <Button
                type='default'
                className='flex justify-center items-center text-violet-500 bg-violet-100 border-0'
                icon={<EllipsisOutlined />}
              />
            </Popover>
          </Space>
          <Divider type='vertical' />
          <AvatarAndNoti user={session?.user} />
        </Space>
      </div>
    </>
  );
}

export default Header;

import Logo from '@assets/icons/svg-icons/Logo';
import { L } from '@utils/locales/L';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { sliceAddressToken } from '@utils/helpers';
// import { AddressToken } from '@utils/mockData/addressToken';
import LogoSyncVote from '@assets/icons/svg-icons/LogoSyncVote';
import { supabase } from '@utils/supabaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { extractIdFromIdString, getImageUrl } from '@utils/helpers';
import { Avatar, Button, Divider, Modal, Space, Typography } from 'antd';
import { HomeOutlined, BellOutlined, FolderOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import Icon from '@components/Icon/Icon';
import Paragraph from 'antd/es/skeleton/Paragraph';
import EditWorkflow from '@pages/Workflow/BluePrint/fragment/EditWorkflow';
import { updateAWorkflowInfo, upsertWorkflowVersion } from '@middleware/data';
import { IWorkflowVersion } from '@types';

type HeaderProps = {
  session: any;
  workflow: any;
};

enum Pages {
  ORG_HOME,
  ORG_SELECTOR,
  ORG_SETTING,
  UNKNOWN,
}

function Header({ session, workflow }: HeaderProps) {
  const dispatch = useDispatch();
  const { orgs } = useSelector((state: any) => state.orginfo);
  const navigate = useNavigate();
  const { orgIdString, workflowIdString } = useParams();
  const workflowId = extractIdFromIdString(workflowIdString);
  const orgId = extractIdFromIdString(orgIdString);
  const [currentOrg, setCurrentOrg] = useState(
    orgs.find((org: any) => org.id === orgId)
  );
  const handleClearStore = () => {};
  const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);
  const handleSaveWorkflowInfo = async ({
    title,
    desc,
    iconUrl,
  }: {
    title?: string | undefined;
    desc?: string | undefined;
    iconUrl?: string | undefined;
  }) => {
    const toUpdate: any = {};
    if (title && title !== workflow.title) toUpdate.title = title;
    if (desc && desc !== workflow.desc) toUpdate.desc = desc;
    if (iconUrl && iconUrl !== workflow.icon_url) toUpdate.iconUrl = iconUrl;
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
  return (
    <>
      <EditWorkflow
        open={showWorkflowPanel}
        setOpen={setShowWorkflowPanel}
        workflow={workflow}
        onSave={handleSaveWorkflowInfo}
        onStatusChange={handleWorkflowStatusChanged}
      />
      <div
        className={`flex justify-between items-center px-[32px] md:px-p_1 h-20 w-full border-b-b_1 border-gray-normal font-sans z-20 bg-white`}
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
            <div className='flex items-center'>
              <LogoSyncVote />
              <div className='text-violet-700 text-[20px] font-bold '>
                Syncvote
              </div>
            </div>
          </div>
          <Divider type='vertical' />
          <div
            className='px-3 py-2 rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer'
            onClick={() => navigate(`/my-spaces/${orgIdString}`)}
          >
            <FolderOutlined className='stroke-2' />
          </div>
          <Space
            direction='horizontal'
            size='small'
            className='cursor-pointer'
            onClick={() => setShowWorkflowPanel(true)}
          >
            <Icon iconUrl={workflow?.icon_url} size='medium' />
            <div className='flex items-center font-bold'>{workflow?.title}</div>
          </Space>
        </Space>
        <div className='flex w-w_3 items-center justify-end gap-3'>
          <div className='flex rounded-full h-[36px] w-[36px] bg-gray-100 justify-center cursor-pointer'>
            <BellOutlined style={{ fontSize: '20px' }} />
          </div>
          <div
            className='cursor-pointer flex items-center'
            onClick={async () => {
              dispatch(startLoading({}));
              await supabase.auth.signOut();
              dispatch(finishLoading({}));
              navigate('/login');
            }}
            title={L('clickToLogout')}
          >
            <img
              src={session?.user?.user_metadata?.avatar_url}
              alt='user_avatar'
              className='w-[36px] h-[36px] rounded-full inline-block mr-2'
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

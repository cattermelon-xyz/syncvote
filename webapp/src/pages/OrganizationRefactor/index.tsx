import { useState, useEffect } from 'react';
import Button from '@components/Button/Button';
import { L } from '@utils/locales/L';
import { Dropdown, Layout, MenuProps, Space } from 'antd';
import {
  PlusOutlined,
  DownOutlined,
  HomeOutlined,
  FolderOutlined,
  ShareAltOutlined,
  LogoutOutlined,
  FileOutlined,
} from '@ant-design/icons';
import HomeButton from '@components/HomeScreen/HomeButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '@utils/supabaseClient';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import Home from './pages/Home';
import MySpace from './pages/MySpace';
import SharedSpace from './pages/SharedSpace';
import CreateSpaceModal from './fragments/CreateSpaceModal';
import CreateWorkflowModal from './fragments/CreateWorkflowModal';
import SpaceContentLayout from './fragments/SpaceContentLayout';
import WorkflowsOfASpace from './pages/WorkflowsOfASpace';

const { Sider } = Layout;

const SpacePage = () => {
  const [openModalCreateWorkspace, setOpenModalCreateWorkspace] =
    useState(false);
  const [openModalCreateWorkflow, setOpenModalCreateWorkflow] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('listHome');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname.startsWith('/my-spaces')) {
      if (location.pathname === '/my-spaces') {
        setCurrentStatus('listMySpace');
      } else {
        setCurrentStatus('WorkflowOfAMySpace');
      }
    } else if (location.pathname.startsWith('/shared-spaces')) {
      if (location.pathname === '/shared-spaces') {
        setCurrentStatus('listSharedSpaces');
      } else {
        setCurrentStatus('WorkflowOfASharedSpace'); // Trạng thái mới cho trường hợp URL chứa spaceId
      }
    } else {
      setCurrentStatus('listHome');
    }
  }, [location.pathname]);

  const items: MenuProps['items'] = [
    {
      label: (
        <>
          <FileOutlined className='text-base mr-1' />{' '}
          <span className='text-[17px]'>Worflow</span>
        </>
      ),
      key: '0',
    },
    {
      label: (
        <div>
          <FolderOutlined className='text-base mr-1' />{' '}
          <span className='text-sm'>Workspace</span>
        </div>
      ),
      key: '1',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key === '0') {
      setOpenModalCreateWorkflow(true);
    } else if (e?.key === '1') {
      setOpenModalCreateWorkspace(true);
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      <div className='flex h-full'>
        <Sider
          style={{ borderRight: '1px solid #E3E3E2' }}
          theme='light'
          className='overflow-auto border-r flex flex-col relative pr-5'
          width='18.4%'
        >
          <Dropdown menu={menuProps} trigger={['click']} className='w-48'>
            <Button
              startIcon={<PlusOutlined />}
              endIcon={<DownOutlined />}
              className='my-6 ml-8 mr-4'
            >
              <Space>{L('createNew')}</Space>
            </Button>
          </Dropdown>
          <div className='flex flex-col pl-4'>
            <HomeButton
              startIcon={<HomeOutlined className='text-2xl' />}
              onClick={() => {
                setCurrentStatus('listHome');
                navigate('/');
              }}
              isFocused={currentStatus === 'listHome'}
            >
              <span className='text-base'>{L('home')}</span>
            </HomeButton>
            <HomeButton
              startIcon={<FolderOutlined className='text-2xl' />}
              onClick={() => {
                setCurrentStatus('listMySpace');
                navigate('/my-spaces');
              }}
              isFocused={currentStatus === 'listMySpace'}
            >
              <span className='text-base'>{L('mySpace')}</span>
            </HomeButton>
            <HomeButton
              startIcon={<ShareAltOutlined className='text-2xl' />}
              onClick={() => {
                setCurrentStatus('listSharedSpaces');
                navigate('/shared-spaces');
              }}
              isFocused={currentStatus === 'listSharedSpaces'}
            >
              <span className='text-base'>{L('sharedSpaces')}</span>
            </HomeButton>
          </div>
          <div
            className='flex gap-3 pl-8 absolute bottom-12 cursor-pointer'
            onClick={async () => {
              dispatch(startLoading({}));
              await supabase.auth.signOut();
              dispatch(finishLoading({}));
              navigate('/login');
            }}
          >
            <LogoutOutlined />
            <p> {L('logOut')}</p>
          </div>
        </Sider>
        <SpaceContentLayout>
          {currentStatus === 'listHome' ? (
            <Home />
          ) : currentStatus === 'listMySpace' ? (
            <MySpace />
          ) : currentStatus === 'listSharedSpaces' ? (
            <SharedSpace />
          ) : currentStatus === 'WorkflowOfAMySpace' ? (
            <WorkflowsOfASpace />
          ) : currentStatus === 'WorkflowOfASharedSpace' ? (
            <WorkflowsOfASpace />
          ) : (
            <></>
          )}
        </SpaceContentLayout>

        <CreateSpaceModal
          open={openModalCreateWorkspace}
          onClose={() => setOpenModalCreateWorkspace(false)}
        />

        <CreateWorkflowModal
          open={openModalCreateWorkflow}
          onClose={() => setOpenModalCreateWorkflow(false)}
          setOpenCreateWorkspaceModal={() => {
            setOpenModalCreateWorkflow(false);
            setOpenModalCreateWorkspace(true);
          }}
        />
      </div>
      {currentStatus === 'listHome' && (
        <>
          <hr />
          <p>Hello world</p>
        </>
      )}
    </>
  );
};

export default SpacePage;

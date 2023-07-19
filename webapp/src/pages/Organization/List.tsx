import { useState, useEffect } from 'react';
import Button from '@components/Button/Button';
import { L } from '@utils/locales/L';
import { Dropdown, Layout, Space, MenuProps } from 'antd';
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
import ListHome from './list/ListHome';
import ListMySpace from './list/ListMySpace';
import WorkflowOfAMySpace from './list/WorkflowOfAMySpace';
import ListSharedSpaces from './list/ListSharedSpaces';
import CreateSpaceModal from './list/CreateSpaceModal';
import WorkflowOfASharedSpace from './list/WorkflowOfASharedSpace';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '@utils/supabaseClient';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import React from 'react';
import CreateWorkflowModal from './list/CreateWorkflowModal';

const { Sider } = Layout;

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Organization = () => {
  let query = useQuery();
  const [openModalCreateWorkspace, setOpenModalCreateWorkspace] =
    useState(false);
  const [openModalCreateWorkflow, setOpenModalCreateWorkflow] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('listHome');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (query.get('action') === 'new-workflow') {
      setOpenModalCreateWorkflow(true);
    }

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
    <div className='flex w-full rtl'>
      <Sider
        style={{ borderRight: '1px solid #E3E3E2' }}
        theme='light'
        className='overflow-auto min-h-screen border-r flex flex-col relative pr-5'
        width='18.3%'
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
      <div className='w-4/5 flex-grow my-8'>
        <div className='w-3/4 mx-auto'>
          {currentStatus === 'listHome' ? (
            <ListHome />
          ) : currentStatus === 'listMySpace' ? (
            <ListMySpace />
          ) : currentStatus === 'listSharedSpaces' ? (
            <ListSharedSpaces />
          ) : currentStatus === 'WorkflowOfAMySpace' ? (
            <WorkflowOfAMySpace />
          ) : currentStatus === 'WorkflowOfASharedSpace' ? (
            <WorkflowOfASharedSpace />
          ) : (
            <></>
          )}
        </div>
      </div>
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
  );
};

export default Organization;

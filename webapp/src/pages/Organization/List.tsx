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
import CreateWorkflowModal from './list/CreateWorkflowModal';

const { Sider } = Layout;

const Organization = () => {
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

  const showModalCreateWorkspace = () => {
    setOpenModalCreateWorkspace(true);
  };

  const closeModalCreateWorkspace = () => {
    setOpenModalCreateWorkspace(false);
  };

  const showModalCreateWorkflow = () => {
    setOpenModalCreateWorkflow(true);
  };

  const closeModalCreateWorkflow = () => {
    setOpenModalCreateWorkflow(false);
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <p>
          <FileOutlined /> Workflow
        </p>
      ),
      key: '0',
    },
    {
      label: (
        <p>
          <FolderOutlined /> Workspace
        </p>
      ),
      key: '1',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key === '0') {
      showModalCreateWorkflow();
    } else if (e?.key === '1') {
      showModalCreateWorkspace();
    }
    console.log('click', e?.key);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className='flex w-full'>
      <Sider
        theme='light'
        className='overflow-auto min-h-screen border-r w-1/5 flex flex-col relative'
      >
        <Dropdown menu={menuProps} trigger={['click']}>
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
            startIcon={<HomeOutlined />}
            onClick={() => {
              setCurrentStatus('listHome');
              navigate('/');
            }}
            isFocused={currentStatus === 'listHome'}
          >
            {L('home')}
          </HomeButton>
          <HomeButton
            startIcon={<FolderOutlined />}
            onClick={() => {
              setCurrentStatus('listMySpace');
              navigate('/my-spaces');
            }}
            isFocused={currentStatus === 'listMySpace'}
          >
            {L('mySpace')}
          </HomeButton>
          <HomeButton
            startIcon={<ShareAltOutlined />}
            onClick={() => {
              setCurrentStatus('listSharedSpaces');
              navigate('/shared-spaces');
            }}
            isFocused={currentStatus === 'listSharedSpaces'}
          >
            {L('sharedSpaces')}
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
        onClose={closeModalCreateWorkspace}
      />

      <CreateWorkflowModal
        open={openModalCreateWorkflow}
        onClose={closeModalCreateWorkflow}
      />
    </div>
  );
};

export default Organization;

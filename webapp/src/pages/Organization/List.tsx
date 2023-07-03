import { useState, useEffect } from 'react';
import Button from '@components/Button/Button';
import { L } from '@utils/locales/L';
import { Layout } from 'antd';
import {
  PlusOutlined,
  DownOutlined,
  HomeOutlined,
  FolderOutlined,
  ShareAltOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import HomeButton from '@components/HomeScreen/HomeButton';
import ListHome from './list/ListHome';
import ListMySpace from './list/ListMySpace';
import ListSharedSpaces from './list/ListSharedSpaces';
import CreateSpaceModal from './list/CreateSpaceModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '@utils/supabaseClient';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';

const { Sider } = Layout;

const Organization = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('listHome');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    switch (location.pathname) {
      case '/my-spaces':
        setCurrentStatus('listMySpace');
        break;
      case '/shared-spaces':
        setCurrentStatus('listSharedSpaces');
        break;
      default:
        setCurrentStatus('listHome');
    }
  }, [location.pathname]);

  const showModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div className='flex w-full'>
      <Sider
        theme='light'
        className='overflow-auto min-h-screen border-r w-1/5 flex flex-col relative'
      >
        <Button
          startIcon={<PlusOutlined />}
          endIcon={<DownOutlined />}
          className='my-6 ml-8 mr-4'
          onClick={showModal}
        >
          {L('createNew')}
        </Button>
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
          className='flex gap-3 pl-8 absolute bottom-4 cursor-pointer'
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
          ) : (
            <></>
          )}
        </div>
      </div>
      <CreateSpaceModal open={openModal} onClose={closeModal} />
    </div>
  );
};

export default Organization;

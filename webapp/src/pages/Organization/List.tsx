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
} from '@ant-design/icons';
import HomeButton from '@components/HomeScreen/HomeButton';
import ListHome from './list/ListHome';
import ListMySpace from './list/ListMySpace';
import ListSharedSpaces from './list/ListSharedSpaces';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Organization = () => {
  const [currentStatus, setCurrentStatus] = useState('listHome');
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className='flex w-full'>
      <Sider theme='light' className='overflow-auto h-screen border-r w-1/5'>
        <Button
          startIcon={<PlusOutlined />}
          endIcon={<DownOutlined />}
          className='my-6 ml-8 mr-4'
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
      </Sider>
      <div className='w-4/5 flex-grow'>
        {currentStatus === 'listHome' && (
          <div className='w-full'>
            <ListHome />
          </div>
        )}
        {currentStatus === 'listMySpace' && (
          <div className='w-full'>
            <ListMySpace />
          </div>
        )}
        {currentStatus === 'listSharedSpaces' && (
          <div className='w-full'>
            <ListSharedSpaces />
          </div>
        )}
      </div>
    </div>
  );
};

export default Organization;

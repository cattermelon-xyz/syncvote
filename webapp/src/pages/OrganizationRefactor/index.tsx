import React from 'react';
import { Tabs, Button } from 'antd';
import { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { Footer } from 'antd/es/layout/layout';
import './styles.scss';
import {
  HomeOutlined,
  FolderOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

import Home from './pages/Home';
import MySpace from './pages/MySpace';
import ShareSpace from './pages/SharedSpace';
import WorkflowsOfASpace from './pages/WorkflowsOfASpace';

export interface PageProps {
  tabKey: string;
  type?: string;
}

const SpacePage: React.FC<PageProps> = (props) => {
  const { tabKey, type } = props;
  console.log('type', type);

  const tabItems: TabsProps['items'] = [
    {
      key: '/',
      label: (
        <>
          <HomeOutlined /> Home
        </>
      ),
      children: <Home />,
    },
    {
      key: '/my-spaces',
      label: (
        <>
          <>
            <FolderOutlined /> My Spaces
          </>
        </>
      ),
      children: type === 'list_space' ? <MySpace /> : <WorkflowsOfASpace />,
    },
    {
      key: '/shared_spaces',
      label: (
        <>
          <ShareAltOutlined /> Shared Spaces
        </>
      ),
      children: type === 'list_space' ? <ShareSpace /> : <WorkflowsOfASpace />,
    },
  ];
  const navigate = useNavigate();
  // const tabItemsMemo = React.useMemo(() => tabItems, [type]);

  const handleNavigate = (path: string) => navigate(path);

  return (
    <React.Fragment>
      <Tabs
        className='tabs-homepage-config-panel w-full h-full pl-4'
        tabBarStyle={{ maxHeight: '95%' }}
        size='large'
        tabPosition='left'
        defaultActiveKey={'/'}
        activeKey={tabKey}
        items={tabItems}
        tabBarExtraContent={{
          left: (
            <Button className='w-[115%] my-4' size='large' type='primary'>
              + Create new
            </Button>
          ),
          right: (
            <Button type='text' className='mt-2 ml-[-30%]'>
              <UploadOutlined className='rotate-90' /> Logout
            </Button>
          ),
        }}
        onChange={handleNavigate}
      />
    </React.Fragment>
  );
};

export default SpacePage;

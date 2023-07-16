import React from 'react';
import { Tabs, Button } from 'antd';
import { ROUTER_SPACE } from './config/route';
import { useNavigate } from 'react-router-dom';
import { tabItems } from './config/navigationConfig';
import { UploadOutlined } from '@ant-design/icons';
export interface PageProps {
  tabKey: string;
}

const SpacePage: React.FC<PageProps> = (props) => {
  const { tabKey } = props;
  const navigate = useNavigate();
  const tabItemsMemo = React.useMemo(() => tabItems, []);

  const handleNavigate = (path: string) => navigate(path);

  return (
    <React.Fragment>
      <Tabs
        className='w-full h-full'
        tabBarStyle={{ maxHeight: '95%' }}
        size='large'
        tabPosition='left'
        defaultActiveKey={ROUTER_SPACE.HOME}
        activeKey={tabKey}
        items={tabItemsMemo}
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

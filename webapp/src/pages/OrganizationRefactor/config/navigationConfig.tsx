import React from 'react';
import type { TabsProps } from 'antd';

import {
  HomeOutlined,
  FolderOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

import { ROUTER_SPACE } from './route';

const Home = React.lazy(() => import('../pages/Home'));

export const tabItems: TabsProps['items'] = [
  {
    key: ROUTER_SPACE.HOME,
    label: (
      <>
        <HomeOutlined /> Home
      </>
    ),
    children: <Home />,
  },
  {
    key: ROUTER_SPACE.MY_SPACES,
    label: (
      <>
        <>
          <FolderOutlined /> My Spaces
        </>
      </>
    ),
    children: `Content of Tab Pane 2`,
  },
  {
    key: ROUTER_SPACE.SHARED_SPACES,
    label: (
      <>
        <ShareAltOutlined /> Shared Spaces
      </>
    ),
    children: `Content of Tab Pane 3`,
  },
];

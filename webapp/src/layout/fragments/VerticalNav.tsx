import {
  DownOutlined,
  FileOutlined,
  FolderOutlined,
  HomeOutlined,
  GlobalOutlined,
  LogoutOutlined,
  PlusOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import CreateSpaceModal from '@components/CreateNewDialog/CreateSpaceModal';
import CreateWorkflowModal from '@components/CreateNewDialog/CreateWorkflowModal';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { current } from '@reduxjs/toolkit';

const VerticalNavButton = ({
  label,
  destinationUrl,
  selected,
  navigate,
}: {
  label: ReactNode;
  destinationUrl: string;
  selected: boolean;
  navigate: (url: string) => void;
}) => {
  return (
    <div
      onClick={() => {
        navigate(destinationUrl);
      }}
      className={`w-full border-0 text-left shadow-transparent py-3 px-4 flex gap-2 hover:text-violet-500 hover:bg-violet-100 rounded-lg ${
        selected ? 'text-violet-500 bg-violet-100' : 'cursor-pointer'
      }`}
    >
      {label}
    </div>
  );
};

const VerticalNav = () => {
  const items: MenuProps['items'] = [
    {
      label: (
        <>
          <FileOutlined className='text-base mr-2' />
          <span className='text-[17px]'>Worflow</span>
        </>
      ),
      key: 'workflow',
    },
    {
      label: (
        <div>
          <FolderOutlined className='text-base mr-2' />
          <span className='text-sm'>Workspace</span>
        </div>
      ),
      key: 'workspace',
    },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key === 'workflow') {
      setOpenModalCreateWorkflow(true);
    } else if (e?.key === 'workspace') {
      setOpenModalCreateWorkspace(true);
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const [openModalCreateWorkflow, setOpenModalCreateWorkflow] = useState(false);
  const [openModalCreateWorkspace, setOpenModalCreateWorkspace] =
    useState(false);
  const navigate = useNavigate();
  const current = useLocation().pathname;
  const navs = [
    {
      label: (
        <>
          <FolderOutlined />
          My workspaces
        </>
      ),
      destinationUrl: '/my-workspaces',
    },
    {
      label: (
        <>
          <ShareAltOutlined />
          Shared workspaces
        </>
      ),
      destinationUrl: '/shared-workspaces',
    },
    {
      label: (
        <>
          <GlobalOutlined />
          Explore
        </>
      ),
      destinationUrl: '/',
    },
  ];
  const selectedNav = navs.find((nav) => nav.destinationUrl === current) || {
    destinationUrl: '',
  };
  return (
    <>
      <CreateSpaceModal
        open={openModalCreateWorkspace}
        onClose={() => setOpenModalCreateWorkspace(false)}
      />
      <CreateWorkflowModal
        open={openModalCreateWorkflow}
        onClose={() => setOpenModalCreateWorkflow(false)}
        setOpenCreateWorkspaceModal={() => setOpenModalCreateWorkflow}
      />
      <Space
        direction='vertical'
        size='large'
        className='w-full flex justify-between h-full'
      >
        <Space direction='vertical' className='w-full'>
          <div className='w-full py-6 px-8'>
            <Dropdown menu={menuProps} trigger={['click']}>
              <Button
                icon={<PlusOutlined />}
                type='primary'
                className='w-48 h-12'
              >
                Create new
                {<DownOutlined />}
              </Button>
            </Dropdown>
          </div>
          <Space direction='vertical' size='small' className='w-full pl-4'>
            {navs.map((nav) => {
              const { label, destinationUrl } = nav;
              return (
                <VerticalNavButton
                  label={label}
                  destinationUrl={destinationUrl}
                  navigate={navigate}
                  selected={selectedNav.destinationUrl === destinationUrl}
                />
              );
            })}
          </Space>
        </Space>
        <Button
          className='w-full border-0 text-left shadow-none ml-8 mb-14'
          type='default'
        >
          <LogoutOutlined />
          Log out
        </Button>
      </Space>
    </>
  );
};

export default VerticalNav;

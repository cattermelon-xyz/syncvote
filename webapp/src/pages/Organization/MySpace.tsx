import React, { useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Empty, MenuProps, Space, Typography } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector } from 'react-redux';
import { queryOrgsAndWorkflowForHome } from '@middleware/data';
import { useDispatch } from 'react-redux';
import SpaceCard from '@components/Card/SpaceCard';
import ListItem from '../../components/ListItem/ListItem';
import WorkflowCard from '@components/Card/WorkflowCard';
import { Skeleton } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import CreateSpaceModal from './list/CreateSpaceModal';
import CreateWorkflowModal from './list/CreateWorkflowModal';
import { FileOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}

interface DataItem {
  title: string;
  [key: string]: any;
}

const MySpace: React.FC = () => {
  const { user } = useSelector((state: any) => state.orginfo);
  const [adminOrgs, setAdminOrgs] = useState<DataItem[]>([]);
  const [workflows, setWorkflows] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [sortOptions, setSortOption] = useState<SortProps>({
    by: '',
    type: 'asc',
  });

  const [sortWorkflowOptions, setSortWorkflowOption] = useState<SortProps>({
    by: '',
    type: 'asc',
  });

  const handleSortSpaceDetail = (options: SortProps) => {
    setSortOption(options);
  };

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortWorkflowOption(options);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModalCreateWorkflow, setOpenModalCreateWorkflow] = useState(
    searchParams.get('action') === 'new-workflow'
  );
  const [openModalCreateWorkspace, setOpenModalCreateWorkspace] =
    useState(false);

  const filterSpaceByOptions = useFilteredData(adminOrgs, sortOptions);
  const filterWorkflowByOptions = useFilteredData(
    workflows,
    sortWorkflowOptions
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const orgs = await queryOrgsAndWorkflowForHome({
        userId: user.id,
        onSuccess: () => {},
        dispatch,
      });
      if (orgs) {
        const adminOrgsData = orgs.filter((org: any) => org.role === 'ADMIN');
        setAdminOrgs(adminOrgsData);
        const allWorkflows = adminOrgsData.flatMap((adminOrg: any) =>
          adminOrg.workflows.map((workflow: any) => ({
            ...workflow,
            org_title: adminOrg.title,
          }))
        );

        setWorkflows(allWorkflows);
      }
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);
  const items: MenuProps['items'] = [
    {
      label: (
        <>
          <FileOutlined className='text-base mr-2' />
          <span className='text-sm'>Worflow</span>
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
      <div className='w-[800px] flex flex-col'>
        <Space direction='horizontal' className='flex justify-between'>
          <p className='text-3xl font-semibold my-8'>{L('mySpace')}</p>
          <Dropdown menu={menuProps} trigger={['click']}>
            <Button icon={<PlusOutlined />} type='primary'>
              Create new
            </Button>
          </Dropdown>
        </Space>
        <section className='w-full mb-8'>
          {loading ? (
            <Skeleton />
          ) : filterWorkflowByOptions && filterSpaceByOptions.length > 0 ? (
            <ListItem
              handleSort={handleSortSpaceDetail}
              items={
                filterSpaceByOptions &&
                filterSpaceByOptions.map((adminOrg, index) => (
                  <SpaceCard
                    key={index}
                    dataSpace={adminOrg}
                    isMySpace={true}
                  />
                ))
              }
              columns={{ xs: 2, md: 3, xl: 4, '2xl': 4 }}
              title={L('spaces')}
            />
          ) : (
            <Empty />
          )}
        </section>
        <section className='w-full mb-8'>
          {loading ? (
            <Skeleton />
          ) : filterWorkflowByOptions && filterWorkflowByOptions.length > 0 ? (
            <ListItem
              handleSort={handleSortWorkflowDetail}
              items={
                filterWorkflowByOptions &&
                filterWorkflowByOptions.map((workflow, index) => (
                  <WorkflowCard key={index} dataWorkflow={workflow} />
                ))
              }
              columns={{ xs: 2, md: 3, xl: 3, '2xl': 3 }}
              title={L('workflows')}
            />
          ) : (
            <Empty />
          )}
        </section>
      </div>
    </>
  );
};

export default MySpace;

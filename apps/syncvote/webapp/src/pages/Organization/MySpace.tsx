import React, { useEffect, useState } from 'react';
import { Button, Dropdown, MenuProps, Space, Tabs, Empty } from 'antd';
import { L } from '@utils/locales/L';
import SpaceCard from '@pages/Organization/fragments/SpaceCard';
import { ListItem } from 'list-item';
import WorkflowCard from '@pages/Workflow/fragments/WorkflowCard';
import { Skeleton } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { FileOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CreateSpaceModal from '@/fragments/CreateNewDialog/CreateSpaceModal';
import CreateWorkflowModal from '@/fragments/CreateNewDialog/CreateWorkflowModal';
import PublicPageRedirect from '@middleware/logic/publicPageRedirect';
import { useGetDataHook } from 'utils';
import { config } from '@dal/config';
import ListProposals from '@pages/Mission/fragments/ListProposals';

const env = import.meta.env.VITE_ENV;

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}

interface DataItem {
  title: string;
  [key: string]: any;
}

const MySpace: React.FC = () => {
  const orgs = useGetDataHook({
    configInfo: config.queryOrgs,
  }).data;

  const [runGetMission, setRunGetMission] = useState(false);

  const user = useGetDataHook({
    configInfo: config.queryUserById,
  }).data;

  const [orgIds, setOrgIds] = useState<any>([]);

  const missionData = useGetDataHook({
    params: {
      orgIds,
    },
    start: runGetMission,
    configInfo: config.queryMission,
    cacheOption: false,
  }).data;

  useEffect(() => {
    if (orgIds && orgIds.length > 0) {
      setRunGetMission(true);
    }
  }, [JSON.stringify(orgIds), setRunGetMission]);

  const [myProposals, setMyProposals] = useState<any[]>([]);
  const [allProposals, setAllProposals] = useState<any[]>([]);
  useEffect(() => {
    if (orgs) {
      const fetchedOrgIds = orgs.map((org: any) => org.id);
      setOrgIds(fetchedOrgIds);
    }
  }, [orgs, myProposals]);

  useEffect(() => {
    if (missionData && user) {
      const missionDataArray = Object.values(missionData);

      const getMyProposals = missionDataArray.filter(
        (mission: any) => mission.creator_id === user.id
      );
      setMyProposals(getMyProposals);
      setAllProposals(missionDataArray);
    }
  }, [missionData, user]);

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
  const [searchParams, setSearchParams] = useSearchParams();

  const [openModalCreateWorkflow, setOpenModalCreateWorkflow] = useState(
    searchParams.get('action') === 'new-workflow'
  );
  const [openModalCreateWorkspace, setOpenModalCreateWorkspace] =
    useState(false);

  const handleSortSpaceDetail = (options: SortProps) => {
    setSortOption(options);
  };

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortWorkflowOption(options);
  };

  const filterSpaceByOptions = useFilteredData(adminOrgs, sortOptions);
  const filterWorkflowByOptions = useFilteredData(
    workflows,
    sortWorkflowOptions
  );
  const fetchData = async () => {
    setLoading(true);
    if (orgs) {
      let adminOrgsData = [];
      if (env === 'production') {
        adminOrgsData = orgs;
      } else {
        adminOrgsData = orgs.filter((org: any) => org.role === 'ADMIN');
      }
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
    const url = PublicPageRedirect.getRedirectUrl();
    if (url) {
      navigate(url);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, orgs]);

  const items: MenuProps['items'] = [
    {
      label: (
        <>
          <FileOutlined className='text-base mr-2' />
          <span className='text-sm'>Workflow</span>
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

  const tabsItems = [
    {
      key: '1',
      label: L('spaces'),
      children:
        filterSpaceByOptions && filterSpaceByOptions.length > 0 ? (
          <ListItem
            handleSort={handleSortSpaceDetail}
            items={
              filterSpaceByOptions &&
              filterSpaceByOptions.map((adminOrg, index) => (
                <SpaceCard
                  key={index}
                  dataSpace={adminOrg}
                  isOwner={adminOrg.role === 'ADMIN'}
                />
              ))
            }
            columns={{ xs: 2, md: 3, xl: 4, '2xl': 4 }}
          />
        ) : (
          <Space className='w-full' direction='vertical'>
            <Empty />
          </Space>
        ),
    },
    {
      key: '2',
      label: L('workflows'),
      children:
        filterWorkflowByOptions && filterWorkflowByOptions.length > 0 ? (
          <ListItem
            handleSort={handleSortWorkflowDetail}
            items={
              filterWorkflowByOptions &&
              filterWorkflowByOptions.map((workflow, index) => (
                <WorkflowCard key={index} dataWorkflow={workflow} />
              ))
            }
            columns={{ xs: 2, md: 3, xl: 3, '2xl': 3 }}
          />
        ) : (
          <Space className='w-full' direction='vertical'>
            <Empty />
          </Space>
        ),
    },
  ];

  if (env !== 'production') {
    tabsItems.push({
      key: '3',
      label: 'Proposal',
      children: myProposals && allProposals && (
        <div className='flex flex-col gap-6'>
          <ListProposals
            listProposals={myProposals}
            title={'My proposals'}
            type='owner'
          />
          <ListProposals
            listProposals={allProposals}
            title={'All proposals'}
            type='all'
          />
        </div>
      ),
    });
  }

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
      <div className='xs:w-[350px] sm:w-[550px] md:w-[720px] lg:w-[800px] flex flex-col'>
        <Space direction='horizontal' className='flex justify-between'>
          <p className='text-3xl font-semibold my-8'>{L('mySpace')}</p>
          {env === 'production' ? (
            <Dropdown menu={menuProps} trigger={['click']}>
              <Button icon={<PlusOutlined />} type='primary'>
                Create new
              </Button>
            </Dropdown>
          ) : null}
        </Space>
      </div>
      <div className='lg:w-[800px] md:w-[640px] sm:w-[400px]'>
        {loading ? <Skeleton /> : <Tabs items={tabsItems} />}
      </div>
    </>
  );
};

export default MySpace;

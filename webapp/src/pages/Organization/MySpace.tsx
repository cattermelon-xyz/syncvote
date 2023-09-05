import React, { useEffect, useState } from 'react';
import { L } from '@utils/locales/L';
import SpaceCard from '@pages/Organization/fragments/SpaceCard';
import ListItem from '../../components/ListItem/ListItem';
import WorkflowCard from '@pages/Workflow/fragments/WorkflowCard';
import { Skeleton } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PublicPageRedirect from '@middleware/logic/publicPageRedirect';
import { useGetDataHook } from '@dal/dal';
import { config } from '@dal/config';

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
  
  const { data: orgs } = useGetDataHook({
    cacheOption: true,
    configInfo: config.queryOrgs,
  });

  const { data: user } = useGetDataHook({
    cacheOption: true,
    configInfo: config.queryUserById,
  });

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
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
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
        // Querry from org
        setWorkflows(allWorkflows);

        // await getWorkflowFromEditor({
        //   userId: user.id,
        //   dispatch,
        //   onSuccess: (data: any) => {
        //     console.log('Editor', data);
        //   },
        //   onError: (error: any) => {
        //     console.log(error);
        //   },
        // });
        // await getWorkflowFromEditor({
        //   userId: user.id,
        //   dispatch,
        //   onSuccess: (data: any) => {
        //     console.log('Editor', data);
        //   },
        //   onError: (error: any) => {
        //     console.log(error);
        //   },
        // });

        // Querry workflow from workflow_version_editor
      }
      setLoading(false);
      const url = PublicPageRedirect.getRedirectUrl();
      if (url) {
        navigate(url);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, orgs]);

  return (
    <>
      <div className='xs:w-[350px] sm:w-[550px] md:w-[720px] lg:w-[800px] flex flex-col'>
        <section className='w-full mb-8'>
          {loading ? (
            <Skeleton />
          ) : (
            <ListItem
              handleSort={handleSortSpaceDetail}
              items={
                filterSpaceByOptions! &&
                filterSpaceByOptions.map((adminOrg, index) => (
                  <SpaceCard
                    key={index}
                    dataSpace={adminOrg}
                    isOwner={adminOrg.role === 'ADMIN'}
                  />
                ))
              }
              columns={{ xs: 2, md: 3, xl: 4, '2xl': 4 }}
              title={L('spaces')}
            />
          )}
        </section>
        <section className='w-full mb-8'>
          {loading ? (
            <Skeleton />
          ) : (
            <ListItem
              handleSort={handleSortWorkflowDetail}
              items={
                filterWorkflowByOptions! &&
                filterWorkflowByOptions.map((workflow, index) => (
                  <WorkflowCard key={index} dataWorkflow={workflow} />
                ))
              }
              columns={{ xs: 2, md: 3, xl: 3, '2xl': 3 }}
              title={L('workflows')}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default MySpace;

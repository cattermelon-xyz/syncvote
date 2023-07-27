import React, { useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { L } from '@utils/locales/L';
import { useSelector } from 'react-redux';
import {
  getWorkflowFromEditor,
  queryOrgsAndWorkflowForHome,
} from '@middleware/data';
import { useDispatch } from 'react-redux';
import SpaceCard from '@components/Card/SpaceCard';
import ListItem from '../../components/ListItem/ListItem';
import WorkflowCard from '@components/Card/WorkflowCard';
import { Skeleton } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';

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
        // Querry from org
        setWorkflows(allWorkflows);

        await getWorkflowFromEditor({
          userId: user.id,
          dispatch,
          onSuccess: (data: any) => {
            // console.log('Editor', data);
          },
          onError: (error: any) => {
            console.log(error);
          },
        });

        // Querry workflow from workflow_version_editor
      }
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className='w-[800px] flex flex-col'>
      <p className='text-3xl font-semibold mb-8'>{L('mySpace')}</p>
      <section className='w-full mb-8'>
        {loading ? (
          <Skeleton />
        ) : (
          <ListItem
            handleSort={handleSortSpaceDetail}
            items={
              filterSpaceByOptions &&
              filterSpaceByOptions.map((adminOrg, index) => (
                <SpaceCard key={index} dataSpace={adminOrg} isMySpace={true} />
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
              filterWorkflowByOptions &&
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
  );
};

export default MySpace;

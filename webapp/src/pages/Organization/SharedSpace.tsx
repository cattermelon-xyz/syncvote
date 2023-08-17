import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import { useSelector } from 'react-redux';
import SpaceCard from '@pages/Organization/fragments/SpaceCard';
import ListItem from '@components/ListItem/ListItem';
import WorkflowCard from '@pages/Workflow/fragments/WorkflowCard';
import { Skeleton } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}

const SharedSpace: React.FC = () => {
  const { orgs, user } = useSelector((state: any) => state.orginfo);
  const [memberOrgs, setMemberOrgs] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
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

  const filterSpaceByOptions = useFilteredData(memberOrgs, sortOptions);
  const filterWorkflowByOptions = useFilteredData(
    workflows,
    sortWorkflowOptions
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (orgs) {
        const MemberOrgsData = orgs.filter((org: any) => org.role === 'MEMBER');
        setMemberOrgs(MemberOrgsData);

        // Get all workflows from the member orgs and include org title
        const allWorkflows = MemberOrgsData.flatMap((memberOrg: any) =>
          memberOrg.workflows.map((workflow: any) => ({
            ...workflow,
            org_title: memberOrg?.title,
          }))
        );

        setWorkflows(allWorkflows);
      }
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user, orgs]);

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
              filterSpaceByOptions.map((memberOrg, index) => (
                <SpaceCard key={index} dataSpace={memberOrg} isMySpace={true} />
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

export default SharedSpace;

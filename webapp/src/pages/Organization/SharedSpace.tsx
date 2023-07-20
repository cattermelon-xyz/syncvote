import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import { useSelector } from 'react-redux';
import { queryOrgsAndWorkflowForHome } from '@middleware/data';
import { useDispatch } from 'react-redux';
import SpaceCard from '@components/Card/SpaceCard';
import ListItem from '@pages/Organization/fragments/ListItem';
import WorkflowCard from '@components/Card/WorkflowCard';
import { Skeleton } from 'antd';

const SharedSpace: React.FC = () => {
  const { user } = useSelector((state: any) => state.orginfo);
  const [memberOrgs, setMemberOrgs] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
  }, [user]);

  return (
    <div className='w-[800px] flex flex-col'>
      <p className='text-3xl font-semibold mb-8'>{L('mySpace')}</p>
      <section className='w-full mb-8'>
        {loading ? (
          <Skeleton />
        ) : (
          <ListItem
            items={
              memberOrgs &&
              memberOrgs.map((memberOrg, index) => (
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
            items={
              workflows &&
              workflows.map((workflow, index) => (
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

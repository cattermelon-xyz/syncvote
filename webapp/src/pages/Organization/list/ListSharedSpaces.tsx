import { useEffect, useState } from 'react';
import SpaceCard from '@components/Card/SpaceCard';
import { useSelector } from 'react-redux';
import { queryOrgsAndWorkflowForHome } from '@middleware/data';
import { useDispatch } from 'react-redux';
import { L } from '@utils/locales/L';
import WorkflowCard from '@components/Card/WorkflowCard';
import { useParams } from 'react-router-dom';
import SortButton from '@components/SortButton/SortButton';

const ListSharedSpaces = () => {
  const { user } = useSelector((state: any) => state.orginfo);
  const [adminOrgs, setAdminOrgs] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const orgs = await queryOrgsAndWorkflowForHome({
        userId: user.id,
        onSuccess: () => {},
        dispatch,
      });
      if (orgs) {
        const adminOrgsData = orgs.filter((org: any) => org.role === 'MEMBER');
        setAdminOrgs(adminOrgsData);

        // Get all workflows from the admin orgs and include org title
        const allWorkflows = adminOrgsData.flatMap((adminOrg: any) =>
          adminOrg.org.workflows.map((workflow: any) => ({
            ...workflow,
            org_title: adminOrg.org.title,
          }))
        );

        setWorkflows(allWorkflows);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <>
      <div className='flex flex-col mb-10'>
        <div>
          <div className='mb-10 flex justify-between'>
            <div className='text-3xl font-semibold text-[#252422]'>
              {L('sharedSpaces')}
            </div>
            <SortButton />
          </div>
          <div className="font-['General_Sans'] font-medium text-[#252422] mb-4">
            {L('Spaces')}
          </div>
        </div>
        <div className='grid 2xl:grid-cols-4 gap-4 xl:grid-cols-4 gap-y-6'>
          {adminOrgs &&
            adminOrgs.map((adminOrg, index) => (
              <SpaceCard key={index} dataSpace={adminOrg} />
            ))}
        </div>
      </div>
      <div>
        <div className="font-['General_Sans'] font-medium text-[#252422] mb-4">
          {L('workflows')}
        </div>
        <div className='grid 2xl:grid-cols-3 xl:grid-cols-3 gap-4 gap-y-6 justify-items-center'>
          {workflows &&
            workflows.map((workflow, index) => (
              <WorkflowCard key={index} dataWorkflow={workflow} />
            ))}
        </div>
      </div>
    </>
  );
};

export default ListSharedSpaces;

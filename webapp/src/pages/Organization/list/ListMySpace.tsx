import React, { useEffect, useState } from 'react';
import SpaceCard from '@components/Card/SpaceCard';
import { useSelector } from 'react-redux';
import { queryOrgsAndWorkflowForHome } from '@middleware/data';
import { useDispatch } from 'react-redux';
import { L } from '@utils/locales/L';
import WorkflowCard from '@components/Card/WorkflowCard';

const ListMySpace = () => {
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
        const adminOrgsData = orgs.filter((org: any) => org.role === 'ADMIN');
        setAdminOrgs(adminOrgsData);

        // Get all workflows from the admin orgs
        const allWorkflows = adminOrgsData.flatMap(
          (adminOrg: any) => adminOrg.org.workflows
        );
        setWorkflows(allWorkflows);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    console.log(workflows);
  });

  return (
    <>
      <div className='flex flex-col mb-10'>
        <div>
          <div className="text-3xl font-['General_Sans'] font-semibold text-[#252422] mb-10">
            {L('mySpace')}
          </div>
          <div className="font-['General_Sans'] font-medium text-[#252422] mb-4">
            {L('Spaces')}
          </div>
        </div>
        <div className='grid 2xl:grid-cols-4 xl:grid-cols-4 gap-4 gap-y-6'>
          {adminOrgs &&
            adminOrgs.map((adminOrg, index) => (
              <SpaceCard key={index} dataSpace={adminOrg} isMySpace={true} />
            ))}
        </div>
      </div>
      <div>
        <div className="font-['General_Sans'] font-medium text-[#252422] mb-4">
          {L('workflows')}
        </div>
        <div className='grid 2xl:grid-cols-3 xl:grid-cols-3 gap-4 gap-y-6'>
          {workflows &&
            workflows.map((workflow, index) => (
              <WorkflowCard key={index} dataWorkflow={workflow} />
            ))}
        </div>
      </div>
    </>
  );
};

export default ListMySpace;

import React, { useEffect, useState } from 'react';
import SpaceCard from '@components/Card/SpaceCard';
import { useSelector } from 'react-redux';
import { queryOrgsAndWorkflowForHome } from '@middleware/data';
import { useDispatch } from 'react-redux';
import { L } from '@utils/locales/L';

const ListMySpace = () => {
  const { user } = useSelector((state: any) => state.orginfo);
  const [adminOrgs, setAdminOrgs] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const orgs = await queryOrgsAndWorkflowForHome({
        userId: user.id,
        onSuccess: () => {},
        dispatch,
      });
      if (orgs) {
        const data = orgs.filter((org: any) => org.role === 'ADMIN');
        setAdminOrgs(data);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className='flex flex-col'>
      <div>
        <div className="text-3xl font-['General_Sans'] font-semibold text-[#252422] mb-10">
          My spaces
        </div>
        <div className="font-['General_Sans'] font-medium text-[#252422] mb-4">
          Spaces
        </div>
      </div>
      <div className='grid grid-cols-5 gap-4 xl:grid-cols-4'>
        {adminOrgs &&
          adminOrgs.map((adminOrg, index) => (
            <SpaceCard
              key={index}
              title={adminOrg.org.title}
              imageUrl={adminOrg.org.icon_url}
              amountWorkflow={adminOrg.org.workflows?.length}
            />
          ))}
      </div>
    </div>
  );
};

export default ListMySpace;

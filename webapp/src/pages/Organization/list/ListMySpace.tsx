import React, { useEffect, useState } from 'react';
import SpaceCard from '@components/Card/SpaceCard';
import { useSelector } from 'react-redux';
import { queryOrgsAndWorkflowForHome } from '@middleware/data';
import { useDispatch } from 'react-redux';

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
        const adminOrgs = orgs.filter((org: any) => org.role === 'ADMIN');
        setAdminOrgs(adminOrgs);
        console.log(adminOrgs);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div>
      {adminOrgs &&
        adminOrgs.map((org) => (
          <SpaceCard
            key={org.id}
            title={org.title}
            imageUrl={org.icon_url}
            amountWorkflow={org.workflows.length}
          />
        ))}
    </div>
  );
};

export default ListMySpace;

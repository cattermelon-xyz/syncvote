import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import SearchBar from './fragments/SearchBar';
import SpaceContentLayout from '../../fragments/SpaceContentLayout';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import WorkflowCard from '@components/Card/WorkflowCard';
import ListItem from '@pages/Space/fragments/ListItem';
import { Skeleton } from 'antd';
import { useDispatch } from 'react-redux';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import { supabase } from '@utils/supabaseClient';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [workflows, setWorkflows] = React.useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataWorkflow = async () => {
      setLoading(true);
      dispatch(startLoading({}));
      const { data, error } = await supabase.from('workflow').select(`*,
             versions: workflow_version(id, status),
             infoOrg: org(title)
             `);

      dispatch(finishLoading({}));
      if (data) {
        const workflowData = data.filter(
          (worfklow) => worfklow?.versions[0]?.status === 'PUBLIC_COMMUNITY'
        );
        setWorkflows(workflowData);
      }
      setLoading(false);
    };

    fetchDataWorkflow();
  }, []);

  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <section className='w-full'>
        <Title level={2} className='text-center'>
          {L('syncvoteForEarlyAdopters')}
        </Title>
        <div className='w-full flex justify-center'>
          <div className='w-full md:w-1/3 lg:w-1/2 bg-gray-300 rounded-8 h-[241px]' />
        </div>
      </section>

      <section className='w-full'>
        <Title level={2} className='text-center'>
          {L('exploreTopTierWorkflows')}
        </Title>
        <SearchBar />
        {/* {/ render list /} */}
        {/* {/ <ListWorkflow workflows={workflows} /> */}
        {loading ? (
          <Skeleton />
        ) : (
          <ListItem
            items={workflows?.map((workflow, index) => (
              <WorkflowCard
                key={workflow?.id + index}
                dataWorkflow={workflow}
                isListHome={true}
              />
            ))}
            columns={{ xs: 2, md: 3, xl: 3, '2xl': 3 }}
          />
        )}
      </section>
    </div>
  );
};

export default React.memo(Home);

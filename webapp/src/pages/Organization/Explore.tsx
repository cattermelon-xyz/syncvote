import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import SearchBar from './fragments/SearchBar';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import WorkflowCard from '@pages/Workflow/fragments/WorkflowCard';
import ListItem from '@components/ListItem/ListItem';
import { Skeleton } from 'antd';
import { useDispatch } from 'react-redux';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { useGetDataHook } from '@dal/dal';
import { ConfigTypes, config } from '@dal/config';

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}
const Home: React.FC = () => {
  const dispatch = useDispatch();
  let [workflows, setWorkflows] = React.useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [sortWorkflowOptions, setSortWorkflowOption] = useState<SortProps>({
    by: '',
    type: 'asc',
  });

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortWorkflowOption(options);
  };

  workflows = useGetDataHook<ConfigTypes['getWorkflowByStatus']>({
    params: {
      status: 'PUBLIC_COMMUNITY',
    },
    configInfo: config.getWorkflowByStatus,
  }).data;

  console.log(workflows);

  const filterWorkflowByOptions = useFilteredData(
    workflows,
    sortWorkflowOptions
  );

  return (
    <div className='w-[800px] flex flex-col gap-y-14'>
      <section className='w-full'>
        <Title level={2} className='text-center'>
          {L('exploreTopTierWorkflows')}
        </Title>
        <SearchBar setWorkflows={(workflow: any) => setWorkflows(workflow)} />
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <ListItem
              handleSort={handleSortWorkflowDetail}
              items={
                filterWorkflowByOptions &&
                filterWorkflowByOptions?.map((workflow, index) => (
                  <WorkflowCard
                    key={workflow?.id + index}
                    dataWorkflow={workflow}
                    isListHome={true}
                  />
                ))
              }
              columns={{ xs: 2, md: 3, xl: 3, '2xl': 3 }}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default React.memo(Home);

import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import SearchBar from './fragments/SearchBar';
const { Title } = Typography;
import { L } from '@utils/locales/L';
import WorkflowCard from '@pages/Workflow/fragments/WorkflowCard';
import {ListItem} from 'listitem';
import { Skeleton } from 'antd';
import { useDispatch } from 'react-redux';
import { getWorkflowByStatus } from '@middleware/data';
import { useFilteredData } from '@utils/hooks/useFilteredData';

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [workflows, setWorkflows] = React.useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [sortWorkflowOptions, setSortWorkflowOption] = useState<SortProps>({
    by: '',
    type: 'asc',
  });

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortWorkflowOption(options);
  };

  const filterWorkflowByOptions = useFilteredData(
    workflows,
    sortWorkflowOptions
  );

  useEffect(() => {
    const fetchDataWorkflow = async () => {
      setLoading(true);
      await getWorkflowByStatus({
        status: 'PUBLIC_COMMUNITY',
        dispatch,
        onSuccess: (data: any) => {
          setWorkflows(data);
        },
        onError: (error: any) => {
          console.log(error);
        },
      });
      setLoading(false);
    };

    fetchDataWorkflow();
  }, []);

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

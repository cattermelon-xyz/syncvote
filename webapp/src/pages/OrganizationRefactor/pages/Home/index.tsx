import React from 'react';
import { Typography } from 'antd';
import SearchBar from './fragments/SearchBar';
import SpaceContentLayout from '../../fragments/SpaceContentLayout';
import ListWorkflow from './fragments/ListWorkflow';
const { Title } = Typography;
import { useFetchData } from './hooks/useFetchData';
import { L } from '@utils/locales/L';

const Home: React.FC = () => {
  const { workflows } = useFetchData();
  console.log(workflows);
  return (
    <SpaceContentLayout>
      <div className='w-[800px] flex flex-col gap-y-14'>
        {/* section 1 */}
        <section className='w-full'>
          <Title level={2} className='text-center'>
            {L('syncvoteForEarlyAdopters')}
          </Title>
          <div className='w-full flex justify-center'>
            <div className='w-full md:w-1/3 lg:w-1/4 bg-gray-300 rounded-8 h-[241px]' />
          </div>
        </section>

        {/* Section 2 search and list       */}
        <section className='w-full'>
          <Title level={2} className='text-center'>
            {L('exploreTopTierWorkflows')}
          </Title>
          <SearchBar />
          {/* render list */}
          <ListWorkflow workflows={workflows} />
        </section>
      </div>
    </SpaceContentLayout>
  );
};

export default React.memo(Home);

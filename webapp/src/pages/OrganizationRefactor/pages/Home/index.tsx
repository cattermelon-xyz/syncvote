import React from 'react';
import { Typography } from 'antd';
import SearchBar from './fragments/SearchBar';
import SpaceContentLayout from '../../fragments/SpaceContentLayout';
import ListSpace from './fragments/ListSpace';
const { Title } = Typography;
import { useFetchData } from './hooks/useFetchData';
const Home: React.FC = () => {
  const { workflows } = useFetchData();
  console.log(workflows);
  return (
    <SpaceContentLayout>
      <div className='w-full flex flex-col gap-y-14'>
        {/* section 1 */}
        <section className='w-full'>
          <Title level={2} className='text-center'>
            Syncvote for early adopters
          </Title>
          <div className='w-full flex justify-center'>
            <div className='w-full md:w-1/3 lg:w-1/4 bg-gray-300 rounded-8 h-[241px]'></div>
          </div>
        </section>

        {/* Section 2 search and list       */}
        <section className='w-full'>
          <Title level={2} className='text-center'>
            Explore top-tier workflows
          </Title>
          <SearchBar />
          {/* render list */}
          <ListSpace workflows={workflows} />
        </section>
      </div>
    </SpaceContentLayout>
  );
};

export default React.memo(Home);

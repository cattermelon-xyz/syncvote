import React from 'react';
import { L } from '@utils/locales/L';
import { Input, Space, Tag } from 'antd';
import SortButton from '@components/SortButton/SortButton';

const { Search } = Input;
const { CheckableTag } = Tag;
const listTag = [
  'Finance',
  'Governance',
  'Human Resources',
  'Project Management',
  'Customer Service',
  'Operations',
  'Community & Social',
  'Legal',
  'Sales & Marketing',
  'Strategic Planning',
];

const SearchBar: React.FC = () => {
  return (
    <React.Fragment>
      <Search
        placeholder={`${L('searchAWorkflow')}...`}
        allowClear
        onSearch={() => 1}
        className='mb-4 w-full'
      />
      <div className='flex flex-col w-full mb-4 items-end'>
        <Space size={[16, 16]} wrap className='mb-10 '>
          {listTag.map((tag) => (
            <CheckableTag
              className='border border-gray-300'
              key={tag}
              checked={false}
              onChange={() => 1}
              style={{ borderRadius: '15px', fontSize: '16px' }}
            >
              {tag}
            </CheckableTag>
          ))}
        </Space>
        <SortButton />
      </div>
    </React.Fragment>
  );
};
export default React.memo(SearchBar);

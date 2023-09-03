import React, { useState } from 'react';
import { L } from '@utils/locales/L';
import { Input, Space, Tag } from 'antd';
import SortButton from '@components/SortButton/SortButton';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { getWorkflowByStatus, searchWorflow } from '@middleware/data';
import { useDispatch } from 'react-redux';
import { error } from 'console';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { supabase } from 'utils';

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

interface SearchBarProps {
  setWorkflows: (worfklow: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setWorkflows }) => {
  const [inputSearch, setValue] = useState('');
  const dispatch = useDispatch();
  const handleEnter = async () => {
    // Do something with the input value when Enter is pressed
    console.log(inputSearch);

    await searchWorflow({
      inputSearch: inputSearch,
      dispatch: dispatch,
      onSuccess: (data: any) => {
        const workflowData = data.filter(
          (worfklow: any) =>
            worfklow?.versions[0]?.status === 'PUBLIC_COMMUNITY'
        );
        setWorkflows(workflowData);
      },
      onError: (error: any) => {},
    });
    // Clear the input field
    // setValue('');
  };

  const handleChange = async (e: any) => {
    setValue(e.target.value);

    // Check if input is empty
    if (e.target.value === '') {
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
    }
  };

  return (
    <React.Fragment>
      <Input
        size='large'
        placeholder={`${L('searchAWorkflow')}...`}
        prefix={<SearchOutlined />}
        allowClear
        className='mb-4'
        value={inputSearch}
        onChange={handleChange}
        onPressEnter={handleEnter}
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
      </div>
    </React.Fragment>
  );
};
export default React.memo(SearchBar);

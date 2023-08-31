import PlusIcon from '@assets/icons/svg-icons/PlusIcon';
import Icon from '@components/Icon/Icon';
import SortButton from '@components/SortButton/SortButton';
import { createIdString, getImageUrl } from '@utils/helpers';
import NewOrgFrm from './NewOrgFrm';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { L } from '@utils/locales/L';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@utils/supabaseClient';
import WorkflowCard from '@pages/Workflow/fragments/WorkflowCard';
import { finishLoading, startLoading } from '@redux/reducers/ui.reducer';
import { SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Input, Tag, Space, Button, Popover } from 'antd';

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

const ListHome = () => {
  const [shouldShowForm, setShouldShowForm] = useState(false);
  const { orgs } = useSelector((state: any) => state.orginfo);
  const { presetBanners } = useSelector((state: any) => state.ui);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const dispatch = useDispatch();
  const presetBanner = presetBanners[15]
    ? getImageUrl({
        filePath: presetBanners[15],
        isPreset: true,
        type: 'banner',
      })
    : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataWorkflow = async () => {
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
    };

    fetchDataWorkflow();
  }, []);

  const onSearch = (value: string) => console.log(value);

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    // console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };

  return (
    <div className='container flex flex-col items-center'>
      <div className='flex justify-center text-3xl font-semibold text-[#252422] mb-10'>
        {L('syncvoteForEarlyAdopters')}
      </div>
      <div className='w-[422px] h-[241px] bg-[#D9D9D9] mb-16'></div>
      <div className='flex justify-center text-3xl font-semibold text-[#252422] mb-10'>
        {L('exploreTopTierWorkflows')}
      </div>
      <Search
        placeholder={`${L('searchAWorkflow')}...`}
        allowClear
        onSearch={onSearch}
        className='mb-4 w-full'
      />
      <div className='flex flex-col w-full mb-4 items-end'>
        <Space size={[16, 16]} wrap className='mb-10 '>
          {listTag.map((tag) => (
            <CheckableTag
              className='border border-gray-300'
              key={tag}
              checked={selectedTags.includes(tag)}
              onChange={(checked) => handleChange(tag, checked)}
              style={{ borderRadius: '15px', fontSize: '16px' }}
            >
              {tag}
            </CheckableTag>
          ))}
        </Space>
        <SortButton />
      </div>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-y-6 w-full justify-items-center">
        {workflows &&
          workflows.map((workflow, index) => (
            <WorkflowCard
              key={index}
              dataWorkflow={workflow}
              isListHome={true}
            />
          ))}
      </div>
    </div>
  );
};

export default ListHome;

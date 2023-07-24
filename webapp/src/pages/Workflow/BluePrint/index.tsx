import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LeftOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import WorkflowCard from '@components/Card/WorkflowCard';
import { L } from '@utils/locales/L';
import { Button, Empty, Skeleton, Space } from 'antd';
import ListItem from '@components/ListItem/ListItem';
import Icon from '@components/Icon/Icon';
import { Avatar } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { FiShield } from 'react-icons/fi';
import { queryOrgs, queryWorkflow } from '@middleware/data';
import { extractIdFromIdString } from '@utils/helpers';
import { useDispatch, useSelector } from 'react-redux';

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}

interface DataItem {
  title: string;
  [key: string]: any;
}

const BluePrint = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { orgIdString } = useParams();
  const [loading, setLoading] = useState(false);
  const { orgs } = useSelector((state: any) => state.orginfo);
  const org = orgs.find(
    (tmp: any) => tmp.id === extractIdFromIdString(orgIdString)
  );
  const data = location.state?.dataSpace || org;
  const dispatch = useDispatch();

  const [sortWorkflowOptions, setSortWorkflowOption] = useState<SortProps>({
    by: 'Last modified',
    type: 'des',
  });

  const filterWorkflowByOptions = useFilteredData(
    workflows,
    sortWorkflowOptions
  );

  const handleSortWorkflowDetail = (options: SortProps) => {
    setSortWorkflowOption(options);
  };

  useEffect(() => {
    if (data) {
      const workflowsData = data?.workflows?.map((workflow: any) => ({
        ...workflow,
        org_title: data.title,
      }));
      setWorkflows(workflowsData);
    } else {
      queryOrgs({
        filter: {},
        dispatch: dispatch,
        onSuccess: (data: any) => {},
      });
    }
  }, [data]);

  return (
    <div className='lg:w-[800px] md:w-[640px] sm:w-[400px]'>
      <div
        className='flex my-4 gap-1 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <LeftOutlined style={{ color: '#6200ee' }} />
        <p className='font-medium text-[#6200ee] self-center'>
          {L('backToMySpaces')}
        </p>
      </div>
      <Space
        direction='horizontal'
        className='flex justify-between items-center mb-6 mt-2'
      >
        <div className='flex gap-2 items-center'>
          {data?.icon_url ? (
            <Icon iconUrl={data?.icon_url} size='large' />
          ) : (
            <Avatar
              shape='circle'
              className='w-11 h-11'
              style={{
                backgroundColor: '#D3D3D3',
              }}
            />
          )}
          <div
            className='text-3xl font-semibold text-[#252422] flex items-center'
            title={
              data?.role === 'ADMIN' ? 'You are an ADMIN' : 'You are a Member'
            }
          >
            {data?.title}
            {data?.role === 'ADMIN' ? (
              <FiShield className='ml-1' />
            ) : (
              <TeamOutlined className='ml-1' />
            )}
          </div>
        </div>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate(`/${orgIdString}/new-workflow`)}
        >
          New Workflow
        </Button>
      </Space>
      <div>
        {loading ? (
          <Skeleton />
        ) : filterWorkflowByOptions && filterWorkflowByOptions.length > 0 ? (
          <ListItem
            handleSort={handleSortWorkflowDetail}
            items={
              filterWorkflowByOptions &&
              filterWorkflowByOptions?.map((workflow, index) => (
                <WorkflowCard
                  key={workflow?.id + index}
                  dataWorkflow={workflow}
                />
              ))
            }
            columns={{ sm: 2, md: 3, xl: 3, '2xl': 3 }}
            title={L('workflows')}
          />
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default BluePrint;

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import WorkflowCard from '@components/Card/WorkflowCard';
import { L } from '@utils/locales/L';
import { Skeleton, Empty } from 'antd';
import ListItem from '@components/ListItem/ListItem';
import Icon from '@components/Icon/Icon';
import { Avatar } from 'antd';
import { useFilteredData } from '@utils/hooks/useFilteredData';
import { queryOrgs } from '@middleware/data';
import { useDispatch, useSelector } from 'react-redux';
import { extractIdFromIdString } from '@utils/helpers';

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
  console.log('data:', data);
  const dispatch = useDispatch();

  const [sortWorkflowOptions, setSortWorkflowOption] = useState<SortProps>({
    by: '',
    type: 'asc',
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
    }
  }, [data]);

  return (
    <div className='w-[800px]'>
      <div
        className='flex mb-4 gap-1 cursor-pointer'
        onClick={() => navigate(-1)}
      >
        <LeftOutlined style={{ color: '#6200ee' }} />
        <p className='font-medium text-[#6200ee] self-center'>
          {L('backToMySpaces')}
        </p>
      </div>
      <div className='mb-6 flex gap-2 items-center'>
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

        <div className='text-3xl font-semibold text-[#252422]'>
          {data?.title}
        </div>
      </div>
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
            columns={{ xs: 2, md: 3, xl: 3, '2xl': 3 }}
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

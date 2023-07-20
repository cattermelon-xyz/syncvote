import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import WorkflowCard from '@components/Card/WorkflowCard';
import { L } from '@utils/locales/L';
import { Skeleton } from 'antd';
import ListItem from '@pages/Organization/fragments/ListItem';
import Icon from '@components/Icon/Icon';
import { Avatar } from 'antd';

const BluePrint = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const data = location.state?.dataSpace;

  useEffect(() => {
    if (data) {
      const workflowsData = data?.workflows.map((workflow: any) => ({
        ...workflow,
        org_title: data.title,
      }));

      setWorkflows(workflowsData);
    }
  }, [data]);

  return (
    <div className='w-[800px]'>
      <div className='flex mb-4 gap-1' onClick={() => navigate(-1)}>
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
            title={L('workflows')}
          />
        )}
      </div>
    </div>
  );
};

export default BluePrint;

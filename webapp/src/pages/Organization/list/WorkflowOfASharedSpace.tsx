import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import WorkflowCard from '@components/Card/WorkflowCard';
import { L } from '@utils/locales/L';
import SortButton from '@components/SortButton/SortButton';

const WorkflowOfASharedSpace = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.dataSpace;

  useEffect(() => {
    if (data) {
      const workflowsData = data?.org.workflows.map((workflow: any) => ({
        ...workflow,
        org_title: data.org.title,
      }));

      setWorkflows(workflowsData);
    }
  }, [data]);

  return (
    <div>
      <div
        className='flex mb-8 gap-1 cursor-pointer'
        onClick={() => navigate(-1)}
      >
        <LeftOutlined style={{ color: '#6200ee' }} />
        <p className='font-medium text-[#6200ee] self-center'>
          {L('backToSharedSpaces')}
        </p>
      </div>
      <div className='mb-10 flex justify-between'>
        <div className='text-3xl font-semibold text-[#252422] mb-10'>
          {data?.org.title}
        </div>
        <SortButton />
      </div>
      <div>
        <div className="font-['General_Sans'] font-medium text-[#252422] mb-4">
          {L('workflows')}
        </div>
        <div className='grid 2xl:grid-cols-3 xl:grid-cols-3 gap-4 gap-y-6'>
          {workflows &&
            workflows.map((workflow, index) => (
              <WorkflowCard key={index} dataWorkflow={workflow} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowOfASharedSpace;

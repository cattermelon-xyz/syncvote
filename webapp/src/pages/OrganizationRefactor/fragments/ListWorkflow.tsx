import React from 'react';
import WorkflowCard from '@components/Card/WorkflowCard';

interface Props {
  workflows: any[];
}

const ListWorkflow: React.FC<Props> = ({ workflows }) => {
  return (
    <div className='w-full grid grids-col-1 xs:grid-cols-2 md:grid-cols-3 gap-4'>
      {workflows &&
        workflows.map((workflow, index) => (
          <div key={workflow?.id + index}>
            <WorkflowCard dataWorkflow={workflow} isListHome={true} />
          </div>
        ))}
    </div>
  );
};

export default React.memo(ListWorkflow);

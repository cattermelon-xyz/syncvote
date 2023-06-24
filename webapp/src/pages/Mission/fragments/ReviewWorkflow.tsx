import { DirectedGraph, ICheckPoint, getVoteMachine } from '@components/DirectedGraph';
import { Tag, Space, Drawer } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import ExternalLinkIcon from '@assets/icons/svg-icons/ExternalLinkIcon';
import { useNavigate, useParams } from 'react-router-dom';
import { IWorkflowVersion, IVoteMachine } from '@types';

const getSummary = (selected:ICheckPoint) => {
  const machine:IVoteMachine = getVoteMachine(selected?.vote_machine_type || '');
  return machine?.explain({
    checkpoint: selected, data: selected.data,
  });
};

const ReviewWorkflow = ({
  currentWorkflowVersion,
}:{
  currentWorkflowVersion: IWorkflowVersion;
}) => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [selectedCheckPoint, setSelectedCheckPoint] = useState<ICheckPoint>();
  const navigate = useNavigate();
  const { orgIdString, workflowIdString } = useParams();
  return (
    <Space size="large" direction="vertical" className="w-full">
      <p className="text-[28px] text-grey-version-7 font-semibold">
        New mission from Workflow
      </p>
      <Space direction="vertical" size="small" className="w-full">
        <div className="flex gap-2 items-center">
          <p className="text-[#575655] text-base">From Workflow</p>
          <div className="font-semibold pt-[0.9px] flex items-center">
            <span className="mr-2">{`${currentWorkflowVersion.title}`}</span>
            {/* TODO: display of tag is inconsistent */}
            <Tag>
              {`${currentWorkflowVersion.version}`}
            </Tag>
            <span className="cursor-pointer" onClick={() => navigate(`/${orgIdString}/edit/${workflowIdString}`)}>
              <ExternalLinkIcon width={16} />
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-[#575655] text-base">Created on</p>
          <p className="font-semibold pt-[0.9px]">
            {`${moment(currentWorkflowVersion.created_at).format('DD MMM YYYY')}`}
          </p>
        </div>
        <div className="flex gap-2 items-center w-full" style={{ height: '400px' }}>
          <DirectedGraph
            editable={false}
            data={currentWorkflowVersion.data}
            onNodeClick={(e:any, node:any) => {
              const { checkpoints } = currentWorkflowVersion.data;
              const selected:ICheckPoint = checkpoints?.find((c:any) => c.id === node.id);
              setSelectedCheckPoint(selected);
              setShouldShowModal(true);
            }}
          />
        </div>
        <Drawer
          title={selectedCheckPoint?.title}
          open={shouldShowModal}
          onClose={() => setShouldShowModal(false)}
        >
          {
            getSummary(selectedCheckPoint || {})
          }
          {/* TODO: take the enforcer from the workflow and display its Enforecer.Display? */}
        </Drawer>
      </Space>
    </Space>
  );
};

export default ReviewWorkflow;

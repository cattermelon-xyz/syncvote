import { Select, Space } from 'antd';
import {
  CollapsiblePanel,
  ICheckPoint,
  IVoteMachine,
  IVoteMachineConfigProps,
  IWorkflowVersionData,
  shortenString,
} from '../../..';
import { VerticalRightOutlined } from '@ant-design/icons';

const VoteMachine: IVoteMachine = {
  ConfigPanel: (props: IVoteMachineConfigProps) => {
    const currentNode = props.allNodes?.find(
      (a) => a.id === props.currentNodeId
    );
    const children = currentNode?.children ? [...currentNode?.children] : [];
    const checkpoints: any[] = [];
    props.allNodes?.forEach((child) => {
      if (
        ['joinNode', 'forkNode'].indexOf(child.vote_machine_type) === -1 &&
        children.indexOf(child.id) === -1 &&
        child.subWorkflowId === currentNode?.subWorkflowId
      ) {
        checkpoints.push({ value: child.id, label: child.title });
      }
    });
    return (
      <CollapsiblePanel title='Parallel Sub-Workflow'>
        <div className='w-full justify-between flex items-center'>
          <div className='w-1/4'>Connect to</div>
          <Select
            value={children[0]}
            className='w-full'
            options={checkpoints}
            onChange={(value) => {
              props.onChange({
                ...currentNode,
                children: [value],
              });
            }}
          />
        </div>
      </CollapsiblePanel>
    );
  },
  getName: () => {
    return 'Join Node';
  },
  getProgramAddress: () => {
    return 'joinNode';
  },
  getLabel: () => {
    return <span>trigger</span>;
  },
  getIcon: () => {
    return <VerticalRightOutlined />;
  },
  getType: () => {
    return 'joinNode';
  },
  deleteChildNode: () => {},
  getInitialData: () => {},
  abstract: ({
    checkpoint,
    data,
    graphData,
  }: {
    checkpoint: ICheckPoint | undefined;
    data: any;
    graphData?: IWorkflowVersionData;
  }) => {
    return (
      <div className='flex flex-col items-center'>
        <VerticalRightOutlined />
        <div className='text-sm'>
          {shortenString(checkpoint?.title || '', 10)}
        </div>
      </div>
    );
  },
  explain: ({
    checkpoint,
    data,
    graphData,
  }: {
    checkpoint: ICheckPoint | undefined;
    data: any;
    graphData?: IWorkflowVersionData;
  }) => {
    return <div>Show the join node & its sub missions</div>;
  },
  validate: ({ checkpoint }: { checkpoint: ICheckPoint | undefined }) => {
    return { isValid: true, message: [''] };
  },
};

export default VoteMachine;

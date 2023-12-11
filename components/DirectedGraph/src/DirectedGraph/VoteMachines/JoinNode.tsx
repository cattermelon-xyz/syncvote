import {
  ICheckPoint,
  IVoteMachine,
  IWorkflowVersionData,
  shortenString,
} from '../../..';
import { VerticalRightOutlined } from '@ant-design/icons';

const VoteMachine: IVoteMachine = {
  ConfigPanel: () => {
    return <></>;
  },
  getName: () => {
    return 'Join Node';
  },
  getProgramAddress: () => {
    return 'joinNode';
  },
  getLabel: () => {
    return <div>Join Node</div>;
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

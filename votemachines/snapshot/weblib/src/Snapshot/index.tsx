import { Snapshot as Funcs } from './funcs';
import ConfigPanel from './ConfigPanel/index';
import icon from '../assets/icon.svg';
import {
  ICheckPoint,
  IVoteMachine,
  SideNote,
  IVoteMachineGetLabelProps,
} from 'directed-graph';
import { Space } from 'antd';
import { SolutionOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import VoteUIWeb from './VoteUIWeb';
import { TwitterOutlined } from '@ant-design/icons';

const selectOptions = [
  {
    label: 'Single Choice',
    value: 'single-choice',
  },
  {
    label: 'Approval',
    value: 'approval',
  },
  {
    label: 'Quadratic',
    value: 'quadratic',
  },
  {
    label: 'Ranked Choice',
    value: 'ranked-choice',
  },
  {
    label: 'Weighted',
    value: 'weighted',
  },
  {
    label: 'Basic',
    value: 'basic',
  },
];

const explain = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: any;
}) => {
  const { resultDescription } = checkpoint || {};
  const { token, threshold, space, type } = data || {};
  return (
    <Space direction='vertical' className='w-full'>
      <div className='text-gray-400'>Voting format</div>
      <ul className='ml-4'>
        <li>
          Voting mechanism:{' '}
          <span className='text-violet-500'>{Funcs.getName()}</span>
        </li>
        {space ? (
          <li>
            <span>
              Space: <span className='text-violet-500'>{space}</span>
            </span>
          </li>
        ) : null}

        {type ? (
          <li>
            <span>
              Voting method:{' '}
              <span className='text-violet-500'>
                {selectOptions.find((o) => o.value === type)?.label}
              </span>
            </span>
          </li>
        ) : null}

        <SideNote value={resultDescription} />
      </ul>
    </Space>
  );
};

const abstract = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: any;
}) => {
  const { space, type } = data;
  return type || space ? (
    <>
      {space ? (
        <div className='flex text-ellipsis items-center px-2'>
          <SolutionOutlined className='mr-2' />
          <div className='flex gap-1'>
            <span>Space {space}</span>
          </div>
        </div>
      ) : null}
      {type ? (
        <div className='flex text-ellipsis items-center px-2'>
          <VerticalAlignTopOutlined className='mr-2' />
          <div className='flex gap-1'>
            <span>
              Voting method:{' '}
              {selectOptions.find((o) => o.value === type)?.label}
            </span>
          </div>
        </div>
      ) : null}
    </>
  ) : null;
};

const getLabel = (props: IVoteMachineGetLabelProps) => {
  const { source, target } = props;
  const snapshotType = source?.data?.action;
  const children = source.children || [];
  const idx = children.indexOf(target.id);

  return (
    <>
      {snapshotType === 'create-proposal' ? (
        <>
          {source?.data.next === target?.id ? (
            <span>Pass</span>
          ) : (
            <span>Fail</span>
          )}
        </>
      ) : (
        <>
          {source?.data.fallback === target?.id ? (
            <span>Fail</span>
          ) : (
            <span>{source.data.snapShotOption[idx]}</span>
          )}
        </>
      )}
    </>
  );
};

const getIcon = () => {
  return <img src={icon} className='w-[14px]' />;
};

const VoteMachine: IVoteMachine = {
  ConfigPanel: ConfigPanel,
  getProgramAddress: Funcs.getProgramAddress,
  getName: Funcs.getName,
  VoteUIWeb: VoteUIWeb,
  deleteChildNode: Funcs.deleteChildNode,
  getLabel,
  getType: Funcs.getType,
  getIcon,
  getInitialData: Funcs.getInitialData,
  explain,
  validate: Funcs.validate,
  abstract,
};

export default VoteMachine;

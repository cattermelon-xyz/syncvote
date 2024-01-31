import {
  SolutionOutlined,
  TwitterOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
  DelayUnit,
  ICheckPoint,
  IVoteMachine,
  IVoteMachineGetLabelProps,
  TokenInput,
  displayDuration,
  isRTE,
  SideNote,
  NumberWithPercentageInput,
} from 'directed-graph';
import ConfigPanel from './ConfigPanel';
import { Discourse as Interface } from './interface';
import { Discourse as Funcs } from './funcs';
import { LuMapPin } from 'react-icons/lu';
import parse from 'html-react-parser';
import VoteUIWeb from './VoteUIWeb';
import { Tag } from 'antd';
const SelectOptions = Interface.SelectOptions;
import icon from '../assets/icon.svg';

const getLabel = (props: IVoteMachineGetLabelProps) => {
  const { source, target } = props;
  return source?.data.next === target?.id ? (
    <span>Pass</span>
  ) : (
    <span>Fail</span>
  );
};
// label: label.length > 20 ? `${label.substring(0, 20)}...` : label,

const getIcon = (className?: string) => {
  return <img src={icon} className={`w-4 ${className ? className : ''}`} />;
};

const explain = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: Interface.IData;
}) => {
  if (!checkpoint) {
    return <></>;
  }
  const action = data.action;
  const actionLabel =
    SelectOptions.find((item: any) => item.value === data.action)?.label ||
    'Empty';
  const variable = data.variables[0];
  return (
    <>
      <div className='flex items-center justify-between mb-2'>
        <div>Action Type</div>
        <div>{actionLabel}</div>
      </div>
      <div className='flex items-center justify-between mb-2'>
        <div>
          {action === 'create-topic'
            ? 'Write data to Variable'
            : 'Read data from Variable'}
        </div>
        <Tag>{variable}</Tag>
      </div>
      {action === 'move-topic' ? (
        <div className='flex items-center justify-between mb-2'>
          <div>Move to category Id</div>
          <div>{data?.categoryId || 'Missing'}</div>
        </div>
      ) : null}
    </>
  );
};
const abstract = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: any;
}) => {
  const action = data?.action;
  const actionLabel =
    SelectOptions.find((item: any) => item.value === data.action)?.label ||
    'Empty';
  const variable = data?.variables[0];
  const text = variable ? (
    action === 'create-topic' ? (
      <div>
        Store in <Tag>{variable}</Tag>
      </div>
    ) : (
      <div>
        Read from <Tag>{variable}</Tag>
      </div>
    )
  ) : null;
  return (
    <div className='px-4'>
      {actionLabel}
      {text}
    </div>
  );
};

const VoteMachine: IVoteMachine = {
  ConfigPanel: ConfigPanel,
  VoteUIWeb: VoteUIWeb,
  getProgramAddress: Funcs.getProgramAddress,
  getName: Funcs.getName,
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

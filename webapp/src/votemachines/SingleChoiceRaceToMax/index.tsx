import {
  ShareAltOutlined, TwitterOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { Tag } from 'antd';
import { getVoteMachine } from '@components/DirectedGraph';
import {
  ICheckPoint,
  IParticipant,
  IToken,
  IVoteMachine, IVoteMachineGetLabelProps,
} from '../../types';
import {
  getProgramAddress as gpa, getName as gn, deleteChildNode as dcn, getType as gt,
  getInitialData as gid, validate as v,
} from './funcs';
import cf from './ConfigPanel';
import { IData } from './interface';

export const getLabel = (props: IVoteMachineGetLabelProps) => {
  const { source, target } = props;
  const data = source.data || {};
  const { triggers } = source;
  const filteredTriggers = triggers?.filter((trg:any) => (trg.triggerAt === target.id));
  const children = source.children || [];
  const idx = children.indexOf(target.id);
  return data.options ?
    (
      <div>
        <div>{data.options[idx]}</div>
        <div>{filteredTriggers?.map((trg:any) => (trg.provider === 'twitter' ? <TwitterOutlined key={trg.id || Math.random()} className="pr-2" /> : <span key={trg.id || Math.random()}>{trg.provider}</span>))}</div>
      </div>
    )
    :
    (
      <div>{filteredTriggers?.map((trg:any) => (trg.provider === 'twitter' ? <TwitterOutlined key={trg.id || Math.random()} className="pr-2" /> : <span key={trg.id || Math.random()}>{trg.provider}</span>))}</div>
    );
};
// label: label.length > 20 ? `${label.substring(0, 20)}...` : label,

export const getIcon = () => {
  return (
    <ShareAltOutlined />
  );
};

export const explain = ({
  checkpoint, data,
}:{
  checkpoint:ICheckPoint, data:IData
}) => {
  const noOfOptions = checkpoint.children ? checkpoint.children.length : 0;
  const { participation } = checkpoint;
  const renderParticipation = (participation : IParticipant | undefined) => {
    let rs = null;
    if (!participation || (participation.type && !participation.data)) {
      rs = (
        <div className="text-red-500">
          Missing participation setup
        </div>
      );
    } else {
      const { type, data: pdata } = participation;
      if (type === 'identity') {
        rs = (
          <div>
            <Tag className="text-violet-500 mx-2">{(pdata as string[] || []).length}</Tag>
            users can participate
          </div>
        );
      } else if (type === 'token') {
        rs = (
          <div>
            User with
            <Tag className="text-violet-500 mx-2">{(pdata as IToken)?.min}</Tag>
            <Tag className="text-violet-500 mx-2">{(pdata as IToken)?.address}</Tag>
            can participate
          </div>
        );
      }
    }
    return rs;
  };
  const p1 = (
    <div className="block">
      <div>
        Voting method is
        <Tag className="text-red-500 mx-2 font-bold">
          {getVoteMachine(checkpoint.vote_machine_type || '')?.getName()}
        </Tag>
      </div>
      The voting would lasts
      <Tag className="text-violet-500 mx-2">
        apprx.&nbsp;
        {moment.duration((checkpoint?.duration || 0) * 1000).humanize()}
      </Tag>
      and the user would have to choose ONE of
      <Tag className="text-violet-500 mx-2">
        {noOfOptions}
      </Tag>
      options.
      {data.includedAbstain ? ' User can also choose to abstain from voting.' : ''}
      {/* Only user with ... can vote. */}
      <br />
      The winning option must reach
      <Tag className="text-violet-500 mx-2">
        {data.max < 1 ? `${data.max * 100}% ` : `${data.max} `}
        {!data.token ? 'votes' : ` voted token ${data.token}`}
      </Tag>
      to win.
      {renderParticipation(participation)}
    </div>
  );
  return (
    p1
  );
};

const VoteMachine : IVoteMachine = {
  ConfigPanel: cf,
  getProgramAddress: gpa,
  getName: gn,
  deleteChildNode: dcn,
  getLabel,
  getType: gt,
  getIcon,
  getInitialData: gid,
  explain,
  validate: v,
};

export default VoteMachine;

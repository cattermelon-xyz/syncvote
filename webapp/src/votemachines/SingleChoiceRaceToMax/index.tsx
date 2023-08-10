import { ShareAltOutlined, TwitterOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Popover, Tag } from 'antd';
import { getVoteMachine } from '@components/DirectedGraph';
import {
  DelayUnit,
  ICheckPoint,
  IParticipant,
  IToken,
  IVoteMachine,
  IVoteMachineGetLabelProps,
} from '../../types';
import parse from 'html-react-parser';
import {
  getProgramAddress as gpa,
  getName as gn,
  deleteChildNode as dcn,
  getType as gt,
  getInitialData as gid,
  validate as v,
} from './funcs';
import cf from './ConfigPanel';
import { IData } from './interface';
import TokenInput from '@components/DirectedGraph/components/TokenInput';
import { displayDuration, isRTE } from '@components/DirectedGraph/utils';
import SideNote from '@components/DirectedGraph/components/SideNote';
import NumberWithPercentageInput from '@components/DirectedGraph/components/NumberWithPercentageInput';

export const getLabel = (props: IVoteMachineGetLabelProps) => {
  const { source, target } = props;
  const data = source.data || {};
  const { triggers } = source;
  const filteredTriggers = triggers?.filter(
    (trg: any) => trg.triggerAt === target.id
  );
  const children = source.children || [];
  const idx = children.indexOf(target.id);
  return data.options ? (
    <div>
      <div>{data.options[idx]}</div>
      <div>
        {filteredTriggers?.map((trg: any) =>
          trg.provider === 'twitter' ? (
            <TwitterOutlined key={trg.id || Math.random()} className='pr-2' />
          ) : (
            <span key={trg.id || Math.random()}>{trg.provider}</span>
          )
        )}
      </div>
    </div>
  ) : (
    <div>
      {filteredTriggers?.map((trg: any) =>
        trg.provider === 'twitter' ? (
          <TwitterOutlined key={trg.id || Math.random()} className='pr-2' />
        ) : (
          <span key={trg.id || Math.random()}>{trg.provider}</span>
        )
      )}
    </div>
  );
};
// label: label.length > 20 ? `${label.substring(0, 20)}...` : label,

export const getIcon = () => {
  return <ShareAltOutlined />;
};

export const explain = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: IData;
}) => {
  if (!checkpoint) {
    return <></>;
  }
  const noOfOptions = checkpoint.children ? checkpoint.children.length : 0;
  const resultDescription = checkpoint.data?.resultDescription || '';
  const quorum = checkpoint.data?.quorum || 0;
  const optionsDescription = checkpoint.data?.optionsDescription;
  const renderOption = ({ data, index }: { data: IData; index: number }) => {
    const { options, delays, delayUnits, delayNotes } = data;
    const option = options[index];
    const delay = delays ? delays[index] : 0;
    const delayUnit = delayUnits ? delayUnits[index] : DelayUnit.MINUTE;
    const delayNote = delayNotes ? delayNotes[index] : '';
    return option ? (
      <li key={index}>
        <div>
          <span className='text-violet-500'>{option}</span>{' '}
          {delay ? (
            <span>
              - Timelock:{' '}
              <span className='text-violet-500'>
                {displayDuration(moment.duration(delay, delayUnit))}
              </span>
            </span>
          ) : null}
        </div>
        <div className='py-1'>
          <SideNote value={delayNote} />
        </div>
      </li>
    ) : null;
  };
  const p1 = (
    <>
      <div className='text-zinc-400'>Voting format</div>
      <ul className='list-disc ml-4'>
        <li>
          Voting method: <span className='text-violet-500'>Single Choice</span>
        </li>
        {noOfOptions ? (
          <li>
            Voting options:{' '}
            <ul className='flex flex-col gap-1'>
              {data.options.map((option: string, index: number) => {
                return <div key={index}>{renderOption({ data, index })}</div>;
              })}
              {data.includedAbstain ? (
                <li className='text-violet-500'>Abstain</li>
              ) : null}
            </ul>
          </li>
        ) : null}
        <SideNote value={optionsDescription} />
        {quorum ? (
          <li>
            Voting quorum:{' '}
            <span className='text-violet-500'>
              <NumberWithPercentageInput value={quorum} />{' '}
              {!data.token ? (
                'votes'
              ) : (
                <>
                  {' '}
                  token(s) <TokenInput address={data.token} />
                </>
              )}
            </span>
          </li>
        ) : null}
        {data.max !== undefined ? (
          <li>
            Wining threshold:{' '}
            <span className='text-violet-500'>
              <NumberWithPercentageInput value={data.max} />{' '}
              {!data.token ? (
                'votes'
              ) : (
                <>
                  {' '}
                  token(s) <TokenInput address={data.token} />
                </>
              )}
            </span>
            <SideNote value={resultDescription} />
          </li>
        ) : null}
      </ul>
    </>
  );
  return p1;
};

const VoteMachine: IVoteMachine = {
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

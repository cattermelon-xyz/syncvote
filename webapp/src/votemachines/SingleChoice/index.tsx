import {
  ShareAltOutlined,
  TwitterOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
  DelayUnit,
  ICheckPoint,
  IVoteMachine,
  IVoteMachineGetLabelProps,
} from '../../types';
import ConfigPanel from './ConfigPanel';
import { SingleChoice as Interface } from './interface';
import TokenInput from '@components/DirectedGraph/components/TokenInput';
import { displayDuration, isRTE } from '@components/DirectedGraph/utils';
import SideNote from '@components/DirectedGraph/components/SideNote';
import NumberWithPercentageInput from '@components/DirectedGraph/components/NumberWithPercentageInput';
import { SingleChoice as Funcs } from './funcs';
import { LuMapPin } from 'react-icons/lu';
import parse from 'html-react-parser';

const getLabel = (props: IVoteMachineGetLabelProps) => {
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

const getIcon = () => {
  return <ShareAltOutlined />;
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
  const noOfOptions = checkpoint.children ? checkpoint.children.length : 0;
  const resultDescription = checkpoint.resultDescription || '';
  const quorum = checkpoint.quorum || 0;
  const optionsDescription = checkpoint.optionsDescription;
  const renderOption = ({
    data,
    index,
  }: {
    data: Interface.IData;
    index: number;
  }) => {
    const { options } = data;
    const { delays, delayUnits, delayNotes } = checkpoint;
    const option = options[index];
    const delay = delays ? delays[index] : 0;
    const delayUnit = delayUnits ? delayUnits[index] : DelayUnit.MINUTE;
    const delayNote = delayNotes ? delayNotes[index] : '';
    return option ? (
      <>
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
      </>
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
                return <li key={index}>{renderOption({ data, index })}</li>;
              })}
              {checkpoint.includedAbstain ? (
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
const abstract = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: any;
}) => {
  const { votingLocation } = checkpoint || {};
  const threshold = data.max;
  const token = data.token;
  return threshold || isRTE(votingLocation) ? (
    <>
      {threshold ? (
        <div className='flex text-ellipsis items-center px-2'>
          <VerticalAlignTopOutlined className='mr-2' />
          {/* {`Threshold ${threshold} ${token}`} */}
          <div className='flex gap-1'>
            <span>Threshold</span>
            <NumberWithPercentageInput value={threshold} />
            {token ? <TokenInput address={token} /> : 'votes'}
          </div>
        </div>
      ) : null}
      {isRTE(votingLocation) ? (
        <div className='flex text-ellipsis items-center px-2'>
          <LuMapPin className='mr-2' />
          {parse(votingLocation || '')}
        </div>
      ) : null}
    </>
  ) : null;
};

const VoteMachine: IVoteMachine = {
  ConfigPanel: ConfigPanel,
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

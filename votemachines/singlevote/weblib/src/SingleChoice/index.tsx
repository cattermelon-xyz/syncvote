import {
  ShareAltOutlined,
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
import { SingleChoice as Interface } from './interface';
import { SingleChoice as Funcs } from './funcs';
import { LuMapPin } from 'react-icons/lu';
import parse from 'html-react-parser';
import VoteUIWeb from './VoteUIWeb';
import { Card, Popover } from 'antd';
import { Icon } from 'icon';

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
            <Popover
              key={Math.random()}
              content={
                <div>
                  <div className='mb-2 text-blue-500'>
                    @{trg.params.username}
                  </div>
                  <div>{trg.params.tweet}</div>
                </div>
              }
            >
              <TwitterOutlined key={trg.id || Math.random()} className='pr-2' />
            </Popover>
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

        <li>
          Voting options:{' '}
          <ul className='flex flex-col gap-1'>
            {noOfOptions ? (
              <>
                {data.options.map((option: string, index: number) => {
                  return <li key={index}>{renderOption({ data, index })}</li>;
                })}
                {checkpoint.includedAbstain ? (
                  <li className='text-violet-500'>Abstain</li>
                ) : null}
              </>
            ) : null}
          </ul>
        </li>

        <SideNote value={optionsDescription} />
        {quorum !== 0 || data.max !== 0 ? (
          <>
            {quorum !== 0 ? (
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
            {data.max !== 0 ? (
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
          </>
        ) : (
          <li>
            Result calculation:{' '}
            {resultDescription ? <SideNote value={resultDescription} /> : null}
          </li>
        )}
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
  const { votingLocation, quorum } = checkpoint || {};
  const threshold = data.max;
  const token = data.token;
  return threshold || isRTE(votingLocation) || quorum ? (
    <>
      {quorum ? (
        <div className='flex text-ellipsis items-center px-2'>
          <SolutionOutlined className='mr-2' />
          <div className='flex gap-1'>
            <span>Quorum</span>
            <NumberWithPercentageInput value={quorum} />
            {token ? <TokenInput address={token} /> : 'votes'}
          </div>
        </div>
      ) : null}
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

const RenderChoices = ({
  missionData,
  currentCheckpointData,
}: {
  missionData: any;
  currentCheckpointData: any;
}) => {
  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-4'>
        <p className='text-xl font-medium'>Votes</p>
        <div className='flex'>
          <p className='w-8/12'>Identity</p>
          <p className='w-4/12 text-right'>Vote</p>
        </div>
        {missionData.vote_record &&
          missionData.vote_record.map((record: any, recordIndex: number) => {
            return (
              <div className='flex mb-4' key={recordIndex}>
                <div className='w-8/12 flex items-center gap-2'>
                  <Icon iconUrl='' presetIcon='' size='medium' />
                  <p>{record.identify}</p>
                </div>
                {record.option.map((option: any, optionIndex: number) => {
                  const voteOption =
                    option === '-1'
                      ? 'Abstain'
                      : currentCheckpointData.data.options[parseInt(option)];
                  return (
                    <p key={optionIndex} className='w-4/12 text-right'>
                      {voteOption}
                    </p>
                  );
                })}
              </div>
            );
          })}
      </div>
    </Card>
  );
};

const VoteMachine: IVoteMachine = {
  ConfigPanel: ConfigPanel,
  VoteUIWeb: VoteUIWeb,
  RenderChoices: RenderChoices,
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

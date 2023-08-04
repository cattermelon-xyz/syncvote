import { ShareAltOutlined, TwitterOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Popover, Tag } from 'antd';
import { getVoteMachine } from '@components/DirectedGraph';
import {
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

const displayDuration = (duration: moment.Duration) => {
  const years =
    duration.years() === 0
      ? ''
      : `${duration.years()} ${duration.years() > 1 ? 'years' : 'year'} `;
  const months =
    duration.months() === 0
      ? ''
      : `${duration.months()} ${duration.months() > 1 ? 'months' : 'month'} `;
  const days =
    duration.days() === 0
      ? ''
      : `${duration.days()} ${duration.days() > 1 ? 'days' : 'day'} `;
  const hours =
    duration.hours() === 0
      ? ''
      : `${duration.hours()} ${duration.hours() > 1 ? 'hours' : 'hour'} `;
  const minutes =
    duration.minutes() === 0
      ? ''
      : `${duration.minutes()} ${
          duration.minutes() > 1 ? 'minutes' : 'minute'
        } `;
  const seconds =
    duration.seconds() === 0
      ? ''
      : `${duration.seconds()} ${
          duration.seconds() > 1 ? 'seconds' : 'second'
        } `;
  const drt = years + months + days + hours + minutes + seconds;
  return drt ? drt : '0 seconds';
};

const displayAddress = (address: string | undefined) => {
  if (!address) {
    return '';
  }
  const chain = address.split('.')[0] || '';
  const tokenName = address.split('.')[1] || '';
  const tokenAddress = address
    .replace(`${chain}.`, '')
    .replace(`${tokenName}.`, '');
  let explorer = tokenAddress;
  switch (chain) {
    case 'sol':
      explorer = 'https://explorer.solana.com/address/' + explorer;
      break;
    case 'eth':
      explorer = 'https://etherscan.io/address/' + explorer;
      break;
    case 'bsc':
      explorer = 'https://bscscan.com/address/' + explorer;
      break;
  }
  if (tokenName) {
    return (
      <a href={explorer} target='_blank' title={tokenAddress}>
        {tokenName}
      </a>
    );
  }
  return tokenAddress;
};

const isRTE = (str: string | undefined) => {
  return str && str !== '<p></p>' && str !== '<p><br></p>';
};

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
  const { participation, participationDescription } = checkpoint;
  const resultDescription = checkpoint.data?.resultDescription || '';
  const votingLocation = checkpoint.votingLocation || '';
  const renderParticipation = (participation: IParticipant | undefined) => {
    let rs = null;
    if (!participation || (participation.type && !participation.data)) {
      // rs = <div className='text-red-500'>Missing participation setup</div>;
      rs = '';
    } else {
      const { type, data: pdata } = participation;
      if (type === 'identity') {
        rs = (
          <span className='mr-1'>
            Only
            <span className='text-violet-500 mx-1'>
              {((pdata as string[]) || []).length}
            </span>
            can participate in the voting process.
          </span>
        );
      } else if (type === 'token') {
        rs = (
          <span className='mr-1'>
            The checkpoint is open for
            <span className='text-violet-500 mx-1'>
              {displayAddress((pdata as IToken)?.address)}
            </span>{' '}
            token/nft holders to vote with a minimum of
            <span className='text-violet-500 mx-1'>
              {(pdata as IToken)?.min}
            </span>{' '}
            tokens can participate.
          </span>
        );
      }
    }
    return rs;
  };
  const p1 = (
    <div className='block'>
      <ul className='list-disc ml-4'>
        {participation ? (
          <li>
            Voter:{' '}
            <span className='text-violet-500 font-bold'>
              {participation.type === 'token'
                ? `Token holder`
                : `Other identity`}
            </span>
          </li>
        ) : null}
        <li>
          Voting method:{' '}
          <span className='text-violet-500 font-bold'>Single Choice</span>
        </li>
        {data.max !== undefined ? (
          <li>
            Threshold:{' '}
            <span className='text-violet-500 font-bold'>
              {data.max < 1 ? `${data.max * 100}% ` : `${data.max} `}
            </span>
          </li>
        ) : null}
        {isRTE(resultDescription) ? (
          <li>Calculation Rules: {resultDescription}</li>
        ) : null}
      </ul>
      {checkpoint?.duration || isRTE(checkpoint?.votingLocation) ? (
        <>
          <hr className='my-2' style={{ borderTop: '1px solid #E3E3E2' }} />
          <ul className='list-disc ml-4'>
            {checkpoint?.duration ? (
              <li>
                Duration:{' '}
                <span className='font-bold text-violet-500'>
                  {displayDuration(
                    moment.duration((checkpoint?.duration || 0) * 1000)
                  )}
                </span>
              </li>
            ) : null}
            {isRTE(checkpoint?.votingLocation) ? (
              <li>
                Voting location:{' '}
                <span className='font-bold text-violet-500'>
                  {parse(checkpoint?.votingLocation || '')}
                </span>
              </li>
            ) : null}
          </ul>
        </>
      ) : null}
      {/* <div>
        Voting method is
        <Tag className='text-red-500 mx-2 font-bold'>
          {getVoteMachine(checkpoint.vote_machine_type || '')?.getName()}
        </Tag>
      </div> */}
      <hr className='my-2' style={{ borderTop: '1px solid #E3E3E2' }} />
      {renderParticipation(participation)}
      {isRTE(participationDescription) ? (
        <div className='p-2 border border-solid border-zinc-100 mt-2 rounded-lg border-zinc-200 bg-zinc-100'>
          {parse(participationDescription || '')}
        </div>
      ) : null}
      <div className='mt-2'>
        Each of them can vote ONE option from a list of
        <span className='text-violet-500 mx-1'>{noOfOptions}</span>
        options.
        {data.includedAbstain
          ? ' User can also choose to abstain from voting.'
          : ''}
      </div>
      {/* Only user with ... can vote. */}
      <hr className='my-2' style={{ borderTop: '1px solid #E3E3E2' }} />
      <div className='mb-2'>
        Winning option is the one that receive the highest number of votes and
        reach the threshold of{' '}
        <span className='text-violet-500 mx-1'>
          {data.max < 1 ? `${data.max * 100}% ` : `${data.max} `}
          {!data.token ? 'votes' : ` voted token ${data.token}`}
        </span>
        made by participants.
      </div>
      {isRTE(resultDescription) ? (
        <div className='p-2 border border-solid border-zinc-100 mt-2 rounded-lg border-zinc-200 bg-zinc-100'>
          {parse(resultDescription)}
        </div>
      ) : null}
      {isRTE(votingLocation) ? (
        <div>
          <hr className='my-2' style={{ borderTop: '1px solid #E3E3E2' }} />
          <div className='text-zinc-500'>Voting happens at</div>
          {parse(votingLocation)}
        </div>
      ) : null}
    </div>
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

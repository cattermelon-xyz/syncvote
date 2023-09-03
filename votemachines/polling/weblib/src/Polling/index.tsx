import { Popover } from 'antd';
import parse from 'html-react-parser';

import { IVoteMachine, ICheckPoint } from 'directed-graph';
import moment from 'moment';
import { TokenInput, isRTE, NumberWithPercentageInput } from 'directed-graph';
import { Polling as Interface } from './interface';
import { Polling as Funcs } from './funcs';
import { Polling } from './configPanel';
import { SolutionOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { LuMapPin } from 'react-icons/lu';

const explain = ({
  checkpoint,
  data, //eslint-disable-line
}: {
  checkpoint: ICheckPoint | undefined;
  data: Interface.IData;
}) => {
  // console.log(checkpoint, data);
  if (!checkpoint) {
    return <></>;
  }
  const { quorum } = checkpoint;
  const threshold = data.max;

  return (
    <div className='block'>
      <div className='text-zinc-400'>Voting format</div>
      <ul className='list-disc ml-4 w-full'>
        <li>
          Voting method:{' '}
          <span className='text-violet-500'>{Funcs.getName()}</span>
        </li>
        <li>
          Voting options: Up to{' '}
          <span className='text-violet-500 font-bold'>{data?.upTo || '0'}</span>{' '}
          option(s) from a list of {data?.options?.length} options
          <ul className='flex flex-col gap-1'>
            {data?.options?.map((opt: Interface.Option, idx: number) => {
              return (
                <li
                  className='text-violet-500'
                  title={opt.description}
                  key={opt.title}
                >
                  {opt.title}
                </li>
              );
            })}
          </ul>
        </li>
        {quorum !== undefined ? (
          <li>
            Voting quorum:{' '}
            <span className='text-violet-500'>
              <NumberWithPercentageInput value={quorum} />{' '}
              <TokenInput address={data.token || ''} />
            </span>
          </li>
        ) : null}
        {data.max !== undefined ? (
          <li>
            Wining threshold:{' '}
            <span className='text-violet-500'>
              <NumberWithPercentageInput value={data.max} />{' '}
              <TokenInput address={data.token || ''} />
            </span>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

const validate = ({
  checkpoint, //eslint-disable-line
}: {
  checkpoint: ICheckPoint | undefined;
}) => {
  let isValid = true;
  const message = [];
  if (!checkpoint?.children || checkpoint.children.length === 0) {
    isValid = false;
    message.push('Missing options');
  }
  if (!checkpoint?.data.upTo) {
    message.push('Missing number of vote user can choose up to');
  }
  if (!checkpoint?.data.max) {
    message.push('Missing number of vote an option must meet to be elected');
  }
  if (!checkpoint?.data.next) {
    message.push('Missing CheckPoint to redirect if this vote is passed');
  }
  if (!checkpoint?.data.fallback) {
    message.push(
      'Missing CheckPoint to redirect if this vote can not be decided'
    );
  }
  return {
    isValid,
    message,
  };
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

const VoteMachine: IVoteMachine = {
  ConfigPanel: Polling.ConfigPanel,
  getProgramAddress: Funcs.getProgramAddress,
  getName: Funcs.getName,
  deleteChildNode: Funcs.deleteChildNode,
  getLabel: Funcs.getLabel,
  getType: Funcs.getType,
  getIcon: Funcs.getIcon,
  getInitialData: Funcs.getInitialData,
  explain,
  validate,
  abstract,
};

export default VoteMachine;

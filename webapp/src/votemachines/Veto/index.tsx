import { Veto as Interface } from './interface';
import { Veto as Funcs } from './funcs';
import ConfigPanel from './configPanel';
import { ICheckPoint, IVoteMachine } from '@types';
import { Space } from 'antd';
import NumberWithPercentageInput from '@components/DirectedGraph/components/NumberWithPercentageInput';
import TokenInput from '@components/DirectedGraph/components/TokenInput';
import { isRTE } from '@components/DirectedGraph/utils';
import SideNote from '@components/DirectedGraph/components/SideNote';
import { SolutionOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { LuMapPin } from 'react-icons/lu';
import parse from 'html-react-parser';

const explain = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: any;
}) => {
  const { quorum, resultDescription } = checkpoint || {};
  const { token } = data || {};
  return (
    <Space direction='vertical' className='w-full'>
      <div className='text-gray-400'>Voting format</div>
      <ul className='ml-4'>
        <li>
          Voting mechanism:{' '}
          <span className='text-violet-500'>{Funcs.getName()}</span>
        </li>
        {quorum ? (
          <li>
            <span>
              Voting quorum:{' '}
              <span className='text-violet-500'>
                {<NumberWithPercentageInput value={quorum} />}
              </span>{' '}
              {token ? (
                <>
                  <TokenInput address={token} /> tokens
                </>
              ) : (
                'votes'
              )}
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
  const { votingLocation, quorum } = checkpoint || {};
  const token = data.token;
  const threshold = data.threshold;
  return quorum || isRTE(votingLocation) || threshold ? (
    <>
      {quorum ? (
        <div className='flex text-ellipsis items-center px-2'>
          <SolutionOutlined className='mr-2' />
          {/* {`Threshold ${threshold} ${token}`} */}
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
  ConfigPanel: ConfigPanel,
  getProgramAddress: Funcs.getProgramAddress,
  getName: Funcs.getName,
  deleteChildNode: Funcs.deleteChildNode,
  getLabel: Funcs.getLabel,
  getType: Funcs.getType,
  getIcon: Funcs.getIcon,
  getInitialData: Funcs.getInitialData,
  explain,
  validate: Funcs.validate,
  abstract,
};

export default VoteMachine;

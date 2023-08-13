import { Veto as Interface } from './interface';
import { Veto as Funcs } from './funcs';
import ConfigPanel from './configPanel';
import { ICheckPoint, IVoteMachine } from '@types';
import { Space } from 'antd';
import NumberWithPercentageInput from '@components/DirectedGraph/components/NumberWithPercentageInput';
import TokenInput from '@components/DirectedGraph/components/TokenInput';
import { isRTE } from '@components/DirectedGraph/utils';
import SideNote from '@components/DirectedGraph/components/SideNote';

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
};

export default VoteMachine;

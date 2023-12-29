import { Snapshot as Interface } from './interface';
import { Snapshot as Funcs } from './funcs';
import ConfigPanel from './ConfigPanel/index';
import { HiOutlineBolt } from 'react-icons/hi2';
import {
  ICheckPoint,
  IVoteMachine,
  NumberWithPercentageInput,
  TokenInput,
  SideNote,
  isRTE,
  IVoteMachineGetLabelProps,
} from 'directed-graph';
import { Space } from 'antd';
import { SolutionOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { LuMapPin } from 'react-icons/lu';
import parse from 'html-react-parser';
import VoteUIWeb from './VoteUIWeb';

const explain = ({
  checkpoint,
  data,
}: {
  checkpoint: ICheckPoint | undefined;
  data: any;
}) => {
  const { quorum, resultDescription } = checkpoint || {};
  const { token, threshold } = data || {};
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
        {threshold ? (
          <li>
            <span>
              Voting threshold:{' '}
              <span className='text-violet-500'>
                {<NumberWithPercentageInput value={threshold} />}
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
  const threshold = data.threshold;
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

// const getLabel = (props: IVoteMachineGetLabelProps) => {
//   const { source, target } = props;
//   console.log('GetLabel', source, target);

//   const data = source.data || {};
//   const { triggers } = source;
//   const filteredTriggers = triggers?.filter(
//     (trg: any) => trg.triggerAt === target.id
//   );
//   const children = source.children || [];
//   const idx = children.indexOf(target.id);
//   return data.options ? (
//     <div>
//       <div>{data.options[idx]}</div>
//       <div>
//         {filteredTriggers?.map((trg: any) =>
//           trg.provider === 'twitter' ? (
//             <TwitterOutlined key={trg.id || Math.random()} className='pr-2' />
//           ) : (
//             <span key={trg.id || Math.random()}>{trg.provider}</span>
//           )
//         )}
//       </div>
//     </div>
//   ) : (
//     <div>
//       {filteredTriggers?.map((trg: any) =>
//         trg.provider === 'twitter' ? (
//           <TwitterOutlined key={trg.id || Math.random()} className='pr-2' />
//         ) : (
//           <span key={trg.id || Math.random()}>{trg.provider}</span>
//         )
//       )}
//     </div>
//   );
// };
const getLabel = (props: IVoteMachineGetLabelProps) => {
  const { source, target } = props;
  const snapshotType = source?.data?.action;
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
      ) : null}
    </>
  );
};

const getIcon = () => {
  return <HiOutlineBolt />;
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

import { useState } from 'react';
import {
  DownOutlined,
  UpOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import parse from 'html-react-parser';
import renderVoteButton from './renderVoteButton';

const isInteractable = ({
  checkpointId,
  currentProposalData,
  user,
}: {
  checkpointId: string;
  currentProposalData: any;
  user: any;
}) => {
  const checkpoints = currentProposalData?.data?.checkpoints || [];
  const checkpoint = checkpoints.find(
    (checkpoint: any) => checkpoint.id === checkpointId
  );
  if (!checkpoint) return false;
  else if (checkpoint.vote_machine_type === 'forkNode' || checkpoint.isEnd)
    return false;
  else {
    const participation = checkpoint.participation;
    if (
      participation.type === 'identity' &&
      participation.data?.indexOf(user?.email) !== -1
    ) {
      return true;
    }
    return false;
  }
};

const VoteUI = ({
  currentProposalData,
  checkpointData,
  user,
}: {
  currentProposalData: any;
  checkpointData: any;
  user: any;
}) => {
  console.log('user: ', user);
  const [expanded, setExpanded] = useState(true);
  const { isEnd, vote_machine_type, title, endToVote, description } =
    checkpointData;
  const isExpired = moment(endToVote || 0).isBefore(moment());
  const isAuthorOnly = isInteractable({
    checkpointId: checkpointData.id,
    currentProposalData,
    user,
  });
  const isForkNode = vote_machine_type === 'forkNode';
  return !isEnd ? (
    <>
      <div
        className={`p-3 border  border-solid rounded ${
          isExpired
            ? 'bg-red-100 border-red-500'
            : 'bg-violet-100 border-violet-500'
        }`}
      >
        <ClockCircleOutlined
          className={`${isExpired ? 'text-red-500' : 'text-violet-500'}`}
        />
        <span
          className={`ml-2 ${isExpired ? 'text-red-500' : 'text-violet-500'}`}
        >
          {isExpired ? 'Expire ' : ''}
          {moment(endToVote || 0).fromNow()}
        </span>
      </div>
      <div className='bg-white p-3 rounded flex justify-between items-center'>
        <div>
          <div className='text-md font-bold'>{title}</div>
        </div>
        <div onClick={() => setExpanded(!expanded)}>
          {expanded ? <DownOutlined /> : <UpOutlined />}
        </div>
      </div>
      {expanded && (
        <>
          {description ? (
            <div className='bg-white p-3 rounded flex justify-between items-center'>
              {parse(description || '')}
            </div>
          ) : (
            <></>
          )}
          {isAuthorOnly && (
            <div>
              {renderVoteButton({ currentProposalData, checkpointData })}
            </div>
          )}
          {isForkNode && (
            <div>
              <div className='bg-white p-3 rounded flex justify-between items-center'>
                If forkNode then show multiple button from subMissions. If
                endNode then show message
              </div>
            </div>
          )}
          {!isAuthorOnly && !isForkNode && (
            <div className='bg-white p-3 rounded flex items-center'>
              <LoadingOutlined className='mr-1' />
              Waiting for admin(s) to take action
            </div>
          )}
          <div>Vote notes</div>
        </>
      )}
    </>
  ) : (
    <></>
  );
};

export default VoteUI;

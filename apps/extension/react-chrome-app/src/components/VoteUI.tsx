import { useState } from 'react';
import {
  DownOutlined,
  UpOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import parse from 'html-react-parser';
import VoteButton from './VoteButton';
import { Divider } from 'antd';
import { openWorkflowPage } from '../utils';

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
  reload,
  setLoading,
}: {
  currentProposalData: any;
  checkpointData: any;
  user: any;
  reload: any;
  setLoading: any;
}) => {
  console.log('user: ', user);
  const [expanded, setExpanded] = useState(true);
  const { workflow_id, workflow_version_id, org_id, mission_id } =
    currentProposalData;
  const { isEnd, vote_machine_type, title, endToVote, description } =
    checkpointData;
  const originalCheckPointId = checkpointData?.id?.replace(
    checkpointData?.mission_id,
    '-'
  );
  console.log('checkpointData: ', checkpointData);
  const isExpired = moment(endToVote || 0).isBefore(moment());
  const isAuthorOnly = isInteractable({
    checkpointId: checkpointData.id,
    currentProposalData,
    user,
  });
  const isForkNode = vote_machine_type === 'forkNode';
  return !isEnd ? (
    <>
      <div className='bg-white p-3 rounded flex justify-between items-center'>
        <div>
          <div>
            {isExpired
              ? 'Expired'
              : `${moment(endToVote || 0).fromNow(true)} left`}
          </div>
          <div className='text-md font-bold'>{title}</div>
          <Divider className='my-2' />
          <p
            className='w-full mt-2 text-[10px] cursor-pointer text-[#6200EE]'
            onClick={() => {
              openWorkflowPage(
                org_id,
                workflow_id,
                workflow_version_id,
                originalCheckPointId
              );
            }}
          >
            View Guideline
          </p>
        </div>
        <div onClick={() => setExpanded(!expanded)}>
          {expanded ? <DownOutlined /> : <UpOutlined />}
        </div>
      </div>
      {expanded && (
        <>
          {/* {description ? (
            <div className='bg-white p-3 rounded flex justify-between items-center'>
              {parse(description || '')}
            </div>
          ) : (
            <></>
          )} */}
          {isAuthorOnly && (
            <div>
              <VoteButton
                currentProposalData={currentProposalData}
                checkpointData={checkpointData}
                reload={reload}
                user={user}
                setLoading={setLoading}
              />
            </div>
          )}
          {isForkNode && (
            <div>
              <div className='bg-white p-3 rounded flex justify-between items-center'>
                TODO:Show multiple buttons
              </div>
            </div>
          )}
          {!isAuthorOnly && !isForkNode && (
            <div className='bg-white p-3 rounded flex items-center'>
              <LoadingOutlined className='mr-1' />
              Waiting for admin(s) to take action
            </div>
          )}

          <div className='bg-white p-3 rounded'>
            {checkpointData?.note ? (
              <div>{parse(checkpointData?.note)}</div>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </>
  ) : (
    <></>
  );
};

export default VoteUI;

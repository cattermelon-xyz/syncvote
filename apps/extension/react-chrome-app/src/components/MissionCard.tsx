import { Card, Tag } from 'antd';
import { PAGE_ROUTER } from '@constants/common';
import moment from 'moment';
import { MissionStatusTag } from './MissionStatusTag';

interface Props {
  proposal: any;
  setPage: any;
  setCurrentProposalId: any;
  user: any;
}

const MissionCard: React.FC<Props> = ({
  proposal,
  setPage,
  setCurrentProposalId,
  user,
}) => {
  let { startToVote, duration } = proposal;
  duration = duration === null ? 0 : duration;
  const endToVote = moment(startToVote).add(duration, 'seconds');
  return (
    <Card
      className='hover:shadow-xl cursor-pointer'
      bodyStyle={{ padding: '14px 12px' }}
      onClick={() => {
        setCurrentProposalId(proposal.id);
        setPage(PAGE_ROUTER.VOTING);
      }}
    >
      <MissionStatusTag
        user={user}
        mission={proposal}
        className='ml-[-6px] mb-2'
      />
      <p className='text-base text-gray-700 mb-4'>{proposal?.title}</p>
      <p className='text-xs text-gray-500'>
        {`End at ${moment(endToVote || 0).format('MMM Do,YYYY ')}`}&bull;{' '}
        {`${moment(endToVote || 0).format('h:mm a')}`}
      </p>
    </Card>
  );
};

export default MissionCard;

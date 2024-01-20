import { Card, Tag } from 'antd';
import { PAGE_ROUTER } from '@constants/common';
import moment from 'moment';
import { StatusTag } from './StatusTag';

interface Props {
  proposal: any;
  setPage: any;
  setCurrentProposalId: any;
}

const MissionCard: React.FC<Props> = ({
  proposal,
  setPage,
  setCurrentProposalId,
}) => {
  let { startToVote, duration } = proposal;
  duration = duration === null ? 0 : duration;
  const endToVote = moment(startToVote).add(duration, 'seconds');
  const tagClass = !(
    proposal?.status === 'DRAFT' || proposal?.status === 'STOPPED'
  )
    ? 'text-green-500 border-green-500 bg-green-100 rounded-xl'
    : 'bg-gray-200 rounded-xl';
  return (
    <Card
      className='hover:shadow-xl cursor-pointer'
      bodyStyle={{ padding: '14px 12px' }}
      onClick={() => {
        setCurrentProposalId(proposal.id);
        setPage(PAGE_ROUTER.VOTING);
      }}
    >
      <StatusTag
        color={
          proposal?.status === 'DRAFT' || proposal?.status === 'STOPPED'
            ? 'default'
            : 'active'
        }
        className='ml-[-6px] mb-2'
      >
        {proposal?.status === 'DRAFT' ? 'Draft' : proposal?.checkpoint_title}
      </StatusTag>
      <p className='text-base text-gray-700 mb-4'>{proposal?.title}</p>
      <p className='text-xs text-gray-500'>
        {`End at ${moment(endToVote || 0).format('MMM Do,YYYY ')}`}&bull;{' '}
        {`${moment(endToVote || 0).format('h:mm a')}`}
      </p>
    </Card>
  );
};

export default MissionCard;

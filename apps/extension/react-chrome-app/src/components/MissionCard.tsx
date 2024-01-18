import { Card, Tag } from 'antd';
import { PAGE_ROUTER } from '@constants/common';
import moment from 'moment';

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
      bodyStyle={{ padding: '14px', cursor: 'pointer', borderRadius: '12px' }}
      className='hover:shadow-xl transition duration-300 ease-in-out border-transparent'
      onClick={() => {
        setCurrentProposalId(proposal.id);
        setPage(PAGE_ROUTER.VOTING);
      }}
    >
      <div className='mb-4'>
        <Tag
          color={
            proposal?.status === 'DRAFT' || proposal?.status === 'STOPPED'
              ? 'default'
              : ''
          }
          className={tagClass}
          style={{ borderColor: 'transparent', left: '-8px' }}
        >
          {proposal?.status === 'DRAFT' ? 'Draft' : proposal?.checkpoint_title}
        </Tag>
        <p className='text-[16px] text-gray-700 mt-1'>{proposal?.title}</p>
      </div>
      <p className='text-[13px] text-gray-500'>
        {`End at ${moment(endToVote || 0).format('MMM Do,YYYY  ')}`}&bull;
        {`${moment(endToVote || 0).format('h:mm a')}`}
      </p>
    </Card>
  );
};

export default MissionCard;

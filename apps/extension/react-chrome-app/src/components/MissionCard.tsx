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
  console.log('proposal: ', proposal);
  let { startToVote, duration } = proposal;
  duration = duration === null ? 0 : duration;
  const endToVote = moment(startToVote).add(duration, 'seconds');
  return (
    <Card
      bodyStyle={{ padding: '12px' }}
      onClick={() => {
        setCurrentProposalId(proposal.id);
        setPage(PAGE_ROUTER.VOTING);
      }}
    >
      <Tag
        color={
          proposal?.status === 'DRAFT' || proposal?.status === 'STOPPED'
            ? 'default'
            : 'green'
        }
      >
        {proposal?.status === 'DRAFT' ? 'Draft' : proposal?.checkpoint_title}
      </Tag>
      <div className='flex flex-col gap-1 mt-1'>
        <p className='text-[13px]'>{proposal?.title}</p>
        <p className='text-[10px]'>{`End at ${moment(endToVote || 0).format(
          'MMM Do,YYYY - h:mm a'
        )}`}</p>
      </div>
    </Card>
  );
};

export default MissionCard;

import { Card, Tag } from 'antd';
import { PAGE_ROUTER } from '@constants/common';

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
  return (
    <Card
      bodyStyle={{ padding: '12px' }}
      onClick={() => {
        setCurrentProposalId(proposal.id);
        setPage(PAGE_ROUTER.VOTING);
      }}
    >
      <Tag color={proposal?.status === 'execution' ? 'default' : 'green'}>
        {proposal?.status === 'execution' ? 'Completed' : proposal?.status}
      </Tag>
      <div className='flex flex-col gap-1 mt-1'>
        <p className='text-[13px]'>{proposal?.title}</p>
        <p className='text-[10px]'>{`Updated at ${proposal?.last_updated}`}</p>
      </div>
    </Card>
  );
};

export default MissionCard;

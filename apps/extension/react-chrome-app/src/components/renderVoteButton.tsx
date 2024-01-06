import { Button } from 'antd';
import Discourse from '@assets/icons/Discourse';

const renderVoteButton = ({
  currentProposalData,
  checkpointData,
}: {
  currentProposalData: any;
  checkpointData: any;
}) => {
  const { vote_machine_type } = checkpointData;
  const action = checkpointData?.data?.action;
  let label = '';
  switch (vote_machine_type) {
    case 'SingleChoiceRaceToMax':
      const isAbstain = checkpointData?.isAbstain;
      const options = checkpointData?.data?.options || [];
      if (isAbstain) {
        options.push('Abstain');
      }
      return (
        <div>
          {options.map((option: any, index: number) => {
            return (
              <Button key={index} block className='flex items-center gap-1'>
                {option}
              </Button>
            );
          })}
        </div>
      );
    case 'Discourse':
      switch (action) {
        case 'create-topic':
          label = 'Create a Topic on Discourse';
          break;
        case 'move-topic':
          label = 'Move Topic to a diffrent Category';
          break;
        case 'update-topic':
          label = 'Update the Topic content';
          break;
        case 'create-post':
          label = 'Add new post';
          break;
      }
      return (
        <Button
          icon={<Discourse />}
          type='primary'
          className='flex items-center gap-1'
          block
        >
          {label}
        </Button>
      );
    case 'Snapshot':
      switch (action) {
        case 'create-proposal':
          label = 'Create a new Proposal';
          break;
        case 'sync-proposal':
          label = 'Sync Proposal Result';
          break;
      }
      return (
        <Button type='primary' block className='flex items-center gap-1'>
          {action}
        </Button>
      );
  }
};

export default renderVoteButton;

import { Button } from 'antd';
import Discourse from '@assets/icons/Discourse';
import { vote } from '../utils';
import { openMissionPage } from '../utils';

const VoteButton = ({
  currentProposalData,
  checkpointData,
  reload,
  user,
  setLoading,
}: {
  currentProposalData: any;
  checkpointData: any;
  reload: any;
  user: any;
  setLoading: any;
}) => {
  const { vote_machine_type } = checkpointData;
  const action = checkpointData?.data?.action;
  let label = '';
  console.log('checkpointData', currentProposalData);
  const orgId = currentProposalData?.org_id;
  const proposalId = currentProposalData?.mission_id;
  let jsxObject = <></>;
  switch (vote_machine_type) {
    case 'SingleChoiceRaceToMax':
      const isAbstain = checkpointData?.isAbstain;
      const options = checkpointData?.data?.options || [];
      if (isAbstain) {
        options.push('Abstain');
      }
      // TODO: user check must resides on server
      jsxObject = (
        <div className='flex flex-col gap-1'>
          {options.map((option: any, index: number) => {
            const selectedOption = option === 'Abstain' ? -1 : index;
            const data = {
              option: [selectedOption],
              mission_id: proposalId,
              identify: user.email,
            };
            return (
              <Button
                key={index}
                block
                className='flex items-center gap-1'
                onClick={async () => {
                  setLoading(true);
                  await vote(data);
                  setLoading(false);
                  reload();
                }}
              >
                {option}
              </Button>
            );
          })}
        </div>
      );
      break;
    case 'Discourse':
      switch (action) {
        case 'create-topic':
          label = 'Create a Topic on Discourse';
          break;
        case 'move-topic':
          label = 'Move Topic to a different Category';
          break;
        case 'update-topic':
          label = 'Update the Topic content';
          break;
        case 'create-post':
          label = 'Add new post';
          break;
      }
      jsxObject = (
        <Button
          icon={<Discourse />}
          type='primary'
          className='flex items-center gap-1'
          onClick={async () => {
            if (action === 'move-topic') {
              const data = {
                submission: {},
                mission_id: proposalId,
                identify: user.email,
              };
              await vote(data);
              reload();
            } else {
              openMissionPage(orgId, proposalId);
            }
          }}
          block
        >
          {label}
        </Button>
      );
      break;
    case 'Snapshot':
      switch (action) {
        case 'create-proposal':
          label = 'Create a new Proposal';
          break;
        case 'sync-proposal':
          label = 'Sync Proposal Result';
          break;
      }
      jsxObject = (
        <Button
          type='primary'
          block
          className='flex items-center gap-1'
          onClick={() => openMissionPage(orgId, proposalId)}
        >
          {label}
        </Button>
      );
      break;
    default:
      jsxObject = (
        <div>
          <div>Action not supported</div>
          <Button
            type='primary'
            block
            onClick={() => openMissionPage(orgId, proposalId)}
          >
            Go to Mission Page
          </Button>
        </div>
      );
  }
  return jsxObject;
};

export default VoteButton;

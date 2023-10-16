import { useEffect, useState } from 'react';
import { Card, Button, Radio } from 'antd';
import { getTimeRemainingToEnd } from '@utils/helpers';

interface Props {
  currentCheckpointData: any;
  onSelectedOption: any;
  setOpenModalVoterInfo: any;
  missionData: any;
  setSubmission: any;
  submission: any;
}

const VoteSection: React.FC<Props> = ({
  currentCheckpointData,
  onSelectedOption,
  setOpenModalVoterInfo,
  missionData,
  setSubmission,
  submission,
}) => {
  const [selectedOption, setSelectedOption] = useState<number>(-1);

  useEffect(() => {
    if (selectedOption) {
      onSelectedOption(selectedOption);
    }
  }, [selectedOption, currentCheckpointData]);

  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-6'>
        <p className='text-xl font-medium'>Vote</p>
        {currentCheckpointData.data.options.map((option: any, index: any) => (
          <Card className='w-full' key={index}>
            {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
            <Radio
              checked={
                selectedOption === (option === 'Abstain' ? -1 : index + 1)
              }
              onChange={() =>
                setSelectedOption(option === 'Abstain' ? -1 : index + 1)
              }
            >
              {`${index + 1}. ${option}`}
            </Radio>
          </Card>
        ))}
        <Button
          type='primary'
          className='w-full'
          onClick={() => setOpenModalVoterInfo(true)}
          disabled={selectedOption && getTimeRemainingToEnd(currentCheckpointData.endToVote) != "expired" ? false : true}
        >
          Vote
        </Button>
      </div>
    </Card>
  );
};

export default VoteSection;

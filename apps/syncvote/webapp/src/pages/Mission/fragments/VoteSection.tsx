import { useEffect, useState } from 'react';
import { Card, Button, Radio } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ModalUpdateDocInput from './ModalUpdateDocInput';
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
  const [openModalUpdateDocInput, setOpenModalUpdateDocInput] =
    useState<boolean>(false);

  useEffect(() => {
    if (selectedOption) {
      onSelectedOption(selectedOption);
    }
    console.log('currentCheckpointData', currentCheckpointData);
  }, [selectedOption, currentCheckpointData]);

  return (
    <div className='flex flex-col gap-4'>
      {currentCheckpointData &&
      currentCheckpointData.vote_machine_type === 'DocInput' ? (
        <Card className='p-4'>
          <div className='flex flex-col gap-4 mb-3 items-center'>
            <FileTextOutlined style={{ fontSize: '32px' }} />
            <p className='text-base'>
              Waiting for document updates from author
            </p>
          </div>
          <div className='flex flex-col gap-4 items-center'>
            <p className='text-sm'>
              {`Remaining ${getTimeRemainingToEnd(
                currentCheckpointData.endToVote
              )}`}
            </p>
            <Button
              type='primary'
              className='w-full'
              onClick={() => setOpenModalUpdateDocInput(true)}
            >
              Update documents
            </Button>
          </div>
        </Card>
      ) : (
        <></>
      )}
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
            disabled={selectedOption ? false : true}
          >
            Vote
          </Button>
        </div>
      </Card>
      {currentCheckpointData && missionData && (
        <ModalUpdateDocInput
          open={openModalUpdateDocInput}
          onClose={() => setOpenModalUpdateDocInput(false)}
          currentCheckpointData={currentCheckpointData}
          missionData={missionData}
          setSubmission={setSubmission}
          submission={submission}
        />
      )}
    </div>
  );
};

export default VoteSection;

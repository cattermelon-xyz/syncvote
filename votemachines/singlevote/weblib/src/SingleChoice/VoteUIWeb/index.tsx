import React from 'react';
import { useEffect, useState } from 'react';
import { Card, Button, Radio } from 'antd';

interface Props {
  currentCheckpointData: any;
  setOpenModalVoterInfo: any;
  onSelectedOption: any;
}

const VoteUIWeb = (props: Props): JSX.Element => {
  const { currentCheckpointData, setOpenModalVoterInfo, onSelectedOption } =
    props;

  const [selectedOption, setSelectedOption] = useState<number>();

  useEffect(() => {
    if (selectedOption) {
      onSelectedOption(selectedOption);
    }
  }, [selectedOption]);

  return (
    <div>
      <Card className='p-4'>
        <div className='flex flex-col gap-6'>
          <p className='text-xl font-medium'>Vote</p>
          <>
            {currentCheckpointData.data.options.map(
              (option: any, index: any) => (
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
              )
            )}
          </>
          <Button
            type='primary'
            className='w-full'
            onClick={async () => {
              setOpenModalVoterInfo(true);
            }}
            disabled={
              selectedOption
                ? // && getTimeRemainingToEnd(currentCheckpointData.endToVote) !='expired'
                  false
                : true
            }
          >
            Vote
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VoteUIWeb;
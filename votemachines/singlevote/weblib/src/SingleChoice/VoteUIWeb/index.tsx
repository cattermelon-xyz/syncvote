import React from 'react';
import { useEffect, useState } from 'react';
import { Card, Button, Radio } from 'antd';
import { IVoteUIWebProps } from 'directed-graph';

// onSubmit: (data: any) => void; // submit the choice & its data
//   missionData: any; // data of the mission
//   checkpointData: any; // data of current checkpoint

const VoteUIWeb = (props: IVoteUIWebProps): JSX.Element => {
  const { onSubmit, missionData, checkpointData } = props;
  const [selectedOption, setSelectedOption] = useState<any>(null);
  return (
    <div>
      <Card className='p-4'>
        <div className='flex flex-col gap-6'>
          <p className='text-xl font-medium'>Vote</p>
          <>
            {checkpointData.data.options.map((option: any, index: any) => (
              <Card className='w-full' key={index}>
                {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
                <Radio
                  checked={
                    selectedOption === (option === 'Abstain' ? -1 : index)
                  }
                  onChange={() =>
                    setSelectedOption(option === 'Abstain' ? -1 : index)
                  }
                >
                  {`${index + 1}. ${option}`}
                </Radio>
              </Card>
            ))}
          </>
          <Button
            type='primary'
            className='w-full'
            onClick={async () => {
              onSubmit({ option: [selectedOption] });
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

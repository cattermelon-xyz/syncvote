import { Button, Card, Progress } from 'antd';
import MissionProgress from './MissionProgress';
import moment from 'moment';
import {
  formatDate,
  getTimeElapsedSinceStart,
  getTimeRemainingToEnd,
} from '@utils/helpers';

const MissionProgressSummary = ({
  missionData,
  currentCheckpointData,
  setOpenModalListParticipants,
  setHistoricalCheckpointData,
}: {
  missionData: any;
  currentCheckpointData: any;
  setOpenModalListParticipants: any;
  setHistoricalCheckpointData?: any;
}) => {
  let isReachedQuorum = false;
  if (missionData.result) {
    const totalVotingPower = Object.values(missionData.result).reduce(
      (acc: number, voteData: any) => acc + voteData.voting_power,
      0
    );
    if (totalVotingPower >= currentCheckpointData.quorum) {
      isReachedQuorum = true;
    }
  }
  return (
    <>
      {missionData?.progress && (
        <MissionProgress
          missionData={missionData}
          setHistoricalCheckpointData={setHistoricalCheckpointData}
        />
      )}

      {missionData.result ? (
        <Card className=''>
          <p className='mb-6 text-base font-semibold'>Voting results</p>

          {currentCheckpointData.data.options?.map(
            (option: any, index: any) => {
              // still calculate voting_power of Abstain but not show in result
              if (option === 'Abstain') {
                return <div key={-1}></div>;
              }
              let totalVotingPower = 0;
              let percentage = 0;

              totalVotingPower = Object.values(missionData.result).reduce(
                (acc: number, voteData: any) => acc + voteData.voting_power,
                0
              );

              if (currentCheckpointData.quorum >= totalVotingPower) {
                percentage =
                  (missionData.result[index]?.voting_power /
                    currentCheckpointData.quorum) *
                  100;
              } else {
                percentage =
                  (missionData.result[index]?.voting_power / totalVotingPower) *
                  100;
              }
              percentage = parseFloat(percentage.toFixed(2));

              return (
                <div key={index} className='flex flex-col gap-2'>
                  <p className='text-base font-semibold'>{option}</p>
                  <p className='text-base'>
                    {missionData.result[option]} votes
                  </p>
                  <Progress percent={percentage} size='small' />
                </div>
              );
            }
          )}

          {isReachedQuorum ? (
            <div className='w-full flex justify-center items-center mt-2'>
              <Button className='w-full bg-[#EAF6EE] text-[#29A259]'>
                Reached required quorum
              </Button>
            </div>
          ) : (
            <div className='w-full flex justify-center items-center mt-2'>
              <Button className='w-full'>Not reached quorum</Button>
            </div>
          )}
        </Card>
      ) : null}

      {currentCheckpointData.isEnd ? null : (
        <>
          <Card className=''>
            <p className='mb-4 text-base font-semibold'>Rules & conditions</p>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between'>
                <p className='text-base '>Start time</p>
                <p className='text-base font-semibold'>
                  {getTimeElapsedSinceStart(missionData.startToVote)}
                </p>
              </div>
              <p className='text-right'>
                {formatDate(missionData.startToVote)}
              </p>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between'>
                <p className='text-base '>Remaining duration</p>
                <p className='text-base font-semibold'>
                  {getTimeRemainingToEnd(currentCheckpointData.endToVote)}
                </p>
              </div>

              {currentCheckpointData.isEnd ? (
                <></>
              ) : (
                <p className='text-right'>
                  {formatDate(currentCheckpointData.endToVote)}
                </p>
              )}
            </div>

            <>
              <hr className='w-full my-4' />
              <div className='flex justify-between'>
                <p className='text-base '>Who can vote</p>
                <p
                  className='text-base font-semibold text-[#6200EE] cursor-pointer'
                  onClick={() => setOpenModalListParticipants(true)}
                >
                  View details
                </p>
              </div>
              <hr className='w-full my-4' />
              {currentCheckpointData?.data?.threshold ? (
                <div>
                  <div className='flex justify-between'>
                    <p className='text-base '>Threshold counted by</p>
                    <p className='text-base font-semibold'>Total votes made</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-base '>Threshold</p>
                    <p className='text-base font-semibold'>
                      {currentCheckpointData?.data?.threshold}
                    </p>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className='flex justify-between'>
                <p className='text-base '>Quorum</p>
                <p className='text-base font-semibold'>
                  {currentCheckpointData.quorum} votes
                </p>
              </div>
            </>
          </Card>
        </>
      )}
    </>
  );
};

export default MissionProgressSummary;

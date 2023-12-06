import { useEffect, useState } from 'react';
import { Card, Button, Radio } from 'antd';
import { VM_TYPE } from '@utils/constants/votemachine';
import { getVoteMachine } from 'directed-graph';
// =============================== METAMASK SECTION ===============================
import { isExternalProvider } from '../MissionVotingDetail';
import { Web3Provider } from '@ethersproject/providers';
import moment from 'moment';
import { supabase } from 'utils';
import Client from '@snapshot-labs/snapshot.js/dist/sign';
// =============================== METAMASK SECTION ===============================

interface Props {
  currentCheckpointData: any;
  onSelectedOption: any;
  setOpenModalVoterInfo: any;
  missionData: any;
  setSubmission: any;
  submission: any;
  dataOfAllDocs: any;
  listVersionDocs: any;
  proposal?: any;
  client?: Client;
}

const VoteSection: React.FC<Props> = ({
  currentCheckpointData,
  onSelectedOption,
  setOpenModalVoterInfo,
  missionData,
  setSubmission,
  dataOfAllDocs,
  listVersionDocs,
  proposal,
  client,
}) => {
  const [selectedOption, setSelectedOption] = useState<number>();

  const [voteMachine, setVoteMachine] = useState<any>(null);

  const createVote = async () => {
    let web3;
    if (isExternalProvider(window.ethereum)) {
      web3 = new Web3Provider(window.ethereum);
    }

    if (web3 && client && selectedOption) {
      const accounts = await web3.listAccounts();
      const receipt = await client.vote(web3, accounts[0], {
        space: currentCheckpointData?.data?.space,
        proposal: proposal?.id,
        type: currentCheckpointData?.data?.type?.value,
        choice: selectedOption - 1,
        reason: 'Choice 1 make lot of sense',
        app: 'my-app',
      });
    }
  };

  useEffect(() => {
    if (
      currentCheckpointData &&
      currentCheckpointData?.vote_machine_type === VM_TYPE.DOC_INPUT
    ) {
      const machine = getVoteMachine(currentCheckpointData?.vote_machine_type);
      setVoteMachine(machine);
    }
  }, [currentCheckpointData]);

  useEffect(() => {
    console.log('voteMachine', voteMachine);
  }, [voteMachine]);

  return (
    <div className='flex flex-col gap-4'>
      {/* {currentCheckpointData?.vote_machine_type === VM_TYPE.DOC_INPUT && <></>} */}

      {voteMachine &&
      currentCheckpointData?.vote_machine_type === VM_TYPE.DOC_INPUT ? (
        <voteMachine.VoteUIWeb
          onSelectedOption={onSelectedOption}
          currentCheckpointData={currentCheckpointData}
          dataOfAllDocs={dataOfAllDocs}
          listVersionDocs={listVersionDocs}
          missionData={missionData}
          setSubmission={setSubmission}
          setOpenModalVoterInfo={setOpenModalVoterInfo}
        />
      ) : (
        <Card className='p-4'>
          <div className='flex flex-col gap-6'>
            <p className='text-xl font-medium'>Vote</p>
            {proposal ? (
              <>
                {proposal.choices.map((option: any, index: any) => (
                  <Card className='w-full' key={index}>
                    {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
                    <Radio
                      checked={selectedOption === index + 1}
                      onChange={() => setSelectedOption(index + 1)}
                    >
                      {`${index + 1}. ${option}`}
                    </Radio>
                  </Card>
                ))}
              </>
            ) : (
              <>
                {currentCheckpointData.data.options.map(
                  (option: any, index: any) => (
                    <Card className='w-full' key={index}>
                      {/* selectedOption === index + 1 because 0 === false can't not check radio button */}
                      <Radio
                        checked={
                          selectedOption ===
                          (option === 'Abstain' ? -1 : index + 1)
                        }
                        onChange={() =>
                          setSelectedOption(
                            option === 'Abstain' ? -1 : index + 1
                          )
                        }
                      >
                        {`${index + 1}. ${option}`}
                      </Radio>
                    </Card>
                  )
                )}
              </>
            )}

            <Button
              type='primary'
              className='w-full'
              onClick={async () => {
                if (!proposal) {
                  setOpenModalVoterInfo(true);
                } else {
                  await createVote();
                }
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
      )}
    </div>
  );
};

export default VoteSection;

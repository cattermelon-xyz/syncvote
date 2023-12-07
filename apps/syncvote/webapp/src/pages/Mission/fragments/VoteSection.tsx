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
  proposalData?: any;
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
  proposalData,
  client,
}) => {
  const [voteMachine, setVoteMachine] = useState<any>(null);

  useEffect(() => {
    if (currentCheckpointData) {
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
      ) : voteMachine &&
        currentCheckpointData?.vote_machine_type === VM_TYPE.SINGLE_VOTE ? (
        <voteMachine.VoteUIWeb
          onSelectedOption={onSelectedOption}
          currentCheckpointData={currentCheckpointData}
          setOpenModalVoterInfo={setOpenModalVoterInfo}
        />
      ) : voteMachine &&
        currentCheckpointData?.vote_machine_type === VM_TYPE.SNAPSHOT ? (
        <voteMachine.VoteUIWeb
          proposalData={proposalData}
          onSelectedOption={onSelectedOption}
          currentCheckpointData={currentCheckpointData}
          client={client}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default VoteSection;

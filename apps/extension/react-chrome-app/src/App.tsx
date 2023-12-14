import { getCurrentUser } from '@configs/getCurrentUser';
import { getLastProposalId } from '@configs/getLastProposalId';
import { useEffect, useState } from 'react';
import { PAGE_ROUTER } from '@constants/common';
import {
  Login,
  CreateProposal,
  HomePage,
  DoneCreateProposal,
  Voting,
} from '@pages';
import { queryAMissionDetail } from '@data/mission';
import { queryMission } from '@data/mission';
import { extractCurrentCheckpointId } from './utils';

function App() {
  const [user, setUser] = useState<any>();
  const [page, setPage] = useState<string>(PAGE_ROUTER.HOME_PAGE);
  const [currentProposalId, setCurrentProposalId] = useState<number>();
  const [currentProposalData, setCurrentProposalData] = useState<any>();
  const [currentOrgData, setCurrentOrgData] = useState<any>();
  const [dataMissions, setDataMissions] = useState<any>();
  const [currentCheckpointData, setCurrentCheckpointData] = useState<any>();
  const [listVersionDocs, setListVersionDocs] = useState<any[]>();

  useEffect(() => {
    getCurrentUser().then((resp) => {
      if (resp) {
        setUser(resp.user);
      } else {
        console.log('user is not found');
      }
    });
    getLastProposalId().then((resp) => {
      if (resp) {
        setCurrentProposalId(resp.id);
      }
    });
  }, []);

  useEffect(() => {
    console.log('inUseEffect ** currentProposalId', currentProposalId);
    if (currentProposalId && currentProposalId !== -1) {
      queryAMissionDetail({
        missionId: currentProposalId,
        onSuccess: (data: any) => {
          console.log('data query', data);
          setCurrentProposalData(data);
          const currentCheckpointId = extractCurrentCheckpointId(data.id);
          const checkpointData = data?.data?.checkpoints.filter(
            (checkpoint: any) => checkpoint.id === currentCheckpointId
          );
          const listVersionDocs = data?.progress.flatMap((progress: any) => {
            return progress?.tallyResult?.submission || [];
          });
          setListVersionDocs(listVersionDocs);
          console.log('missiondata', data);
          console.log('checkpointData', checkpointData[0]);
          let checkpointDataAfterHandle = checkpointData[0];

          if (!checkpointData[0].isEnd) {
            const startToVote = new Date(data.startToVote);
            // convert second to millisecond of duration
            const duration = checkpointData[0].duration * 1000;
            const endTovote = new Date(
              startToVote.getTime() + duration
            ).toISOString();
            checkpointDataAfterHandle.endToVote = endTovote;
          }

          switch (checkpointData[0]?.vote_machine_type) {
            case 'SingleChoiceRaceToMax':
              if (checkpointData[0]?.includedAbstain === true) {
                checkpointDataAfterHandle.data.options.push('Abstain');
              }
              break;
            case 'UpVote':
              checkpointDataAfterHandle.data.options = [];
              checkpointDataAfterHandle.data.options.push('Upvote');
              if (checkpointData[0]?.includedAbstain === true) {
                checkpointDataAfterHandle.data.options.push('Abstain');
              }
              break;
            case 'Veto':
              checkpointDataAfterHandle.data.options = [];
              checkpointDataAfterHandle.data.options.push('Upvote');
              if (checkpointData[0]?.includedAbstain === true) {
                checkpointDataAfterHandle.data.options.push('Abstain');
              }
              break;
            default:
              break;
          }
          setCurrentCheckpointData(checkpointDataAfterHandle);
        },
        onError: (error) => {
          console.log('error', error);
        },
      });
    }
  }, [currentProposalId]);

  useEffect(() => {
    if (currentOrgData) {
      queryMission({
        orgId: currentOrgData?.id,
        onSuccess: (data) => {
          const filteredMissions = data.filter(
            (missionData: any) => missionData?.creator_id === user?.id
          );
          setDataMissions(filteredMissions);
        },
        onError: (error) => {
          console.log('error', error);
        },
      });
    }
  }, [currentOrgData, user]);

  // useEffect(() => {
  //   console.log('user', user);
  //   console.log('currentProposalId', currentProposalId);
  //   console.log('currentOrgData', currentOrgData);
  //   console.log('dataMissions', dataMissions);
  // }, [currentProposalData, currentProposalId, currentOrgData, dataMissions]);

  return (
    <div className='w-[260px] h-[380px] pt-[13px] pb-1 px-3 rounded-xl bg-[#F4F4F4] overflow-y-auto'>
      {user === null || user === undefined ? (
        <Login />
      ) : currentProposalData ? (
        <Voting
          setPage={setPage}
          currentProposalData={currentProposalData}
          currentCheckpointData={currentCheckpointData}
          setCurrentProposalId={setCurrentProposalId}
          setCurrentProposalData={setCurrentProposalData}
        />
      ) : page === PAGE_ROUTER.HOME_PAGE ? (
        <HomePage
          user={user}
          setPage={setPage}
          setCurrentOrgData={setCurrentOrgData}
          setCurrentProposalId={setCurrentProposalId}
          dataMissions={dataMissions}
        />
      ) : currentOrgData && page === PAGE_ROUTER.CREATE_PROPOSAL ? (
        <CreateProposal
          setPage={setPage}
          currentOrgData={currentOrgData}
          setCurrentProposalId={setCurrentProposalId}
          user={user}
        />
      ) : page === PAGE_ROUTER.DONE_CREATE_PROPOSAL ? (
        <DoneCreateProposal setPage={setPage} />
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;

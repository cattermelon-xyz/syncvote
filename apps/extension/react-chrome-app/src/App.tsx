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
import { Spin } from 'antd';

const Loading = () => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <Spin />
    </div>
  );
};

function App() {
  const [user, setUser] = useState<any>();
  const [page, setPage] = useState<string>(PAGE_ROUTER.HOME_PAGE);
  const [currentProposalId, setCurrentProposalId] = useState<number>();
  const [currentProposalData, setCurrentProposalData] = useState<any>();
  const [currentOrgData, setCurrentOrgData] = useState<any>();
  const [myMissions, setMyMissions] = useState<any>();
  const [followingMissions, setFollowingMissions] = useState<any[]>();
  const [currentCheckpointData, setCurrentCheckpointData] = useState<any>();
  const [lastRequest, setLastRequest] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getCurrentUser().then((resp) => {
      if (resp) {
        setUser(resp.user);
        setLoading(false);
      } else {
        console.log('user is not found');
      }
    });
    getLastProposalId().then((resp) => {
      console.log('Get last proposal Id');

      if (resp) {
        console.log(resp);
        setCurrentProposalId(resp.id);
        setLoading(false);
      }
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    // console.log('inUseEffect ** currentProposalId', currentProposalId);
    if (currentProposalId && currentProposalId !== -1) {
      setLoading(true);
      queryAMissionDetail({
        missionId: currentProposalId,
        onSuccess: (data: any) => {
          console.log('current proposal data', data);
          setCurrentProposalData(data);
          const currentCheckpointId = extractCurrentCheckpointId(data.id);
          const checkpointData = data?.data?.checkpoints.filter(
            (checkpoint: any) => checkpoint.id === currentCheckpointId
          );
          // console.log('missiondata', data);
          // console.log('checkpointData', checkpointData[0]);
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

          setCurrentCheckpointData(checkpointDataAfterHandle);
          setLoading(false);
        },
        onError: (error) => {
          console.log('error', error);
          setLoading(false);
        },
      });
    }
  }, [currentProposalId, lastRequest]);

  useEffect(() => {
    if (currentOrgData) {
      queryMission({
        orgId: currentOrgData?.id,
        onSuccess: (data) => {
          const tmpMyMissions = data.filter(
            (missionData: any) =>
              missionData?.creator_id === user?.id && missionData.title
          );
          const tmpFollowingMissions = data.filter(
            (missionData: any) =>
              missionData?.creator_id !== user?.id && missionData.title
          );
          tmpMyMissions.sort((a: any, b: any) => {
            return b.id - a.id;
          });
          tmpFollowingMissions.sort((a: any, b: any) => {
            return b.id - a.id;
          });
          // console.log('tmpFollowingMissions', tmpFollowingMissions);
          setMyMissions(tmpMyMissions);
          setFollowingMissions(tmpFollowingMissions);
          setLoading(false);
        },
        onError: (error) => {
          console.log('error', error);
          setLoading(false);
        },
      });
    }
  }, [currentOrgData, user]);

  return (
    <div className='w-[357px] h-[600px] pt-[13px] pb-1 px-3 rounded-xl bg-[#F4F4F4] overflow-y-auto no-scrollbar'>
      {loading === true ? (
        <Loading />
      ) : user === null || user === undefined ? (
        <Login />
      ) : currentProposalData ? (
        <Voting
          setPage={setPage}
          currentProposalData={currentProposalData}
          currentCheckpointData={currentCheckpointData}
          setCurrentProposalId={setCurrentProposalId}
          setCurrentProposalData={setCurrentProposalData}
          user={user}
          reload={() => {
            setLastRequest(new Date().getTime());
          }}
          setLoading={setLoading}
        />
      ) : page === PAGE_ROUTER.HOME_PAGE ? (
        <HomePage
          user={user}
          setPage={setPage}
          setCurrentOrgData={setCurrentOrgData}
          setCurrentProposalId={setCurrentProposalId}
          myMissions={myMissions}
          followingMissions={followingMissions}
          setLoading={setLoading}
        />
      ) : currentOrgData && page === PAGE_ROUTER.CREATE_PROPOSAL ? (
        <CreateProposal
          setPage={setPage}
          currentOrgData={currentOrgData}
          setCurrentProposalId={setCurrentProposalId}
          user={user}
          setLoading={setLoading}
        />
      ) : page === PAGE_ROUTER.DONE_CREATE_PROPOSAL ? (
        <DoneCreateProposal
          setPage={setPage}
          currentProposalData={currentProposalData}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default App;

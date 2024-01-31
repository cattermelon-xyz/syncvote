import { getCurrentUser } from '@configs/getCurrentUser';
import {
  getLastOrgId,
  getLastPage,
  getLastProposalId,
} from '@configs/getLastValue';
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
import Loading from '@pages/Loading';

function App() {
  const [user, setUser] = useState<any>(-1);
  const [page, _setPage] = useState<string>(PAGE_ROUTER.HOME_PAGE);
  const setPage = async (val: string) => {
    _setPage(val);
    await chrome.runtime.sendMessage({
      action: 'saveLastPage',
      payload: val,
    });
  };
  const [currentProposalId, setCurrentProposalId] = useState<number>();
  const [currentProposalData, setCurrentProposalData] = useState<any>();
  const [currentOrgData, setCurrentOrgData] = useState<any>();
  const [currentOrgId, _setCurrentOrgId] = useState<string>();
  const setCurrentOrgId = async (val: string) => {
    await chrome.runtime.sendMessage({
      action: 'saveLastOrgId',
      payload: val,
    });
    console.log('save last org id', val);
    _setCurrentOrgId(val);
  };
  const [myMissions, setMyMissions] = useState<any[]>([]);
  const [followingMissions, setFollowingMissions] = useState<any[]>([]);
  const [currentCheckpointData, setCurrentCheckpointData] = useState<any>();
  const [lastRequest, setLastRequest] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getCurrentUser().then((resp) => {
      setLoading(false);
      if (resp) {
        setUser(resp.user);
      } else {
        setUser(null);
      }
    });
    getLastProposalId().then((resp) => {
      setLoading(false);
      if (resp) {
        setCurrentProposalId(resp.id);
      }
    });
    getLastPage().then((resp) => {
      setLoading(false);
      if (resp) {
        _setPage(resp);
      }
    });
    getLastOrgId().then((resp) => {
      setLoading(false);
      if (resp) {
        _setCurrentOrgId(resp);
      }
    });
  }, []);

  useEffect(() => {
    // console.log('inUseEffect ** currentProposalId', currentProposalId);
    if (currentProposalId && currentProposalId !== -1) {
      setLoading(true);
      queryAMissionDetail({
        missionId: currentProposalId,
        onSuccess: (data: any) => {
          setLoading(false);
          setCurrentProposalData({
            ...data,
            checkpoint_participation: data.participation,
            checkpoint_inHappyPath: data.inHappyPath,
          });
          const currentCheckpointId = extractCurrentCheckpointId(data.id);
          const checkpointData = data?.data?.checkpoints.filter(
            (checkpoint: any) => checkpoint.id === currentCheckpointId
          );
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
        },
        onError: (error) => {
          console.log('error queryAMissionDetail:', error);
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
          setLoading(false);
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
        },
        onError: (error) => {
          console.log('error currentOrgData: ', error);
          setLoading(false);
        },
      });
    }
  }, [currentOrgData, user]);

  return (
    <div className='w-[357px] h-[600px] pt-[20px] pb-1 px-5 rounded-xl bg-[#F4F4F4] overflow-y-auto no-scrollbar'>
      {loading === true ? (
        <Loading />
      ) : user === null || user === undefined ? (
        <Login />
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
      ) : page === PAGE_ROUTER.VOTING && currentProposalData ? (
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
      ) : (
        <HomePage
          user={user}
          setPage={setPage}
          setCurrentOrgData={setCurrentOrgData}
          setCurrentOrgId={setCurrentOrgId}
          currentOrgId={currentOrgId}
          setCurrentProposalId={setCurrentProposalId}
          myMissions={myMissions}
          followingMissions={followingMissions}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}

export default App;

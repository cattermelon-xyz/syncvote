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
import { queryDemo } from '@data/org';
import { queryMission } from '@data/mission';

function App() {
  const [user, setUser] = useState<any>();
  const [page, setPage] = useState<string>(PAGE_ROUTER.HOME_PAGE);
  const [dataDemo, setDataDemo] = useState<any>();
  const [currentProposalId, setCurrentProposalId] = useState<number>();
  const [currentProposalData, setCurrentProposalData] = useState<any>();
  const [currentOrgData, setCurrentOrgData] = useState<any>();
  const [dataMissions, setDataMissions] = useState<any>();

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
    if (user) {
      queryDemo({
        onSuccess: (data) => {
          data.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          setDataDemo(data);
        },
        onError: (error) => {
          console.log('error', error);
        },
      });
    }
  }, [user, page]);

  useEffect(() => {
    console.log('inUseEffect ** currentProposalId', currentProposalId);
    if (currentProposalId && currentProposalId !== -1 && dataDemo) {
      const data = dataDemo.filter(
        (data: any) => data.id === currentProposalId
      );
      setCurrentProposalData(data[0]);
    }
  }, [currentProposalId, dataDemo]);

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

  useEffect(() => {
    console.log('dataDemo', dataDemo);
    console.log('user', user);
    console.log('currentProposalId', currentProposalId);
    console.log('currentOrgData', currentOrgData);
    console.log('dataMissions', dataMissions);
  }, [
    dataDemo,
    currentProposalData,
    currentProposalId,
    currentOrgData,
    dataMissions,
  ]);

  return (
    <div className='w-[260px] h-[380px] pt-[13px] pb-1 px-3 rounded-xl bg-[#F4F4F4] overflow-y-auto'>
      {user === null || user === undefined ? (
        <Login />
      ) : currentProposalData ? (
        <Voting
          setPage={setPage}
          currentProposalData={currentProposalData}
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

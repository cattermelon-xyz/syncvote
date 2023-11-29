import { getCurrentUser } from '@configs/getCurrentUser';
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

function App() {
  const [user, setUser] = useState<any>();
  const [page, setPage] = useState<string>(PAGE_ROUTER.HOME_PAGE);
  const [dataDemo, setDataDemo] = useState<any>();
  const [currentProposalId, setCurrentProposalId] = useState<number>();
  const [currentProposalData, setCurrentProposalData] = useState<any>();

  useEffect(() => {
    getCurrentUser().then((resp) => {
      if (resp) {
        setUser(resp.user);
      } else {
        console.log('user is not found');
      }
    });
  }, []);

  useEffect(() => {
    console.log('test user', user);
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
    if (currentProposalId && dataDemo) {
      const data = dataDemo.filter(
        (data: any) => data.id === currentProposalId
      );
      setCurrentProposalData(data[0]);
    }
  }, [currentProposalId, dataDemo]);

  useEffect(() => {
    console.log('dataDemo', dataDemo);
    console.log('currentProposalId', currentProposalId);
    console.log('currentProposalData on Homepage', currentProposalData);
  }, [dataDemo, currentProposalData, currentProposalId]);

  return (
    <div className='w-[260px] h-[380px] pt-[13px] pb-1 px-3 rounded-xl bg-[#F4F4F4] overflow-y-auto'>
      {user === null || user === undefined ? (
        <Login />
      ) : page === PAGE_ROUTER.HOME_PAGE ? (
        <HomePage
          user={user}
          setPage={setPage}
          dataDemo={dataDemo}
          setCurrentProposalId={setCurrentProposalId}
        />
      ) : page === PAGE_ROUTER.CREATE_PROPOSAL ? (
        <CreateProposal
          setPage={setPage}
          setCurrentProposalId={setCurrentProposalId}
        />
      ) : page === PAGE_ROUTER.DONE_CREATE_PROPOSAL ? (
        <DoneCreateProposal setPage={setPage} />
      ) : page === PAGE_ROUTER.VOTING && currentProposalData ? (
        <Voting
          setPage={setPage}
          currentProposalData={currentProposalData}
          setCurrentProposalId={setCurrentProposalId}
          setCurrentProposalData={setCurrentProposalData}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;

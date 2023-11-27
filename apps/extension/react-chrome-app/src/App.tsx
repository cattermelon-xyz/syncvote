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

function App() {
  const [user, setUser] = useState<any>();
  const [page, setPage] = useState<string>(PAGE_ROUTER.HOME_PAGE);

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
    console.log('page', page);
  }, [user, page]);

  return (
    <div className='w-[260px] h-[380px] pt-[13px] px-3 rounded-xl bg-[#F4F4F4] overflow-y-auto'>
      {user === null || user === undefined ? (
        <Login />
      ) : page === PAGE_ROUTER.HOME_PAGE ? (
        <HomePage setPage={setPage} />
      ) : page === PAGE_ROUTER.CREATE_PROPOSAL ? (
        <CreateProposal setPage={setPage} />
      ) : page === PAGE_ROUTER.DONE_CREATE_PROPOSAL ? (
        <DoneCreateProposal setPage={setPage} />
      ) : page === PAGE_ROUTER.VOTING ? (
        <Voting setPage={setPage} />
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;

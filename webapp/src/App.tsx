import { useEffect, useState } from 'react';
import './index.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '@layout/fragments/Header';
import MainLayout from '@layout/MainLayout';
import { supabase } from '@utils/supabaseClient';
import { Session } from '@supabase/gotrue-js';
import { useSelector, useDispatch } from 'react-redux';
import GlobalLoading from '@components/GlobalLoading/GlobalLoading';
import { registerVoteMachine } from '@components/DirectedGraph';
import { setUser } from '@redux/reducers/orginfo.reducer';

import SingleChoiceRaceToMax from '@votemachines/SingleChoiceRaceToMax';
import MultipleChoiceRaceToMax from '@votemachines/MultipleChoiceRaceToMax';
import { queryOrgs, queryPresetBanner, queryPresetIcon } from '@middleware/data';
import { shouldUseCachedData } from '@utils/helpers';

function App({
  isFullHeight = false,
} : {
  isFullHeight?: boolean,
}) {
  // const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  // const token = window.localStorage.getItem('isConnectWallet');
  const [session, setSession] = useState<Session | null>(null);
  const {
    presetIcons, presetBanners, initialized,
  } = useSelector((state:any) => state.ui);
  const {
    lastFetch,
  } = useSelector((state:any) => state.orginfo);
  const dispatch = useDispatch();
  const handleSession = async (_session: Session | null) => {
    setSession(_session);
    if (_session === null) {
      navigate('/login');
    }
    if (_session !== null) {
      // query to server to get preset icons and banners
      queryPresetBanner({
        dispatch, presetBanners,
      });
      queryPresetIcon({
        dispatch, presetIcons,
      });
    }
    if (_session !== null) {
      const { user } = _session as Session;
      if (!shouldUseCachedData(lastFetch)) {
        queryOrgs({
          filter: {
            userId: user.id,
          },
          onSuccess: () => {},
          dispatch,
        });
      }
      if (initialized === false) {
        dispatch(setUser({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name,
        }));
      }
    }
  };
  // query from redux user info
  useEffect(() => {
    // if (!token) {
    //   navigate(PAGE_ROUTES.CONNECT_WALLET);
    // }
    supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
      await handleSession(_session);
    });
    registerVoteMachine(SingleChoiceRaceToMax);
    registerVoteMachine(MultipleChoiceRaceToMax);
  }, []);
  return (
    <div className={`w-full ${isFullHeight ? 'bg-slate-100 h-screen' : null}`}>
      <GlobalLoading />
      <Header
        // isAuth={isAuth}
        // setIsAuth={setIsAuth}
        session={session}
        isMainAppFullHeight={isFullHeight}
      />
      <MainLayout isFullHeight={isFullHeight}>
        <Outlet
          context={{
            // isAuth,
            // setIsAuth,
            session,
          }}
        />
      </MainLayout>
    </div>
  );
}
export default App;

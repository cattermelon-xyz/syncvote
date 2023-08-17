import { useEffect, useState, ReactNode } from 'react';
import './index.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@utils/supabaseClient';
import { Session } from '@supabase/gotrue-js';
import { useSelector, useDispatch } from 'react-redux';
import GlobalLoading from '@components/GlobalLoading/GlobalLoading';
import { registerVoteMachine } from '@components/DirectedGraph';
import { setUser } from '@redux/reducers/orginfo.reducer';
import { useLocation } from 'react-router-dom';
import SingleChoice from '@votemachines/SingleChoice';
import Polling from '@votemachines/Polling';
import Veto from '@votemachines/Veto';
import UpVote from '@votemachines/UpVote';
import {
  queryOrgs,
  queryPresetBanner,
  queryPresetIcon,
  queryUserById,
} from '@middleware/data';
import { shouldUseCachedData } from '@utils/helpers';
import { AuthContext } from '@layout/context/AuthContext';

function App({
  requiredLogin = false,
  layout,
}: {
  requiredLogin?: boolean;
  layout: any;
}) {
  // const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  // const token = window.localStorage.getItem('isConnectWallet');
  const { loading } = useSelector((state: any) => state.ui);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();
  const { presetIcons, presetBanners, initialized } = useSelector(
    (state: any) => state.ui
  );
  const { lastFetch } = useSelector((state: any) => state.orginfo);
  const dispatch = useDispatch();
  const handleSession = async (_session: Session | null) => {
    if (requiredLogin === true && _session === null) {
      navigate('/login');
    }
    setSession(_session);
    if (_session !== null) {
      // query to server to get preset icons and banners
      queryPresetBanner({
        dispatch,
        presetBanners,
      });
      queryPresetIcon({
        dispatch,
        presetIcons,
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
        queryUserById({
          userId: user.id,
          onSuccess: () => {},
          dispatch,
        });
        // console.log('user', user);
        // dispatch(
        //   setUser({
        //     id: user.id,
        //     email: user.email,
        //     full_name: user.user_metadata.full_name,
        //     // avatar_url: user.user_metadata.avatar_url,
        //   })
        // );
      }
    }
  };
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
      await handleSession(_session);
    });
    registerVoteMachine(SingleChoice);
    registerVoteMachine(Polling);
    registerVoteMachine(Veto);
    registerVoteMachine(UpVote);
  }, []);
  const Layout: any = layout;
  return (
    <AuthContext.Provider value={{ session }}>
      <Layout>
        <GlobalLoading loading={loading} />
        <Outlet />
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;

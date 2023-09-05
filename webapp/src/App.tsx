import { useEffect, useState, ReactNode, useContext } from 'react';
import './index.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@utils/supabaseClient';
import { Session } from '@supabase/gotrue-js';
import { useSelector, useDispatch } from 'react-redux';
import GlobalLoading from '@components/GlobalLoading/GlobalLoading';
import { registerVoteMachine } from '@components/DirectedGraph';
import SingleChoice from '@votemachines/SingleChoice';
import Polling from '@votemachines/Polling';
import Veto from '@votemachines/Veto';
import UpVote from '@votemachines/UpVote';
import { AuthContext } from '@layout/context/AuthContext';
import { useGetDataHook } from '@dal/dal';
import { ConfigTypes, config } from '@dal/config';
interface AppProps {
  requiredLogin?: boolean;
  layout: any;
}

const App: React.FC<AppProps> = ({ requiredLogin = false, layout }) => {
  const { loading, initialized } = useSelector((state: any) => state.ui);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
      if (_session === null) {
        navigate('/login');
      }
      setSession(_session);
    });

    registerVoteMachine(SingleChoice);
    registerVoteMachine(Polling);
    registerVoteMachine(Veto);
    registerVoteMachine(UpVote);
  }, []);


  useGetDataHook({
    cacheOption: true,
    configInfo: config.queryPresetBanner,
  });

  useGetDataHook({
    cacheOption: true,
    configInfo: config.queryUserById,
  });

  useGetDataHook({
    cacheOption: true,
    configInfo: config.queryOrgs,
  });

  const Layout: any = layout;
  return (
    <AuthContext.Provider value={{ session }}>
      <Layout>
        <GlobalLoading loading={loading} />
        <Outlet />
      </Layout>
    </AuthContext.Provider>
  );
};

export default App;

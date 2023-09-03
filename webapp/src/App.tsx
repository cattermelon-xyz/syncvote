import { useEffect, useState, ReactNode } from 'react';
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
  const navigate = useNavigate();
  const { loading, initialized } = useSelector((state: any) => state.ui);
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionFetched, setIsSessionFetched] = useState<boolean>(false);

  useGetDataHook({
    cacheOption: false,
    configInfo: config.queryPresetIcon,
  });

  useGetDataHook({
    cacheOption: false,
    configInfo: config.queryPresetBanner,
  });

  if (isSessionFetched && session) {
    
    useGetDataHook({
      params: session,
      cacheOption: false,
      configInfo: config.queryUserById,
    });
  }

  const handleSession = async (_session: Session | null) => {
    if (requiredLogin === true && _session === null) {
      navigate('/login');
    }
    setSession(_session);
    setIsSessionFetched(true);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: _session } }) => {
      handleSession(_session);
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
};

export default App;

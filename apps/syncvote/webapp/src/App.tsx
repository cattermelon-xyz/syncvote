import { useEffect, useState, ReactNode, useContext } from 'react';
import './index.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from 'utils';
import { Session } from '@supabase/gotrue-js';
import { useSelector, useDispatch } from 'react-redux';
import GlobalLoading from '@components/GlobalLoading/GlobalLoading';
import { registerVoteMachine } from 'directed-graph';
import { setUser } from '@redux/reducers/orginfo.reducer';
import { useLocation } from 'react-router-dom';
import { SingleChoice } from 'single-vote';
import { Polling } from 'polling';
import { Veto } from 'veto';
import { UpVote } from 'upvote';
import { AuthContext } from '@layout/context/AuthContext';

function App({ layout }: { layout: any }) {
  // const [isAuth, setIsAuth] = useState(false);
  // const token = window.localStorage.getItem('isConnectWallet');
  const { loading } = useSelector((state: any) => state.ui);
  const { session } = useContext(AuthContext);
  useEffect(() => {
    registerVoteMachine(SingleChoice);
    registerVoteMachine(Polling);
    registerVoteMachine(Veto);
    registerVoteMachine(UpVote);
  }, [session]);
  const Layout: any = layout;
  return (
    <Layout>
      <GlobalLoading loading={loading} />
      <Outlet />
    </Layout>
  );
}

export default App;

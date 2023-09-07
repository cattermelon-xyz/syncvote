/* eslint-disable max-len */
import App from '@App';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import PublicAppLayout from '@layout/PublicAppLayout';
import NotFound404 from '@pages/NotFound404';
import PublicRoutes from './PublicRoutes';
import AuthRoutes from './AuthRoutes';
import OrgRoutes from './OrgRoutes';
import AccountRoutes from './AccountRoutes';
import EditorRoutes from './EditorRoutes';
import { AuthContext } from '@layout/context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from 'utils';
import { Session } from '@supabase/supabase-js';
import { useDispatch, useSelector } from 'react-redux';
import {
  queryOrgs,
  queryPresetBanner,
  queryPresetIcon,
  queryUserById,
} from '@middleware/data';
import { shouldUseCachedData } from '@utils/helpers';
import LoadingPage from '@pages/LoadingPage';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import { MySpace, OrganizationExplore, SharedSpace } from '@pages/Organization';
import { min } from 'moment';
import WebLayout from '@layout/WebLayout';
import TemplateDetail from '@pages/Template/Detail';
import { TemplateViewData } from '@pages/Template/ViewData';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';
const env = import.meta.env.VITE_ENV;

const AppRoutes = () => {
  const [session, setSession] = useState<Session | null | false>(false);
  const { presetIcons, presetBanners, initialized } = useSelector(
    (state: any) => state.ui
  );
  const { lastFetch } = useSelector((state: any) => state.orginfo);
  const dispatch = useDispatch();
  const handleSession = async (_session: Session | null | false) => {
    setSession(_session);
    if (_session !== null) {
      queryPresetBanner({
        dispatch,
        presetBanners,
      });
      queryPresetIcon({
        dispatch,
        presetIcons,
      });
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
      if (initialized === false && user !== null) {
        queryUserById({
          userId: user.id,
          onSuccess: () => {},
          dispatch,
        });
      }
    }
  };
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
      await handleSession(_session);
    });
    supabase.auth.onAuthStateChange((event, newSession) => {
      if (
        (session !== null && newSession === null) ||
        (session === null && newSession !== null)
      ) {
        handleSession(newSession);
      }
    });
  }, []);
  return session === false ? (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='*' element={<LoadingPage />} />
      </Routes>
    </BrowserRouter>
  ) : (
    <AuthContext.Provider
      value={{ session, isAuth: session !== null ? true : false }}
    >
      <BrowserRouter basename='/'>
        <Routes>
          {PublicRoutes}
          {AuthRoutes}
          {EditorRoutes}
          {OrgRoutes}
          {AccountRoutes}
          <Route path='/' element={<App layout={WebLayoutWithoutSider} />}>
            <Route
              path='template/:templateIdString'
              element={<TemplateDetail />}
            />
          </Route>
          <Route path='/' element={<App layout={NoHeaderAppLayout} />}>
            <Route
              path='template/detail/:templateIdString'
              element={<TemplateViewData />}
            />
          </Route>
          {env === 'production' && session !== null ? (
            <Route path='/' element={<App layout={WebLayout} />}>
              <Route index element={<MySpace />} />
              <Route path='/explore' element={<OrganizationExplore />} />
            </Route>
          ) : null}
          {env === 'dev' && session !== null ? (
            <Route path='/' element={<App layout={WebLayout} />}>
              <Route index element={<MySpace />} />
              <Route path='/explore' element={<OrganizationExplore />} />
              <Route path='/shared' element={<SharedSpace />} />
            </Route>
          ) : null}
          {session === null ? (
            <Route path='*' element={<App layout={WebLayoutWithoutSider} />}>
              <Route index element={<OrganizationExplore />} />
            </Route>
          ) : null}
          <Route path='*' element={<App layout={PublicAppLayout} />}>
            <Route index element={<NotFound404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default AppRoutes;

/* eslint-disable max-len */
import App from '@App';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import PublicAppLayout from '@layout/PublicAppLayout';
import NotFound404 from '@pages/NotFound404';
import PublicRoutes from './PublicRoutes';
import AuthRoutes from './AuthRoutes';
import OrgRoutes from './OrgRoutes';
import HomeRoutes from './HomeRoutes';
import TemplateRoutes from './TemplateRoutes';
import AccountRoutes from './AccountRoutes';
import EditorRoutes from './EditorRoutes';
import VotingRoutes from './VotingRoutes';
import { AuthContext } from '@layout/context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase, useGetDataHook } from 'utils';
import { Session } from '@supabase/supabase-js';
import LoadingPage from '@pages/LoadingPage';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import {
  MySpace,
  OrganizationExplore,
  SharedSpace,
  HomeTemplate,
} from '@pages/Organization';
import WebLayout from '@layout/WebLayout';
import TemplateDetail from '@pages/Template/Detail';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';
import { config } from '@dal/config';
import DocDetail from '@pages/Mission/DocDetail';
import DemoRoutes from './DemoRoutes';
const env = import.meta.env.VITE_ENV;

const AppRoutes = () => {
  const [session, setSession] = useState<Session | null | false>(false);

  useGetDataHook({
    configInfo: config.queryPresetIcons,
  });

  useGetDataHook({
    configInfo: config.queryPresetBanners,
  });

  useGetDataHook({
    configInfo: config.queryUserById,
  });

  useGetDataHook({
    configInfo: config.queryOrgs,
  });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: _session } }) => {
      setSession(_session);
    });
    supabase.auth.onAuthStateChange((event, newSession) => {
      if (
        (session !== null && newSession === null) ||
        (session === null && newSession !== null)
      ) {
        setSession(newSession);
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
          {VotingRoutes}
          {HomeRoutes}
          {TemplateRoutes}
          {DemoRoutes}
          <Route path='/' element={<App layout={WebLayoutWithoutSider} />}>
            <Route
              path='doc/:orgIdString/:workflowIdString/:versionIdString/:docId'
              element={<DocDetail />}
            />
          </Route>
          {session === null ? (
            <Route path='*' element={<App layout={WebLayoutWithoutSider} />}>
              <Route index element={<HomeTemplate />} />
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

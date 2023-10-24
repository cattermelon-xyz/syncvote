import App from '@App';
import WebLayout from '@layout/WebLayout';
import React from 'react';
import { Route } from 'react-router-dom';
const env = import.meta.env.VITE_ENV;
import {
  OrganizationExplore,
  MySpace,
  SharedSpace,
  HomeTemplate,
} from '@pages/Organization';
import RequireAuth from './RequireAuth';

export default (
  <React.Fragment>
    {env === 'production' ? (
      <>
        <Route
          path='/'
          element={
            <RequireAuth homeTemplate={<HomeTemplate />}>
              <App layout={WebLayout} />
            </RequireAuth>
          }
        >
          <Route index element={<MySpace />} />
          <Route path='/explore' element={<OrganizationExplore />} />
          <Route path='/shared' element={<SharedSpace />} />
          <Route path='/templates' element={<HomeTemplate />} />
        </Route>
      </>
    ) : null}
    {env === 'dev' ? (
      <>
        <Route
          path='/'
          element={
            <RequireAuth homeTemplate={<HomeTemplate />}>
              <App layout={WebLayout} />
            </RequireAuth>
          }
        >
          <Route index element={<MySpace />} />
          <Route path='/explore' element={<OrganizationExplore />} />
          <Route path='/shared' element={<SharedSpace />} />
          <Route path='/templates' element={<HomeTemplate />} />
        </Route>
      </>
    ) : null}
  </React.Fragment>
);

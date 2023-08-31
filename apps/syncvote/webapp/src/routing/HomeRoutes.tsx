import App from '@App';
import WebLayout from '@layout/WebLayout';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import React from 'react';
import { Route } from 'react-router-dom';
const env = import.meta.env.VITE_ENV;
import {
  OrganizationExplore,
  OrganizationSetting,
  MySpace,
  SharedSpace,
} from '@pages/Organization';

export default (
  <React.Fragment>
    {env === 'production' ? (
      <Route
        path='/'
        element={<App layout={WebLayoutWithoutSider} requiredLogin={true} />}
      >
        <Route index element={<MySpace />} />
      </Route>
    ) : null}
    {env === 'dev' ? (
      <>
        <Route
          path='/'
          element={<App layout={WebLayout} requiredLogin={true} />}
        >
          <Route index element={<OrganizationExplore />} />
          <Route path='/my-workspaces' element={<MySpace />} />
          <Route path='/shared-workspaces' element={<SharedSpace />} />
        </Route>
      </>
    ) : null}
  </React.Fragment>
);

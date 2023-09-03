import App from '@App';
import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import AccountSetting from '@pages/Account/pages/AccountSetting';
import PageScreen from '@components/HomeScreen/PageScreen';
import RequireAuth from './RequireAuth';

export default (
  <React.Fragment>
    <Route
      path='/'
      element={
        <RequireAuth>
          <App layout={WebLayoutWithoutSider} />
        </RequireAuth>
      }
    >
      <Route path='account'>
        <Route path='setting' element={<AccountSetting />} />
      </Route>
      <Route path='onboard' element={<PageScreen />} />
    </Route>
  </React.Fragment>
);

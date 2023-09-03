import App from '@App';
import NoHeaderLayout from '@layout/NoHeader';
import React from 'react';
import { Route } from 'react-router-dom';
import CreatorLogin from '@pages/Authentication/index';
import SignUpWithInvite from '@pages/Account/pages/SignUpWithInvite';

export default (
  <React.Fragment>
    <Route
      path='/'
      element={<App layout={NoHeaderLayout} requiredLogin={false} />}
    >
      <Route path='login' element={<CreatorLogin />} />
    </Route>
    <Route
      path='/'
      element={<App layout={NoHeaderLayout} requiredLogin={true} />}
    >
      <Route path='set-password' element={<SignUpWithInvite />} />
    </Route>
  </React.Fragment>
);

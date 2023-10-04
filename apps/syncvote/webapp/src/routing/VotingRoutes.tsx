import App from '@App';
import React from 'react';
import { Route } from 'react-router-dom';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import Voting from '@pages/Mission/Voting';

export default (
  <React.Fragment>
    <Route path='/' element={<App layout={WebLayoutWithoutSider} />}>
      <Route path=':orgIdString/:missionIdString' element={<Voting />} />
    </Route>
  </React.Fragment>
);

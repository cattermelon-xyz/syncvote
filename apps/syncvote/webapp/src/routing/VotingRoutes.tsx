import App from '@App';
import React from 'react';
import { Route } from 'react-router-dom';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import MissionVotingDetail from '@pages/Mission/MissionVotingDetail';

export default (
  <React.Fragment>
    <Route path='/' element={<App layout={WebLayoutWithoutSider} />}>
      <Route
        path=':orgIdString/:missionIdString'
        element={<MissionVotingDetail />}
      />
    </Route>
  </React.Fragment>
);

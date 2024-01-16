import App from '@App';
import React from 'react';
import { Route } from 'react-router-dom';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import MissionVotingDetail from '@pages/Mission/MissionVotingDetail';
import MissionEditor from '@pages/Mission/MissionEditor';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';

export default (
  <React.Fragment>
    <Route path='/' element={<App layout={WebLayoutWithoutSider} />}>
      <Route
        path=':orgIdString/:missionIdString'
        element={<MissionVotingDetail />}
      />
    </Route>
    <Route path='/' element={<App layout={NoHeaderAppLayout} />}>
      <Route
        path=':orgIdString/:missionIdString/vote'
        element={<MissionEditor />}
      />
    </Route>
  </React.Fragment>
);

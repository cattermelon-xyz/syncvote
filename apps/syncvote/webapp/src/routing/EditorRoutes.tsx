import App from '@App';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';
import Mission from '@pages/Mission';
import EditMission from '@pages/Mission/EditMission';
import { EditVersion } from '@pages/Workflow/Version';
import React from 'react';
import { Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';

export default (
  <React.Fragment>
    <Route
      path='/'
      element={
        <RequireAuth>
          <App layout={NoHeaderAppLayout} />
        </RequireAuth>
      }
    >
      <Route
        path=':orgIdString/:workflowIdString/:versionIdString'
        element={<EditVersion />}
      />
    </Route>
    <Route
      path='/'
      element={
        <RequireAuth>
          <App layout={NoHeaderAppLayout} />
        </RequireAuth>
      }
    >
      <Route path=':orgIdString/mission/:missionIdString' element={<Mission />}>
        <Route index element={<EditMission />} />
      </Route>
    </Route>
  </React.Fragment>
);

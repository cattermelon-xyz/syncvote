import App from '@App';
import AppLayout from '@layout/AppLayout';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';
import Mission from '@pages/Mission';
import EditMission from '@pages/Mission/EditMission';
import { EditVersion } from '@pages/Workflow/Version';
import React from 'react';
import { Route } from 'react-router-dom';

export default (
  <React.Fragment>
    <Route
      path='/'
      element={<App layout={NoHeaderAppLayout} requiredLogin={true} />}
    >
      <Route
        path=':orgIdString/:workflowIdString/:versionIdString'
        element={<EditVersion />}
      />
    </Route>
    <Route path='/' element={<App layout={AppLayout} requiredLogin={true} />}>
      <Route path=':orgIdString/mission/:missionIdString' element={<Mission />}>
        <Route index element={<EditMission />} />
      </Route>
    </Route>
  </React.Fragment>
);

import App from '@App';
import PublicAppLayout from '@layout/PublicAppLayout';
import NotFound404 from '@pages/NotFound404';
import { PublicVersion } from '@pages/Workflow/Version/PublicVersion';
import React from 'react';
import { Route } from 'react-router-dom';

export default (
  <React.Fragment>
    <Route
      path='/public'
      element={<App layout={PublicAppLayout} requiredLogin={false} />}
    >
      <Route
        path=':orgIdString/:workflowIdString/:versionIdString'
        element={<PublicVersion />}
      ></Route>
      <Route path='*' element={<NotFound404 />} />
    </Route>
  </React.Fragment>
);

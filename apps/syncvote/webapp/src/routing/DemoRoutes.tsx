import App from '@App';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';
import { EditVersion } from '@pages/Workflow/Version';
import React from 'react';
import { Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import { CreateSnapshot } from '@pages/Demo/CreateSnapshot';

export default (
  <React.Fragment>
    <Route
      path='/demo'
      element={
        <RequireAuth>
          <App layout={NoHeaderAppLayout} />
        </RequireAuth>
      }
    >
      {/* <Route path='create_topic/:missions_demo_id' element={<EditVersion />} /> */}
      <Route
        path='create_snapshot/:missions_demo_id'
        element={<CreateSnapshot />}
      />
      {/* <Route path='create_tally/:missions_demo_id' element={<EditVersion />} /> */}
    </Route>
  </React.Fragment>
);

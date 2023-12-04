import App from '@App';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';
import React from 'react';
import { Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import { CreateSnapshot } from '@pages/Demo/CreateSnapshot';
import { CreateTopic } from '@pages/Demo/CreateTopic';
import { UpdateDescAndMoveCat } from '@pages/Demo/UpdateDescAndMoveCat';

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
      <Route path='create_topic/:missions_demo_id' element={<CreateTopic />} />
      <Route
        path='update_desc_move_post/:missions_demo_id'
        element={<UpdateDescAndMoveCat />}
      />
      <Route
        path='create_snapshot/:missions_demo_id'
        element={<CreateSnapshot />}
      />
      {/* <Route path='create_tally/:missions_demo_id' element={<EditVersion />} /> */}
    </Route>
  </React.Fragment>
);
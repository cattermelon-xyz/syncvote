import React from 'react';
import { Route } from 'react-router-dom';
import App from '@App';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import { OrganizationSetting } from '@pages/Organization';
import ChooseWorkflow from '@pages/Mission/ChooseWorkflow';
import ChooseTemplate from '@pages/Workflow/BuildBlueprint/ChooseTemplate';
import Workflow from 'pages/Workflow';
import NewMission from '@pages/Mission/NewMission';
import { NewVersion } from '@pages/Workflow/Version';
import NotFound404 from '@pages/NotFound404';
import WebLayout from '@layout/WebLayout';
import BluePrint from '@pages/Workflow/BluePrint';

const env = import.meta.env.VITE_ENV;
export default (
  <React.Fragment>
    {env === 'production' ? (
      <>
        <Route
          path='/'
          element={<App layout={WebLayoutWithoutSider} requiredLogin={true} />}
        >
          <Route path=':orgIdString'>
            <Route index element={<BluePrint />} />
          </Route>
        </Route>
      </>
    ) : null}
    {env === 'dev' ? (
      <>
        <Route
          path='/'
          element={<App layout={WebLayoutWithoutSider} requiredLogin={true} />}
        >
          <Route path=':orgIdString'>
            <Route path='setting' element={<OrganizationSetting />} />
            <Route path='new-workflow' element={<ChooseTemplate />} />
            <Route path='new-mission' element={<ChooseWorkflow />} />
            <Route path='workflow/:workflowIdString' element={<Workflow />}>
              <Route path='new-version' element={<NewVersion />} />
              <Route
                path=':versionIdString/new-mission'
                element={<NewMission />}
              />
              <Route path='*' element={<NotFound404 />} />
            </Route>
          </Route>
        </Route>
        <Route
          path='/'
          element={<App layout={WebLayout} requiredLogin={true} />}
        >
          <Route path=':orgIdString'>
            <Route index element={<BluePrint />} />
          </Route>
        </Route>
      </>
    ) : null}
  </React.Fragment>
);

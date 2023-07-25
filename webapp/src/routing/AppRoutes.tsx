/* eslint-disable max-len */
import App from '@App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageScreen from '@components/HomeScreen/PageScreen';
import ChooseWorkflow from '@pages/Mission/ChooseWorkflow';
import ChooseTemplate from '@pages/Workflow/BuildBlueprint/ChooseTemplate';
import Mission from 'pages/Mission';
import Workflow from 'pages/Workflow';
import {
  OrganizationExplore,
  OrganizationSetting,
  MySpace,
  SharedSpace,
} from '@pages/Organization';
import CreatorLogin from '@pages/Authentication/index';
import BluePrint from '@pages/Workflow/BluePrint';
import { EditVersion, NewVersion } from '@pages/Workflow/Version';
import NewMission from '@pages/Mission/NewMission';
import EditMission from '@pages/Mission/EditMission';
import AppLayout from '@layout/AppLayout';
import NoHeaderLayout from '@layout/NoHeader';
import WebLayout from '@layout/WebLayout';
import PublicAppLayout from '@layout/PublicAppLayout';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';
import { PublicVersion } from '@pages/Workflow/Version/PublicVersion';
import AccountSetting from '@pages/Account/pages/AccountSetting';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';

const AppRoutes = () => (
  <BrowserRouter basename='/'>
    <Routes>
      <Route
        path='/public'
        element={<App layout={PublicAppLayout} requiredLogin={false} />}
      >
        <Route
          path=':orgIdString/:workflowIdString/:versionIdString'
          element={<PublicVersion />}
        ></Route>
      </Route>
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
        <Route
          path=':orgIdString/mission/:missionIdString'
          element={<Mission />}
        >
          <Route index element={<EditMission />} />
        </Route>
      </Route>
      {/* TODO: login should use different layout */}
      <Route
        path='/'
        element={<App layout={NoHeaderLayout} requiredLogin={false} />}
      >
        <Route path='login' element={<CreatorLogin />} />
      </Route>
      <Route
        path='/'
        element={<App layout={WebLayoutWithoutSider} requiredLogin={true} />}
      >
        <Route path='account'>
          <Route path='setting' element={<AccountSetting />} />
        </Route>
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
            <Route path=':versionIdString' element={<EditVersion />} />
          </Route>
        </Route>
      </Route>

      <Route path='/' element={<App layout={WebLayout} requiredLogin={true} />}>
        <Route index element={<OrganizationExplore />} />
        <Route path='/my-workspaces' element={<MySpace />} />
        <Route path='/shared-workspaces' element={<SharedSpace />} />
        <Route path='onboard' element={<PageScreen />} />
        <Route path=':orgIdString'>
          <Route index element={<BluePrint />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

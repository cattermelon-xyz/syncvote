/* eslint-disable max-len */
import App from "@App";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageScreen from "@components/HomeScreen/PageScreen";
import ChooseWorkflow from "@pages/Mission/ChooseWorkflow";
import ChooseTemplate from "@pages/Workflow/BuildBlueprint/ChooseTemplate";
import Mission from "pages/Mission";
import Workflow from "pages/Workflow";
import {
  OrganizationHome,
  OrganizationList,
  OrganizationSetting,
} from "@pages/Organization";
import CreatorLogin from "@pages/Authentication/index";
import BluePrint from "@pages/Workflow/BluePrint";
import { EditVersion, NewVersion } from "@pages/Workflow/Version";
import NewMission from "@pages/Mission/NewMission";
import EditMission from "@pages/Mission/EditMission";
import AppLayout from "@layout/AppLayout";
import NoHeaderLayout from "@layout/NoHeader";
import WebLayout from "@layout/WebLayout";
import PublicAppLayout from "@layout/PublicAppLayout";
import { PublicVersion } from "@pages/Workflow/Version/PublicVersion";

const AppRoutes = () => (
  <BrowserRouter basename='/'>
    <Routes>
      <Route
        path="/public"
        element={<App layout={PublicAppLayout} requiredLogin={false} />}
      >
        <Route
          path=":orgIdString/:workflowIdString/:versionIdString"
          element={<PublicVersion />}
        ></Route>
      </Route>

      <Route path="/" element={<App layout={AppLayout} requiredLogin={true} />}>
        <Route
          path=':orgIdString/:workflowIdString/:versionIdString'
          element={<EditVersion />}
        />
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

      <Route path='/' element={<App layout={WebLayout} requiredLogin={true} />}>
        <Route index element={<OrganizationList />} />
        <Route path='my-spaces' element={<OrganizationList />} />
        <Route path='my-spaces/:spaceId' element={<OrganizationList />} />
        <Route path='shared-spaces' element={<OrganizationList />} />
        <Route path='shared-spaces/:spaceId' element={<OrganizationList />} />
      </Route>

      <Route path='/' element={<App layout={WebLayout} requiredLogin={true} />}>
        {/* TODO: this screen should only once for each new org */}
        <Route path='onboard' element={<PageScreen />} />
        <Route path=':orgIdString'>
          <Route index element={<OrganizationHome />} />
          <Route path='setting' element={<OrganizationSetting />} />
          <Route path='new-workflow' element={<ChooseTemplate />} />
          <Route path='new-mission' element={<ChooseWorkflow />} />
          <Route path='workflow/:workflowIdString' element={<Workflow />}>
            <Route index element={<BluePrint />} />
            <Route path='new-version' element={<NewVersion />} />
            <Route
              path=':versionIdString/new-mission'
              element={<NewMission />}
            />
            <Route path=':versionIdString' element={<EditVersion />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

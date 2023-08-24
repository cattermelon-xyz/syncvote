/* eslint-disable max-len */
import App from '@App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicAppLayout from '@layout/PublicAppLayout';
import NotFound404 from '@pages/NotFound404';
import PublicRoutes from './PublicRoutes';
import AuthRoutes from './AuthRoutes';
import OrgRoutes from './OrgRoutes';
import AccountRoutes from './AccountRoutes';
import EditorRoutes from './EditorRoutes';
import HomeRoutes from './HomeRoutes';

const AppRoutes = () => {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        {PublicRoutes}
        {AuthRoutes}
        {EditorRoutes}
        {OrgRoutes}
        {AccountRoutes}
        {HomeRoutes}
        <Route
          path='*'
          element={<App layout={PublicAppLayout} requiredLogin={false} />}
        >
          <Route index element={<NotFound404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

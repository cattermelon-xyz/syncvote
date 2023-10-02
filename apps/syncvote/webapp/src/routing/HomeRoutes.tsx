import App from '@App';
import WebLayout from '@layout/WebLayout';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
const env = import.meta.env.VITE_ENV;
import {
  OrganizationExplore,
  OrganizationSetting,
  MySpace,
  SharedSpace,
} from '@pages/Organization';
import { AuthContext } from '@layout/context/AuthContext';

function HomeRoutes() {
  const { isAuth } = useContext(AuthContext);
  if (env === 'production' && isAuth) {
    return (
      <Route path='/' element={<App layout={WebLayoutWithoutSider} />}>
        <Route index element={<MySpace />} />
      </Route>
    );
  } else if (env === 'dev') {
    if (isAuth) {
      return (
        <>
          <Route index element={<MySpace />} />
          <Route path='/explore' element={<OrganizationExplore />} />
          <Route path='/shared' element={<SharedSpace />} />
        </>
      );
    } else {
      return <Route index element={<OrganizationExplore />} />;
    }
  }
}

export default HomeRoutes;

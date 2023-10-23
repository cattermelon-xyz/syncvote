import App from '@App';
import React from 'react';
import { Route } from 'react-router-dom';
import WebLayoutWithoutSider from '@layout/WebLayoutWithoutSider';
import NoHeaderAppLayout from '@layout/NoHeaderAppLayout';
import TemplateDetail from '@pages/Template/Detail';
import { TemplateViewData } from '@pages/Template/ViewData';

export default (
  <React.Fragment>
    <Route path='/' element={<App layout={WebLayoutWithoutSider} />}>
      <Route path='template/:templateIdString' element={<TemplateDetail />} />
    </Route>
    <Route path='/' element={<App layout={NoHeaderAppLayout} />}>
      <Route
        path='template/detail/:templateIdString'
        element={<TemplateViewData />}
      />
    </Route>
    
  </React.Fragment>
);

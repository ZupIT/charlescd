import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import routes from 'core/constants/routes';

const Main = lazy(() => import('modules/Main'));

const Routes = () => (
  <BrowserRouter>
    <Suspense fallback="">
      <Route path={routes.main} component={Main} />
    </Suspense>
  </BrowserRouter>
);

export default Routes;

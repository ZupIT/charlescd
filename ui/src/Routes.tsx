/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import routes from 'core/constants/routes';

const Main = lazy(() => import('modules/Main'));
const Auth = lazy(() => import('modules/Auth'));
const Forbidden403 = lazy(() => import('modules/Error/403'));
const NotFound404 = lazy(() => import('modules/Error/404'));

const Routes = () => (
  <BrowserRouter>
    <Suspense fallback="">
      <Switch>
        <Route path={routes.error403} component={Forbidden403} />
        <Route path={routes.error404} component={NotFound404} />
        <Route path={routes.auth} component={Auth} />
        <Route path={routes.main} component={Main} />
      </Switch>
    </Suspense>
  </BrowserRouter>
);

export default Routes;

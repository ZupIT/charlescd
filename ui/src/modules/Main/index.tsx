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

import React, { lazy, useState } from 'react';
import isUndefined from 'lodash/isUndefined';
import { Switch, Route, Redirect } from 'react-router-dom';
import Sidebar from 'modules/Main/Sidebar';
import Footer from 'modules/Main/Footer';
import { setExpandMode, getExpandMode } from 'core/utils/sidebar';
import PrivateRoute from 'core/components/PrivateRoute';
import routes from 'core/constants/routes';
import { ExpandClick } from './Sidebar/Types';
import Styled from './styled';

const Workspaces = lazy(() => import('modules/Workspaces'));
const Users = lazy(() => import('modules/Users'));
const Groups = lazy(() => import('modules/Groups'));
const Account = lazy(() => import('modules/Account'));
const Hypotheses = lazy(() => import('modules/Hypotheses'));
const Circles = lazy(() => import('modules/Circles'));
const Modules = lazy(() => import('modules/Modules'));
const Settings = lazy(() => import('modules/Settings'));
const Metrics = lazy(() => import('modules/Metrics'));

const Main = () => {
  const [isExpanded, setSideExpanded] = useState(getExpandMode());

  const onClickExpand = ({ status, persist }: ExpandClick) => {
    const newStatus = isUndefined(status) ? !isExpanded : status;
    setSideExpanded(newStatus);
    if (persist) setExpandMode(newStatus);
  };

  return (
    <Styled.Main isSidebarExpanded={isExpanded}>
      <Sidebar isExpanded={isExpanded} onClickExpand={onClickExpand} />
      <Styled.Content data-testid="main-content">
        <React.Suspense fallback="">
          <Switch>
            <Redirect exact from={routes.main} to={routes.workspaces} />
            <Route path={routes.workspaces} component={Workspaces} />
            <Route path={routes.account} component={Account} />
            <PrivateRoute
              path={routes.users}
              component={Users}
              allowedRoles={['root']}
            />
            <PrivateRoute
              path={routes.groups}
              component={Groups}
              allowedRoles={['root']}
            />
            <PrivateRoute
              path={routes.hypotheses}
              component={Hypotheses}
              allowedRoles={['hypothesis_read']}
            />
            <PrivateRoute
              path={routes.circles}
              component={Circles}
              allowedRoles={['circles_read']}
            />
            <PrivateRoute
              path={routes.modules}
              component={Modules}
              allowedRoles={['modules_read']}
            />
            <PrivateRoute
              path={routes.settings}
              component={Settings}
              allowedRoles={['maintenance_write']}
              allowedRoute
            />
            <PrivateRoute
              path={routes.metrics}
              component={Metrics}
              allowedRoles={['circles_read']}
            />
            <Redirect to={routes.error404} />
          </Switch>
        </React.Suspense>
      </Styled.Content>
      <Footer />
    </Styled.Main>
  );
};

export default Main;

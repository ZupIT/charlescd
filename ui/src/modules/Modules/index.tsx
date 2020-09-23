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

import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from 'containers/PrivateRoute';
import Page from 'core/components/Page';
import { useGlobalState } from 'core/state/hooks';
import routes from 'core/constants/routes';
import { useFindAllModules } from './hooks/module';
import Menu from './Menu';

const Placeholder = React.lazy(() => import('./Placeholder'));
const ModulesComparation = React.lazy(() => import('./Comparation'));

const Modules = () => {
  const { list } = useGlobalState(state => state.modules);
  const { getAllModules, loading } = useFindAllModules();

  useEffect(() => {
    getAllModules();
  }, [getAllModules]);

  return (
    <Page>
      <Page.Menu>
        <Menu items={list.content} isLoading={loading} />
      </Page.Menu>
      <Page.Content>
        <React.Suspense fallback="">
          <Switch>
            <PrivateRoute
              allowedRoles={['modules_read', 'modules_write']}
              path={routes.modulesComparation}
              component={ModulesComparation}
            />
            <Route path={routes.modules} component={Placeholder} />
          </Switch>
        </React.Suspense>
      </Page.Content>
    </Page>
  );
};

export default Modules;

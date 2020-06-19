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
import { Route, Switch } from 'react-router-dom';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import Menu from './Menu';
import Styled from './styled';

const Deploys = lazy(() => import('modules/Metrics/Deploys'));
const Modules = lazy(() => import('modules/Metrics/Modules'));

const Circles = () => {
  const renderPlaceholder = () => (
    <Page.Placeholder
      icon="placeholder-metrics"
      title={'Select the metric you want to view from the side menu.'}
      hasCards={true}
    />
  );

  return (
    <Page>
      <Page.Menu>
        <Menu />
      </Page.Menu>
      <Suspense fallback="">
        <Switch>
          <Route exact path={routes.metrics}>
            {renderPlaceholder()}
          </Route>
          <Route exact path={routes.metricsDeploys}>
            <Styled.Scrollable>
              <Deploys />
            </Styled.Scrollable>
          </Route>
          <Route exact path={routes.metricsModules}>
            <Styled.Scrollable>
              <Modules />
            </Styled.Scrollable>
          </Route>
        </Switch>
      </Suspense>
    </Page>
  );
};

export default Circles;

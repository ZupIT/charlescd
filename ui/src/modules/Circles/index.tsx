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

import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { getProfileByKey } from 'core/utils/profile';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import { useGlobalState } from 'core/state/hooks';
import useCircles, { CIRCLE_TYPES, CIRCLE_STATUS } from './hooks';
import Menu from './Menu';
import Styled from './styled';
import getQueryStrings from 'core/utils/query';

const CirclesList = lazy(() => import('modules/Circles/List'));
const CirclesComparation = lazy(() => import('modules/Circles/Comparation'));

const Circles = () => {
  const [loading, filterCircles] = useCircles(CIRCLE_TYPES.list);
  const { list } = useGlobalState(({ circles }) => circles);
  const [status, setStatus] = useState<string>(CIRCLE_STATUS.active);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const profileName = getProfileByKey('name');
  const query = getQueryStrings();
  const circles = query.getAll('circle');

  useEffect(() => {
    filterCircles(name, status);
    if (message === 'Deleted') filterCircles(name, status);
  }, [status, name, filterCircles, message]);

  const renderPlaceholder = () => (
    <Page.Placeholder
      icon="placeholder-circles"
      title={`Welcome, ${profileName}! What do you like to do?`}
      hasCards={true}
    />
  );

  return (
    <Page>
      <Page.Menu>
        <Menu
          isLoading={loading}
          items={list?.content}
          status={status}
          onSearch={setName}
          onSelect={setStatus}
        />
      </Page.Menu>
      <Suspense fallback="">
        <Switch>
          <Route exact path={routes.circles}>
            {renderPlaceholder()}
          </Route>
          <Route exact path={routes.circlesMetrics}>
            <Styled.Scrollable>
              <CirclesList />
            </Styled.Scrollable>
          </Route>
          <Route exact path={routes.circlesComparation}>
            {isEmpty(circles) ? (
              renderPlaceholder()
            ) : (
              <Styled.ScrollableX>
                <CirclesComparation
                  onChange={(delCircleStatus: string) =>
                    setMessage(delCircleStatus)
                  }
                />
              </Styled.ScrollableX>
            )}
          </Route>
        </Switch>
      </Suspense>
    </Page>
  );
};

export default Circles;

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

import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { getProfileByKey } from 'core/utils/profile';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import { useDispatch, useGlobalState } from 'core/state/hooks';
import useCircles, { CIRCLE_TYPES, CIRCLE_STATUS } from './hooks';
import Menu from './Menu';
import Styled from './styled';
import getQueryStrings from 'core/utils/query';
import MenuItem from './Menu/MenuItem';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { resetContentAction } from './state/actions';

const CirclesList = lazy(() => import('modules/Circles/List'));
const CirclesComparation = lazy(() => import('modules/Circles/Comparation'));

const Circles = () => {
  const [loading, filterCircles] = useCircles(CIRCLE_TYPES.list);
  const { list } = useGlobalState(({ circles }) => circles);
  const dispatch = useDispatch();
  const [status, setStatus] = useState<string>(CIRCLE_STATUS.active);
  const [name, setName] = useState('');
  const profileName = getProfileByKey('name');
  const query = getQueryStrings();
  const circles = query.getAll('circle');

  const onChange = useCallback(() => {
    const page = 0;
    dispatch(resetContentAction());
    filterCircles({ name, status, page });
  }, [dispatch, filterCircles, status, name]);

  useEffect(() => {
    onChange();
  }, [status, name, onChange]);

  const loadMore = (page: number) => {
    filterCircles({ name, status, page });
  };

  const renderPlaceholder = () => (
    <Page.Placeholder
      icon="placeholder-circles"
      title={`Welcome, ${profileName}! What do you like to do?`}
      hasCards={true}
    />
  );

  const renderItems = () =>
    map(list?.content, ({ id, name }) => (
      <MenuItem key={id} id={id} name={name} />
    ));

  return (
    <Page>
      <Page.Menu>
        <Menu status={status} onSearch={setName} onSelect={setStatus}>
          <InfiniteScroll
            hasMore={!list.last}
            loadMore={loadMore}
            isLoading={loading}
            loader={<Styled.LoaderMenu />}
          >
            {renderItems()}
          </InfiniteScroll>
        </Menu>
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
                <CirclesComparation onChange={() => onChange()} />
              </Styled.ScrollableX>
            )}
          </Route>
        </Switch>
      </Suspense>
    </Page>
  );
};

export default Circles;

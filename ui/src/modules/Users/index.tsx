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

import React, { lazy, useState, useEffect, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import { getProfileByKey } from 'core/utils/profile';
import getQueryStrings from 'core/utils/query';
import Menu from './Menu';
import { useUsers } from './hooks';
import Styled from './styled';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { useDispatch, useGlobalState } from 'core/state/hooks';
import { resetContentAction } from './state/actions';
import map from 'lodash/map';
import MenuItem from './Menu/MenuItem';

const UsersComparation = lazy(() => import('./Comparation'));

const CreateUser = lazy(() => import('./Create'));

const Users = () => {
  const profileName = getProfileByKey('name');
  const [filterUsers, , loading] = useUsers();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { list } = useGlobalState(({ users }) => users);
  const query = getQueryStrings();
  const users = query.getAll('user');
  const dispatch = useDispatch();

  useEffect(() => {
    const page = 0;
    dispatch(resetContentAction());
    if (message === '' || message === 'Deleted') {
      filterUsers(name, page);
    }
  }, [name, message, filterUsers, dispatch]);

  const loadMore = (page: number) => {
    filterUsers(name, page);
  };

  const renderPlaceholder = () => (
    <Page.Placeholder
      icon="empty-users"
      title={`Hello, ${profileName}!`}
      subtitle="Select a user using the side menu."
    />
  );

  const renderUsers = () =>
    map(list?.content, ({ email, name }) => (
      <MenuItem key={email} id={email} name={name} email={email} />
    ));

  return (
    <Page>
      <Page.Menu>
        <Menu onSearch={setName}>
          <InfiniteScroll
            hasMore={!list.last}
            loadMore={loadMore}
            isLoading={loading}
            loader={<Styled.LoaderMenu />}
          >
            {renderUsers()}
          </InfiniteScroll>
        </Menu>
      </Page.Menu>
      <Suspense fallback="">
        <Switch>
          <Route exact path={routes.users}>
            {renderPlaceholder()}
          </Route>
          <Route exact path={routes.usersComparation}>
            {isEmpty(users) ? (
              renderPlaceholder()
            ) : (
              <Styled.ScrollableX>
                <UsersComparation
                  onChange={(userStatus: string) => setMessage(userStatus)}
                />
              </Styled.ScrollableX>
            )}
          </Route>
          <Route exact path={routes.usersCreate}>
            <Styled.ScrollableX>
              <CreateUser />
            </Styled.ScrollableX>
          </Route>
        </Switch>
      </Suspense>
    </Page>
  );
};

export default Users;
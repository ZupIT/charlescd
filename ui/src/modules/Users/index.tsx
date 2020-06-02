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
import { useGlobalState } from 'core/state/hooks';
import routes from 'core/constants/routes';
import { getProfileByKey } from 'core/utils/profile';
import getQueryStrings from 'core/utils/query';
import Menu from './Menu';
import { useUsers } from './hooks';
import Styled from './styled';

const UsersComparation = lazy(() => import('./Comparation'));

const CreateUser = lazy(() => import('./Create'));

const Users = () => {
  const profileName = getProfileByKey('name');
  const [getAll, , loading] = useUsers();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { list } = useGlobalState(({ users }) => users);
  const query = getQueryStrings();
  const users = query.getAll('user');

  useEffect(() => {
    getAll(name);
    if (message === 'Deleted' || message === 'Created') {
      getAll(name);
    }
  }, [name, getAll, message]);

  const renderPlaceholder = () => (
    <Page.Placeholder
      icon="empty-users"
      title={`Hello, ${profileName}!`}
      subtitle="Select a user using the side menu."
    />
  );

  return (
    <Page>
      <Page.Menu>
        <Menu items={list?.content} isLoading={loading} onSearch={setName} />
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

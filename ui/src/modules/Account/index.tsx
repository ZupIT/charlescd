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

import React, { useEffect, useState, useCallback } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import Avatar from 'core/components/Avatar';
import ContentIcon from 'core/components/ContentIcon';
import TabPanel from 'core/components/TabPanel';
import Text from 'core/components/Text';
import Placeholder from 'core/components/Placeholder';
import { getProfileByKey } from 'core/utils/profile';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import { isRoot } from 'core/utils/auth';
import InputTitle from 'core/components/Form/InputTitle';
import { useUser, useUpdateProfile } from 'modules/Users/hooks';
import { User } from 'modules/Users/interfaces/User';
import Loader from './Loaders';
import Menu from './Menu';
import { AccountMenu } from './constants';
import Styled from './styled';

const Account = () => {
  const name = getProfileByKey('name');
  const email = getProfileByKey('email');
  const [user, setCurrentUser] = useState<User>();
  const { register, handleSubmit } = useForm<User>();
  const [loadedUser, , loadUser, ,] = useUser();
  const [, loadingUpdate, updateProfile] = useUpdateProfile();

  const refresh = useCallback(() => loadUser(email), [loadUser, email]);

  useEffect(() => {
    if (loadedUser) setCurrentUser(loadedUser);
  }, [loadedUser]);

  useEffect(() => {
    if (!loadingUpdate) {
      loadUser(email);
    }
  }, [loadingUpdate, email, loadUser]);

  const onSubmit = (profile: User) => {
    setCurrentUser(null);
    updateProfile(user.id, {
      ...profile,
      email: user.email,
      photoUrl: user.photoUrl
    });
  };

  useEffect(() => {
    loadUser(email);
  }, [email, loadUser]);

  const renderContent = () => (
    <>
      <Styled.Layer>
        <Styled.ContentIcon icon="picture">
          <Avatar
            key={user.photoUrl}
            size="68px"
            profile={user}
            onFinish={refresh}
          />
        </Styled.ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="user">
          {isRoot() ? (
            <InputTitle
              key={user.name}
              name="name"
              resume
              ref={register({ required: true })}
              defaultValue={loadedUser.name}
              onClickSave={handleSubmit(onSubmit)}
            />
          ) : (
            <Text.h2 color="light">{loadedUser.name}</Text.h2>
          )}
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="email">
          <Text.h2 color="light">E-mail</Text.h2>
          <Text.h5 color="dark">{email}</Text.h5>
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="users">
          <Text.h2 color="light">User group</Text.h2>
        </ContentIcon>
      </Styled.Layer>
    </>
  );

  const renderPanel = () => (
    <TabPanel title="Account" name="user" size="15px">
      {renderContent()}
    </TabPanel>
  );

  return (
    <Page>
      <Page.Menu>
        <Menu items={AccountMenu} />
      </Page.Menu>
      <Page.Content>
        <Switch>
          <Route exact path={routes.accountProfile}>
            <Styled.Scrollable>
              {isEmpty(user) ? <Loader.Tab /> : renderPanel()}
            </Styled.Scrollable>
          </Route>
          <Route>
            <Placeholder
              icon="empty-user"
              title={`Hello, ${name}!`}
              subtitle="Select an option from the side menu."
            />
          </Route>
        </Switch>
      </Page.Content>
    </Page>
  );
};

export default Account;

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

import { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import useForm from 'core/hooks/useForm';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Avatar from 'core/components/Avatar';
import ContentIcon from 'core/components/ContentIcon';
import TabPanel from 'core/components/TabPanel';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import Placeholder from 'core/components/Placeholder';
import { getProfileByKey } from 'core/utils/profile';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import { isIDMEnabled, isRoot } from 'core/utils/auth';
import { isRequired, maxLength } from 'core/utils/validations';
import InputTitle from 'core/components/Form/InputTitle';
import { useUser, useUpdateName } from 'modules/Users/hooks';
import { User } from 'modules/Users/interfaces/User';
import { AccountMenu } from './constants';
import ChangePassword from './ChangePassword';
import Styled from './styled';
import Menu from './Menu';
import Loader from './Loaders';
import Icon from 'core/components/Icon';
import CardConfig from 'core/components/Card/Config';

const Account = () => {
  const name = getProfileByKey('name');
  const email = getProfileByKey('email');
  const [currentUser, setCurrentUser] = useState<User>();
  const {
    register,
    handleSubmit,
    errors,
    formState: { isValid }
  } = useForm<User>({
    mode: 'onChange'
  });
  const { findByEmail, user } = useUser();
  const { updateNameById, user: userUpdated, status } = useUpdateName();
  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else if (email) {
      findByEmail(email);
    }
  }, [user, email, findByEmail]);

  useEffect(() => {
    if (userUpdated) {
      setCurrentUser(userUpdated);
    } else if (status === 'rejected') {
      findByEmail(email);
    }
  }, [userUpdated, status, email, findByEmail]);

  const onSubmit = (profile: User) => {
    setCurrentUser(null);
    updateNameById(currentUser.id, profile.name);
  };

  const renderModal = () =>
    toggleModal && (
      <Styled.Modal.Default onClose={() => setToggleModal(false)}>
        <ChangePassword onSubmit={() => setToggleModal(false)} />
      </Styled.Modal.Default>
    );

  const Groups = () =>
    <Styled.Groups>
      {map(currentUser.userGroups, (userGroup) => (
        <CardConfig
          id={`user-group-${userGroup.id}`}
          key={userGroup.name}
          icon="users"
          description={userGroup.name}
        />
      ))}
    </Styled.Groups>

  const renderContent = () => (
    <>
      {renderModal()}
      <Styled.Layer>
        <Styled.ContentIcon icon="picture">
          <Avatar key={currentUser.id} size={68} name={currentUser?.name} />
        </Styled.ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="user">
          {isRoot() ? (
            <>
              <InputTitle
                {...register('name', {
                  required: isRequired(),
                  maxLength: maxLength()
                })}
                key={currentUser.name}
                resume
                defaultValue={currentUser.name}
                onClickSave={handleSubmit(onSubmit)}
                isDisabled={!isValid}
              />
              {errors.name && (
                <Styled.FieldErrorWrapper>
                  <Icon name="error" color="error" />
                  <Text tag="H6" color="error">{errors.name.message}</Text>
                </Styled.FieldErrorWrapper>
              )}
            </>
          ) : (
            <Text tag="H2" color="light">{user.name}</Text>
          )}
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="email">
          <Text tag="H2" color="light">E-mail</Text>
          <Text tag="H5" color="dark">{email}</Text>
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="users">
          <Text tag="H2" color="light">User group</Text>
          <Styled.Groups>
            <Groups />
          </Styled.Groups>
        </ContentIcon>
      </Styled.Layer>
    </>
  );

  const renderTabActions = () => (
    <Styled.Actions>
      {!isIDMEnabled() && (
        <LabeledIcon
          icon="account"
          marginContent="5px"
          onClick={() => setToggleModal(true)}
        >
          <Text tag="H5" color="dark">Change password</Text>
        </LabeledIcon>
      )}
    </Styled.Actions>
  );

  const renderPanel = () => (
    <TabPanel
      title="Account"
      name="user"
      size="15px"
      actions={renderTabActions()}
    >
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
              {isEmpty(currentUser) ? <Loader.Tab /> : renderPanel()}
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

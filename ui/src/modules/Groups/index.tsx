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

import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import useForm from 'core/hooks/useForm';
import Page from 'core/components/Page';
import Modal from 'core/components/Modal';
import routes from 'core/constants/routes';
import { getProfileByKey } from 'core/utils/profile';
import { isRequired, maxLength } from 'core/utils/validations';
import Menu from './Menu';
import Tabs from './Tabs';
import { addParamUserGroup } from './helpers';
import { useCreateUserGroup } from './hooks';
import Styled from './styled';

export enum FormAction {
  view = 'view',
  edit = 'edit'
}

const UserGroups = () => {
  const profileName = getProfileByKey('name');
  const history = useHistory();
  const [toggleModal, setToggleModal] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    formState: { isValid }
  } = useForm({
    mode: 'onChange'
  });
  const {
    createUserGroup,
    response: userGroupResponse,
    loading: loadingCreate
  } = useCreateUserGroup();

  useEffect(() => {
    if (userGroupResponse) {
      setToggleModal(false);
    }
  }, [userGroupResponse]);

  const onSubmit = ({ name }: Record<string, string>) => {
    createUserGroup(name);
  };

  const renderModal = () => (
    <Modal.Default onClose={() => setToggleModal(false)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Styled.Modal.Title color="light">New user group</Styled.Modal.Title>
        <Styled.Modal.Input
          name="name"
          label="Type a name"
          error={errors?.name?.message}
          ref={register({
            required: isRequired(),
            maxLength: maxLength()
          })}
        />
        <Styled.Modal.Button
          id="user-group"
          type="submit"
          isDisabled={!isValid}
          isLoading={loadingCreate}
        >
          Create user group
        </Styled.Modal.Button>
      </form>
    </Modal.Default>
  );

  return (
    <Page>
      {toggleModal && renderModal()}
      <Page.Menu>
        <Menu
          onSelect={id =>
            addParamUserGroup(history, `${id}~${FormAction.view}`)
          }
          onCreate={() => setToggleModal(true)}
        />
      </Page.Menu>
      <Switch>
        <Route path={routes.groupsShow} component={Tabs} />
        <Route path={routes.groups}>
          <Page.Placeholder
            icon="empty-groups"
            title={`Hello, ${profileName}!`}
            subtitle="Create user group using the side menu."
          />
        </Route>
      </Switch>
    </Page>
  );
};

export default UserGroups;

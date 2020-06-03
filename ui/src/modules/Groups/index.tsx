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

import React, { Suspense, useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import Page from 'core/components/Page';
import Modal from 'core/components/Modal';
import routes from 'core/constants/routes';
import { useGlobalState } from 'core/state/hooks';
import { getProfileByKey } from 'core/utils/profile';
import Menu from './Menu';
import Tabs from './Tabs';
import { addParamUserGroup, getSelectedUserGroups } from './helpers';
import { useFindAllUserGroup, useCreateUserGroup } from './hooks';
import Styled from './styled';

export enum FormAction {
  view = 'view',
  edit = 'edit'
}

const UserGroups = () => {
  const profileName = getProfileByKey('name');
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [toggleModal, setToggleModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [getUserGroups, loading] = useFindAllUserGroup();
  const { list } = useGlobalState(state => state.userGroups);
  const { register, watch, handleSubmit } = useForm();
  const watchName = watch('name');
  const {
    createUserGroup,
    response: userGroupResponse,
    loading: loadingCreate
  } = useCreateUserGroup();

  useEffect(() => {
    setIsDisabled(isEmpty(watchName));
  }, [watchName]);

  useEffect(() => {
    getUserGroups(search);
  }, [search, getUserGroups]);

  useEffect(() => {
    if (userGroupResponse) {
      setToggleModal(false);
    }
  }, [userGroupResponse]);

  const onSubmit = ({ name }: Record<string, string>) => {
    createUserGroup(name);
  };

  const renderModal = () =>
    toggleModal && (
      <Modal.Default onClose={() => setToggleModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.Modal.Title color="light">New user group</Styled.Modal.Title>
          <Styled.Modal.Input
            name="name"
            label="Type a name"
            ref={register({ required: true })}
          />
          <Styled.Modal.Button
            type="submit"
            isDisabled={isDisabled}
            isLoading={loadingCreate}
          >
            Create user group
          </Styled.Modal.Button>
        </form>
      </Modal.Default>
    );

  return (
    <Page>
      {renderModal()}
      <Page.Menu>
        <Menu
          items={list?.content}
          isLoading={loading}
          selectedItems={getSelectedUserGroups()}
          onSelect={id =>
            addParamUserGroup(history, `${id}~${FormAction.view}`)
          }
          onSearch={setSearch}
          onCreate={() => setToggleModal(true)}
        />
      </Page.Menu>
      <Suspense fallback="">
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
      </Suspense>
    </Page>
  );
};

export default UserGroups;

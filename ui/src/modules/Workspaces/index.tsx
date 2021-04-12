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

import React, { useEffect, useState } from 'react';
import Page from 'core/components/Page';
import Placeholder from 'core/components/Placeholder';
import { isRoot, logout } from 'core/utils/auth';
import Menu from './Menu';
import { clearWorkspace } from 'core/utils/workspace';
import { useSaveWorkspace } from 'modules/Workspaces/hooks';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import routes from 'core/constants/routes';
import { saveWorkspace } from 'core/utils/workspace';
import { isRequired, maxLength } from 'core/utils/validations';
import { removeWizard } from 'modules/Settings/helpers';
import Modal from 'core/components/Modal';
import Styled from './styled';
import { getProfileByKey } from 'core/utils/profile';

interface Props {
  selectedWorkspace: (name: string) => void;
}

const Workspaces = ({ selectedWorkspace }: Props) => {
  const profileName = getProfileByKey('name');
  const email = getProfileByKey('email');

  const [toggleModal, setToggleModal] = useState(false);
  const {
    save,
    response: saveWorkspaceResponse,
    loading: saveWorkspaceLoading
  } = useSaveWorkspace();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    errors,
    formState: { isValid }
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (!email) {
      logout();
    }
  }, [email]);

  useEffect(() => {
    if (saveWorkspaceResponse) {
      removeWizard();
      saveWorkspace(saveWorkspaceResponse);
      history.push(routes.credentials);
    }
  }, [saveWorkspaceResponse, history]);

  const onSubmit = ({ name }: Record<string, string>) => {
    save({ name });
  };

  useEffect(() => {
    clearWorkspace();
  }, []);

  const renderModal = () =>
    isRoot() && (
      <Modal.Default onClose={() => setToggleModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.Modal.Title color="light">
            Create workspace
          </Styled.Modal.Title>
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
            type="submit"
            isDisabled={!isValid}
            isLoading={saveWorkspaceLoading}
          >
            Create workspace
          </Styled.Modal.Button>
        </form>
      </Modal.Default>
    );

  return (
    <Page>
      {toggleModal && renderModal()}
      <Page.Menu>
        <Menu
          onCreate={() => setToggleModal(true)}
          selectedWorkspace={(name: string) => selectedWorkspace(name)}
        />
      </Page.Menu>
      <Page.Content>
        <Placeholder
          icon="empty-workspaces"
          title={`Hello, ${profileName}!`}
          subtitle="Select or create a workspace in the side menu."
        />
      </Page.Content>
    </Page>
  );
};

export default Workspaces;

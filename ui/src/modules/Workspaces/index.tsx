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

import { useState, useEffect } from 'react';
import Page from 'core/components/Page';
import Placeholder from 'core/components/Placeholder';
import { isRoot, logout } from 'core/utils/auth';
import { useSaveWorkspace } from 'modules/Workspaces/hooks';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import routes from 'core/constants/routes';
import { isNotBlank, isRequired, maxLength } from 'core/utils/validations';
import { removeWizard } from 'modules/Settings/helpers';
import ModalDefault from 'core/components/Modal/ModalDefault';
import Menu from './Menu';
import Styled from './styled';
import { getProfileByKey } from 'core/utils/profile';

const Workspaces = () => {
  const profileName = getProfileByKey('name');
  const email = getProfileByKey('email');
  const [toggleModal, setToggleModal] = useState(false);
  const {
    save,
    response: saveWorkspaceResponse,
    loading: saveWorkspaceLoading,
  } = useSaveWorkspace();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: {
      isValid,
      errors,
    },
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (!email) {
      logout();
    }
  }, [email]);

  useEffect(() => {
    if (saveWorkspaceResponse) {
      removeWizard();
      history.push(routes.credentials);
    }
  }, [saveWorkspaceResponse, history]);

  const onSubmit = ({ name }: Record<string, string>) => {
    save({ name });
  };

  const renderModal = () =>
    isRoot() && (
      <ModalDefault onClose={() => setToggleModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.Modal.Title tag="H2" color="light">
            Create workspace
          </Styled.Modal.Title>
          <Styled.Modal.Input
            {...register('name', {
              required: isRequired(),
              validate: {
                notBlank: isNotBlank,
              },
              maxLength: maxLength(),
            })}
            label="Type a name"
            error={errors?.name?.message} />
          <Styled.Modal.Button
            type="submit"
            isDisabled={!isValid}
            isLoading={saveWorkspaceLoading}
          >
            Create workspace
          </Styled.Modal.Button>
        </form>
      </ModalDefault>
    );

  return (
    <Page>
      {toggleModal && renderModal()}
      <Page.Menu>
        <Menu onCreate={() => setToggleModal(true)} />
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

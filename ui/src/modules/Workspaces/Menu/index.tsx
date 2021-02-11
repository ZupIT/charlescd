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

import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import Modal from 'core/components/Modal';
import { isRequired, maxLength } from 'core/utils/validations';
import routes from 'core/constants/routes';
import { saveWorkspace } from 'core/utils/workspace';
import { isRoot, isIDMAuthFlow } from 'core/utils/auth';
import { useSaveWorkspace } from 'modules/Workspaces/hooks';
import { Workspace } from 'modules/Workspaces/interfaces/Workspace';
import { removeWizard } from 'modules/Settings/helpers';
import MenuItem from './MenuItem';
import Styled from './styled';
import Loader from './Loaders';
import { useWorkspace } from '../hooks';
import { useGlobalState } from 'core/state/hooks';
import { getProfileByKey } from 'core/utils/profile';
import { useWorkspacesByUser } from 'modules/Users/hooks';
interface Props {
  selectedWorkspace: (name: string) => void;
}

const WorkspaceMenu = ({
  selectedWorkspace
}: Props) => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    errors,
    formState: { isValid }
  } = useForm({ mode: 'onChange' });
  const {
    save,
    response: saveWorkspaceResponse,
    loading: saveWorkspaceLoading
  } = useSaveWorkspace();
  const [toggleModal, setToggleModal] = useState(false);
  const [filterWorkspace, , loading] = useWorkspace();
  const { findWorkspacesByUser } = useWorkspacesByUser();
  const userId = getProfileByKey('id');
  const workspaces = getProfileByKey('workspaces');
  const { list } = useGlobalState(({ workspaces }) => workspaces);
  const [name, setName] = useState('');

  const onIDMFlow = useCallback(() => {
    if (isRoot()) {
      filterWorkspace();
    } else {
      findWorkspacesByUser(userId);
    }
  }, [filterWorkspace, findWorkspacesByUser, userId]);

  useEffect(() => {
    if (isIDMAuthFlow()) {
      onIDMFlow();
    }
  }, [onIDMFlow]);

  useEffect(() => {
    if (isRoot()) {
      filterWorkspace(name);
    }
  }, [name, filterWorkspace]);

  const renderWorkspaces = () =>
    isEmpty(list?.content || workspaces) ? (
      <Text.h3 color="dark">No workspace was found</Text.h3>
    ) : (
      map(list?.content || workspaces, ({ id, name, status }: Workspace) => (
        <MenuItem
          key={id}
          id={id}
          name={name}
          status={status}
          selectedWorkspace={(name: string) => selectedWorkspace(name)}
        />
      ))
    );

  const openWorkspaceModal = () => setToggleModal(true);

  const onSubmit = ({ name }: Record<string, string>) => {
    save({ name });
  };

  useEffect(() => {
    if (saveWorkspaceResponse) {
      removeWizard();
      saveWorkspace(saveWorkspaceResponse);
      history.push(routes.credentials);
    }
  }, [saveWorkspaceResponse, history]);

  const renderModal = () =>
    toggleModal && (
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
    <>
      {isRoot() && renderModal()}
      <Styled.Actions>
        <Styled.Button
          id="workspaceModal"
          onClick={openWorkspaceModal}
          isDisabled={!isRoot()}
        >
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create workspace</Text.h5>
          </LabeledIcon>
        </Styled.Button>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput
          resume
          onSearch={setName}
          disabled={!isRoot()}
          maxLength={64}
        />
        <Styled.List>
          {loading ? <Loader.List /> : renderWorkspaces()}
        </Styled.List>
      </Styled.Content>
    </>
  );
};

export default WorkspaceMenu;

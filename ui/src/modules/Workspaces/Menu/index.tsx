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
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import map from 'lodash/map';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import Modal from 'core/components/Modal';
import { getProfileByKey } from 'core/utils/profile';
import routes from 'core/constants/routes';
import { saveWorkspace } from 'core/utils/workspace';
import { isRoot } from 'core/utils/auth';
import { useSaveWorkspace } from 'modules/Workspaces/hooks';
import { WorkspacePaginationItem } from '../interfaces/WorkspacePagination';
import MenuItem from './MenuItem';
import Styled from './styled';
import Loader from './Loaders';

interface Props {
  items: WorkspacePaginationItem[];
  onSearch: (name: string) => void;
  isLoading?: boolean;
}

const WorkspaceMenu = ({ items, onSearch, isLoading }: Props) => {
  const MAX_LENGTH_NAME = 50;
  const history = useHistory();
  const [isDisabled, setIsDisabled] = useState(true);
  const { register, handleSubmit, watch } = useForm();
  const name = watch('name');
  const {
    save,
    response: saveWorkspaceResponse,
    loading: saveWorkspaceLoading
  } = useSaveWorkspace();
  const [toggleModal, setToggleModal] = useState(false);

  useEffect(() => {
    if (name !== null) {
      setIsDisabled(name);
    }
  }, [name, setIsDisabled]);

  const renderWorkspaces = () =>
    map(items, ({ id, name }: WorkspacePaginationItem) => (
      <MenuItem key={id} id={id} name={name} />
    ));

  const openWorkspaceModal = () => setToggleModal(true);

  const onSubmit = ({ name }: Record<string, string>) => {
    const authorId = getProfileByKey('id');
    save({ name, authorId });
  };

  useEffect(() => {
    if (saveWorkspaceResponse) {
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
            maxLength={MAX_LENGTH_NAME}
            label="Type a name"
            ref={register({ required: true, maxLength: MAX_LENGTH_NAME })}
          />
          <Styled.Modal.Button
            type="submit"
            isDisabled={!isDisabled}
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
        <Styled.Button onClick={openWorkspaceModal} isDisabled={!isRoot()}>
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create workspace</Text.h5>
          </LabeledIcon>
        </Styled.Button>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput resume onSearch={onSearch} />
        <Styled.List>
          {isLoading ? <Loader.List /> : renderWorkspaces()}
        </Styled.List>
      </Styled.Content>
    </>
  );
};

export default WorkspaceMenu;

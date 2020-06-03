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
import { generatePath, useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import map from 'lodash/map';
import { getProfileByKey } from 'core/utils/profile';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import routes from 'core/constants/routes';
import Modal from 'core/components/Modal';
import Loader from '../../Users/Comparation/Loaders';
import { Hypothesis } from 'modules/Hypotheses/interfaces';
import { useCreateHypothesis } from '../hooks';
import MenuItem from './MenuItem';
import Styled from './styled';

interface Props {
  items: Hypothesis[];
  onSearch: (name: string) => void;
  onSelect: (hypothesis: Hypothesis) => void;
  isLoading: boolean;
}

const Menu = ({ items, onSearch, onSelect, isLoading }: Props) => {
  const MAX_LENGTH_NAME = 50;
  const history = useHistory();
  const { create, response, loading } = useCreateHypothesis();
  const [toggleModal, setToggleModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { register, handleSubmit, watch } = useForm();
  const name = watch('name');
  const handleClick = (hypothesis: Hypothesis) => {
    onSelect(hypothesis);
    history.push(
      generatePath(routes.hypothesesEdit, { hypothesisId: hypothesis.id })
    );
  };

  useEffect(() => {
    if (name !== null) {
      setIsDisabled(name);
    }
  }, [name, setIsDisabled]);

  useEffect(() => {
    if (response) {
      setToggleModal(false);
      history.push(`${routes.hypotheses}/${response.id}`);
    }
  }, [response, history]);

  const renderItems = () =>
    map(items, (hypothesis: Hypothesis) => (
      <MenuItem
        key={hypothesis.id}
        id={hypothesis.id}
        name={hypothesis.name}
        onClick={() => handleClick(hypothesis)}
      />
    ));

  const openHypothesesModal = () => setToggleModal(true);

  const onSubmit = ({ name }: Record<string, string>) => {
    const authorId = getProfileByKey('id');
    const description = '';
    create({ name, authorId, description });
  };

  const renderModal = () =>
    toggleModal && (
      <Modal.Default onClose={() => setToggleModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.Modal.Title color="light">
            Create hypothesis
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
            isLoading={loading}
          >
            Create hypothesis
          </Styled.Modal.Button>
        </form>
      </Modal.Default>
    );

  return (
    <>
      {renderModal()}
      <Styled.CreateHypotheses onClick={() => openHypothesesModal()}>
        <LabeledIcon icon="plus-circle" marginContent="5px">
          <Text.h5 color="dark">Create hypothesis</Text.h5>
        </LabeledIcon>
      </Styled.CreateHypotheses>
      <Styled.SearchInput resume onSearch={onSearch} />
      <Styled.Content>
        <Styled.List>{isLoading ? <Loader.List /> : renderItems()}</Styled.List>
      </Styled.Content>
    </>
  );
};

export default Menu;

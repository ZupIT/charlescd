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

import React, { Fragment, useState, useEffect } from 'react';
import map from 'lodash/map';
import filter from 'lodash/filter';
import xor from 'lodash/xor';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import kebabCase from 'lodash/kebabCase';
import includes from 'lodash/includes';
import Text from 'core/components/Text';
import Button from 'core/components/Button';
import { Input } from 'core/components/Form';
import { Card } from 'modules/Hypotheses/Board/interfaces';
import {
  CARD_TYPE_ACTION,
  CARD_TYPE_FEATURE
} from 'modules/Hypotheses/Board/Card/constants';
import { useModules } from 'modules/Hypotheses/Board/hooks';
import { Module as ModuleProps } from 'modules/Modules/interfaces/Module';
import Module from '../Module';
import Checked from './Checked';
import Styled from './styled';
import { useForm } from 'react-hook-form';

interface Props {
  card: Card;
  onClose: Function;
  modules: ModuleProps[];
  allModules: ModuleProps[];
}

const Modal = ({ card, modules, allModules, onClose }: Props) => {
  const MAX_LENGTH_BRANCH_NAME = 40;
  const { persistModules, loading } = useModules();
  const [modulesFiltered, filterModules] = useState<ModuleProps[]>(allModules);
  const [moduleIds, setModuleIds] = useState<string[]>();
  const { register, errors, handleSubmit, setValue, watch } = useForm({
    mode: 'onBlur'
  });

  const branchName = watch('branchName') as string;

  const handleClose = () => onClose();

  useEffect(() => {
    if (modules) {
      setModuleIds(map(modules, 'id'));
    }
  }, [modules]);

  const onChangeFilter = (value: string) => {
    filterModules(
      filter(allModules, module =>
        includes(lowerCase(module.name), lowerCase(value))
      )
    );
  };

  const onSubmit = () => {
    persistModules(card.id, {
      branchName: kebabCase(branchName),
      description: card.description,
      labels: [],
      modules: moduleIds,
      name: card.name,
      type: isEmpty(moduleIds) ? CARD_TYPE_ACTION : CARD_TYPE_FEATURE
    });
  };

  const toggleModule = (id: string) => {
    const toggledModuleIds = xor(moduleIds, [id]);
    setModuleIds(toggledModuleIds);
    if (isEmpty(toggledModuleIds)) setValue('branchName', '');
  };

  const renderModule = ({ id, name }: ModuleProps) => (
    <Styled.Module key={name}>
      <Module name={name} />
      <Checked
        checked={includes(moduleIds, id)}
        id={id}
        isLoading={loading}
        onChange={(id: string) => toggleModule(id)}
      />
    </Styled.Module>
  );

  const renderEmptyContent = () => (
    <Text.h6 color="dark">{`Where's everybody? Try another filter.`}</Text.h6>
  );

  const renderContent = () => (
    <Styled.Panel size="400px">
      {map(modulesFiltered, user => renderModule(user))}
    </Styled.Panel>
  );

  const renderModules = () =>
    isEmpty(modulesFiltered) ? renderEmptyContent() : renderContent();

  const renderBranchField = () => (
    <Fragment>
      <Input
        name="branchName"
        label="Branch name"
        disabled={!isEmpty(card.feature?.branchName)}
        defaultValue={card.feature?.branchName}
        tipTitle="Why we ask for a branch name?"
        maxLength={MAX_LENGTH_BRANCH_NAME}
        tipDescription="When a module is add to a card, Charles creates a new git branch for the client that is directly stored in the used SCM, Git or Gitlab, for example. When the branch already exists, Charles only links the card with the branch."
        ref={register({
          required: true,
          maxLength: MAX_LENGTH_BRANCH_NAME
        })}
      />
      {errors.branchName && <Text.h6 color="error">Required Field</Text.h6>}
    </Fragment>
  );

  return (
    <Styled.Modal onClose={handleClose}>
      <Styled.Header>
        <Text.h4 color="light">Add or remove module</Text.h4>
        <Styled.Search
          label="Filter by name"
          onChange={e => onChangeFilter(e.currentTarget.value)}
        />
      </Styled.Header>
      <Styled.Content>{renderModules()}</Styled.Content>
      <Styled.Bottom onSubmit={handleSubmit(onSubmit)}>
        {!isEmpty(moduleIds) && renderBranchField()}
        <Button.Default
          isLoading={loading}
          isDisabled={!isEmpty(moduleIds) && isEmpty(branchName)}
          type="submit"
          size="EXTRA_SMALL"
        >
          Save
        </Button.Default>
      </Styled.Bottom>
    </Styled.Modal>
  );
};

export default Modal;

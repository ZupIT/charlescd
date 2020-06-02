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
import map from 'lodash/map';
import filter from 'lodash/filter';
import xor from 'lodash/xor';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import kebabCase from 'lodash/kebabCase';
import includes from 'lodash/includes';
import Text from 'core/components/Text';
import { Card } from 'modules/Hypotheses/Board/interfaces';
import { useAddModule } from 'modules/Hypotheses/Board/hooks';
import { Module as ModuleProps } from 'modules/Modules/interfaces/Module';
import Module from '../Module';
import Checked from './Checked';
import Styled from './styled';

interface Props {
  card: Card;
  onClose: Function;
  modules: ModuleProps[];
  allModules: ModuleProps[];
}

const Modal = ({ card, modules, allModules, onClose }: Props) => {
  const { addModules, loading } = useAddModule();
  const [modulesFiltered, filterModules] = useState<ModuleProps[]>(allModules);
  const [moduleIds, setModuleIds] = useState<string[]>();
  const handleClose = () => onClose();

  useEffect(() => {
    if (modules) {
      setModuleIds(map(modules, 'id'));
    }
  }, [modules]);

  const handleChange = (value: string) => {
    filterModules(
      filter(allModules, module =>
        includes(lowerCase(module.name), lowerCase(value))
      )
    );
  };

  const toggleModule = (id: string) => {
    const toggledModuleIds = xor(moduleIds, [id]);
    setModuleIds(toggledModuleIds);
    addModules(card.id, {
      branchName: kebabCase(card.name),
      description: card.description,
      labels: [],
      modules: toggledModuleIds,
      name: card.name,
      type: isEmpty(toggledModuleIds) ? 'ACTION' : 'FEATURE'
    });
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

  const renderModules = () =>
    isEmpty(modulesFiltered) ? (
      <Text.h6 color="dark">{`Where's everybody?`}</Text.h6>
    ) : (
      <Styled.Panel size="400px">
        {map(modulesFiltered, user => renderModule(user))}
      </Styled.Panel>
    );

  return (
    <Styled.Modal onClose={handleClose}>
      <Styled.Header>
        <Text.h4 color="light">Add or remove module</Text.h4>
        <Styled.Search
          label="Filter by name"
          onChange={e => handleChange(e.currentTarget.value)}
        />
      </Styled.Header>
      <Styled.Content>{renderModules()}</Styled.Content>
    </Styled.Modal>
  );
};

export default Modal;

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

import React from 'react';
import map from 'lodash/map';
import Layer from 'core/components/Layer';
import ContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import InputGroup from 'core/components/Form/InputGroup';
import { Card } from 'modules/Hypotheses/Board/interfaces';
import { Module } from 'modules/Modules/interfaces/Module';
import Styled from './styled';

interface Props {
  card: Card;
}

const Features = ({ card: { feature } }: Props) => {
  const renderModule = ({ name }: Module, branchName: string) => (
    <InputGroup key={name} prepend={name} defaultValue={branchName} />
  );

  const renderModules = (modules: Module[], branchName: string) =>
    modules && map(modules, module => renderModule(module, branchName));

  return (
    <Layer>
      <ContentIcon icon="git">
        <Text.h2 color="light">Features</Text.h2>
        <Styled.Modules>
          {renderModules(feature?.modules, feature?.branchName)}
        </Styled.Modules>
      </ContentIcon>
    </Layer>
  );
};

export default Features;

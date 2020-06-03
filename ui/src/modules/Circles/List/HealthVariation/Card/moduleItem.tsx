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
import Icon from 'core/components/Icon';
import Styled from './styled';
import { CircleComponentHealth } from '../interfaces';

interface Props {
  health: CircleComponentHealth;
  unit: string;
  isDefault: boolean;
  className?: string;
}

const moduleItem = ({ health, unit, isDefault }: Props) => {
  return (
    <Styled.ModuleCardWrapper>
      <Icon name="rectangle" color={health.status.toLocaleLowerCase()} />
      <Styled.ModuleCardName
        title={health.name}
        isDefault={isDefault}
        color="light"
      >
        {health.name}
      </Styled.ModuleCardName>
      <Styled.ModuleCardVariation color="light">
        {`${health.value} ${unit}`}
      </Styled.ModuleCardVariation>
    </Styled.ModuleCardWrapper>
  );
};

export default moduleItem;

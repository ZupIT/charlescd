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
import { ChangeInputEvent } from 'core/interfaces/InputEvents';
import Styled from './styled';

export interface Radio {
  icon?: string;
  name?: string;
  value: string;
}

interface Props {
  items: Radio[];
  name: string;
  onChange?: (event: ChangeInputEvent) => void;
}

const RadioGroup = ({ name, items, onChange }: Props) => (
  <Styled.RadioGroup data-testid={`radio-group-${name}`}>
    {map(items, item => {
      const id = `radio-group-${name}-item-${item.value}`;

      return (
        <Styled.Radio key={id}>
          <Styled.Input
            id={id}
            data-testid={id}
            type="radio"
            name={name}
            value={item.value}
            onChange={onChange}
          />
          <Styled.Label icon={item.icon} value={item.value} htmlFor={id}>
            {item.icon && <Styled.Icon name={item.icon} color="dark" />}
            <Styled.Text color="dark">
              {item.name ? item.name : item.value}
            </Styled.Text>
          </Styled.Label>
        </Styled.Radio>
      );
    })}
  </Styled.RadioGroup>
);

export default RadioGroup;

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
import Text from 'core/components/Text';
import Styled from './styled';

export type RadioButtonProps = {
  icon?: string;
  name?: string;
  value: string;
}

export interface Props {
  items: RadioButtonProps[];
  name: string;
  onChange?: (event: ChangeInputEvent) => void;
  className?: string;
}

const RadioButtons = ({ name, items, onChange, className }: Props) => (
  <Styled.RadioButtons
    data-testid={`radio-group-${name}`}
    className={className}
  >
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
            {item.icon && <Styled.Icon name={item.icon} color="light" />}
            <Text tag="H6" color="light">
              {item.name ? item.name : item.value}
            </Text>
          </Styled.Label>
        </Styled.Radio>
      );
    })}
  </Styled.RadioButtons>
);

export default RadioButtons;

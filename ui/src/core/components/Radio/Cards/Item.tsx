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

import React, { useRef } from 'react';
import { ChangeInputEvent } from 'core/interfaces/InputEvents';
import Styled from './styled';

export interface RadioCard {
  title: string;
  description: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
}

interface Props {
  name: string;
  data: RadioCard;
  onChange?: (event: ChangeInputEvent) => void;
}

const Radio = ({ name, data, onChange }: Props) => {
  const radioRef = useRef<HTMLInputElement>(null);
  const { title, description, value, checked, disabled } = data;
  const id = `radio-cards-${name}-item-${value}`;

  return (
    <Styled.Radio key={id}>
      <Styled.Input
        id={id}
        ref={radioRef}
        data-testid={id}
        type="radio"
        name={name}
        disabled={disabled}
        defaultChecked={checked}
        value={value}
        onChange={onChange}
      />
      <Styled.Label value={value} htmlFor={id}>
        <Styled.Title color="dark">{title}</Styled.Title>
        <Styled.Description color="dark">{description}</Styled.Description>
      </Styled.Label>
      <Styled.Checkmark onClick={() => radioRef.current.click()} />
    </Styled.Radio>
  );
};

export default Radio;

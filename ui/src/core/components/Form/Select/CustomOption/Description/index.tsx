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
import { components, OptionTypeBase, OptionProps } from 'react-select';
import Styled from './styled';

const CustomOption = (props: OptionProps<OptionTypeBase>) => {
  const { label, description } = props.data;

  return (
    <components.Option {...props}>
      <Styled.Wrapper>
        <Styled.Check isActive={props.isSelected}>
          <Styled.Icon name="checkmark" color="light" size="20px" />
        </Styled.Check>
        <Styled.Content>
          <Styled.Label color="light">{label}</Styled.Label>
          <Styled.Description color="dark">{description}</Styled.Description>
        </Styled.Content>
      </Styled.Wrapper>
    </components.Option>
  );
};

export default CustomOption;

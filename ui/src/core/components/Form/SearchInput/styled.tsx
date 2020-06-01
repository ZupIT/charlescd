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
import styled from 'styled-components';
import IconComponent, { Props as IconProps } from 'core/components/Icon';
import InputComponent from 'core/components/Form/Input';

interface Props extends IconProps {
  isFocused?: boolean;
}

const Icon = styled((props: Props) => {
  const devProps = { ...props };
  delete devProps.isFocused;

  return <IconComponent {...devProps} />;
})<Props>`
  cursor: text;
  color: ${({ theme, isFocused }) => {
    return isFocused
      ? theme.input.search.focus.color
      : theme.input.search.color;
  }};
`;

const Input = styled(InputComponent)`
  width: 100%;
  height: 25px;

  input {
    padding: 5px;
    font-size: 12px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  height: 40px;

  :focus-within {
    background-color: ${({ theme }) => theme.input.focus.background};
  }
`;

export default {
  Wrapper,
  Icon,
  Input
};

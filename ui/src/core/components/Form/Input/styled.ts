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

import { Ref } from 'react';
import styled, { css } from 'styled-components';
import Icon from 'core/components/Icon';

interface InputProps {
  resume?: boolean;
  ref?: Ref<HTMLInputElement>;
  hasError?: boolean;
}

interface WrapperProps {
  type?: string;
}

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  height: 42px;
  ${({ type }) =>
    type === 'hidden' &&
    css`
      display: none;
    `};
`;

const Label = styled.label<{ isFocused: boolean; hasError: boolean }>`
  color: ${({ theme, hasError }) =>
    hasError ? theme.input.error.color : theme.input.label};
  cursor: text;
  font-size: ${({ isFocused }) => (isFocused ? '12px' : '14px')};
  position: absolute;
  top: ${({ isFocused }) => (isFocused ? '0px' : '20px')};
  transition: top 0.1s, font-size 0.1s;
`;

const Input = styled.input<InputProps>`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.input.error.borderColor : theme.input.borderColor};
  border-radius: 0;
  bottom: 0px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.input.color};
  font-size: 14px;
  padding-bottom: 5px;
  position: absolute;
  width: 100%;

  :focus {
    border-bottom-color: ${({ theme }) => theme.input.focus.borderColor};

    + ${Label} {
      top: 0px;
    }
  }

  :disabled {
    color: ${({ theme }) => theme.input.disabled.color};
    border-bottom-color: ${({ theme }) => theme.input.disabled.borderColor};
  }

  ${({ resume }) =>
    resume &&
    css`
      background: transparent;
      border: none;
    `};
`;

const Loading = styled(Icon)`
  position: absolute;
  display: block;
  right: 0;
  bottom: 5px;
`;

export default {
  Wrapper,
  Input,
  Label,
  Loading
};

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

interface TextAreaProps {
  resume?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
  isFocused: boolean;
}

interface WrapperProps {
  type?: string;
  isFocused: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  height: ${({ isFocused }) => (isFocused ? '130px' : '52px')};
  position: relative;
  ${({ type }) =>
    type === 'hidden' &&
    css`
      display: none;
    `};
`;

const Label = styled.label<{ isFocused: boolean }>`
  position: absolute;
  color: ${({ theme }) => theme.input.label};
  font-size: 12px;
  top: ${({ isFocused }) => (isFocused ? '0px' : '30px')};
  transition: top 0.1s, font-size 0.1s;
`;

const TextArea = styled.textarea<TextAreaProps>`
  scroll: auto;
  position: absolute;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.input.borderColor};
  box-sizing: border-box;
  font-size: 14px;
  height: ${({ isFocused }) => (isFocused ? '110px' : '32px')};
  width: 100%;
  background-color: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.input.color};
  padding-bottom: 5px;
  bottom: 0px;
  :focus {
    border-bottom-color: ${({ theme }) => theme.input.focus.borderColor};
  }
  :focus + ${Label} {
    top: 0px;
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

export default {
  Wrapper,
  TextArea,
  Label
};

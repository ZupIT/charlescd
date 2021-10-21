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

import styled, { css } from 'styled-components';
import Icon from 'core/components/Icon';
import { Props, HEIGHT } from './index';

const Button = styled.button<Partial<Props>>`
  position: relative;
  background-color: ${({ theme }) => theme.button.default.background};
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.button.default.color};
  font-size: 10px;
  height: ${({ size }) => HEIGHT[size]};
  line-height: ${({ size }) => HEIGHT[size]};
  font-weight: bold;
  padding: 0 33px;
  cursor: pointer;
  transition: 0.2s;
  width: fit-content;

  :hover {
    transform: scale(1.1);
  }

  ${({ size }) =>
    HEIGHT[size] === HEIGHT.EXTRA_SMALL &&
    css`
      padding: 0 18px;
    `};

  ${({ theme, disabled }) =>
    disabled &&
    css`
      background-color: ${theme.button.default.disabled.background};
      color: ${theme.button.default.disabled.color};
      cursor: default;
      opacity: 0.3;

      > * {
        cursor: default;
      }

      :hover {
        transform: scale(1);
      }
    `};
`;

const Loading = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default {
  Button,
  Loading
};

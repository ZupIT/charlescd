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
import { Props } from './';
import ComponentIcon from 'core/components/Icon';
import ComponentText from 'core/components/Text';
import ReactTooltip from 'react-tooltip';

const Icon = styled(ComponentIcon)``;

const Text = styled(ComponentText.h5)``;

const Item = styled.button<Partial<Props>>`
  color: ${({ theme }) => theme.dropdown.color};
  cursor: pointer;
  border: none;
  background: transparent;
  height: 34px;
  display: flex;
  flex-direction: row;
  align-items: center;

  :hover {
    background: ${({ theme }) => theme.dropdown.bgHover};
  }

  > * + * {
    margin-left: 5px;
  }

  ${({ isInactive }) =>
    isInactive &&
    css`
      ${Icon}, ${Text} {
        color: ${({ theme }) => theme.dropdown.disabled.color};
      }
    `};
`;

const ReactTooltipStyled = styled(ReactTooltip)`
  text-align: left !important;
  padding: 8px !important;
  font-size: 12px !important;
  background-color: ${({ theme }) => theme.dropdown.background} !important;
  color: ${({ theme }) => theme.dropdown.color} !important;

  ::after {
    border-right-color: ${({ theme }) => theme.dropdown.background} !important;
  }

  span {
    text-align: left !important;
    padding: 0px !important;
    font-size: 12px;
    background-color: ${({ theme }) => theme.dropdown.background};
    color: ${({ theme }) => theme.dropdown.color};
  }
`;

export default {
  Item,
  Icon,
  Text,
  ReactTooltipStyled
};

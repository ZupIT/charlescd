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
import ComponentText from 'core/components/Text';
import { Props } from './';

const Log = styled.div<Pick<Props, 'type'>>`
  display: flex;
  flex-direction: row;
  width: 231px;
  align-items: center;
  padding: 2.5px 8px 2.5px 10px;
  border-radius: 9.5px;
  box-sizing: border-box;

  ${({ theme, type }) =>
    type === 'error' &&
    css`
      background-color: ${theme.log.error.background};
    `}

  ${({ theme, type }) =>
    type === 'warning' &&
    css`
      background-color: ${theme.log.warning.background};
    `}
`;

const Text = styled(ComponentText.h5)<Pick<Props, 'type'>>`
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5px;

  ${({ theme, type }) =>
    type === 'error' &&
    css`
      color: ${theme.log.error.color};
    `}

  ${({ theme, type }) =>
    type === 'warning' &&
    css`
      color: ${theme.log.warning.color};
    `}
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

export default {
  Log,
  Content,
  Text
};

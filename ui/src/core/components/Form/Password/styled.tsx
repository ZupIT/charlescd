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
import ComponentIcon from 'core/components/Icon';

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

const Icon = styled(ComponentIcon)`
  bottom: 10px;
  right: 5px;
  position: absolute;
`;

export default {
  Wrapper,
  Icon
};

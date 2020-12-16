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
import CardBase from 'core/components/Card/Base';
import CardBody from 'core/components/Card/Body';

type StyledProps = {
  isDisabled?: boolean;
};

const CardConfig = styled(CardBase)<StyledProps>`
  background-color: ${({ theme }) => theme.card.config.background};

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      background-color: ${({ theme }) => theme.card.config.disabled.background};
    `}
`;

const Body = styled(CardBody)`
  > :not(:first-child) {
    margin-top: 10px;
  }
`;

export default {
  CardConfig,
  Body
};

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

import styled from 'styled-components';
import CardBase from 'core/components/Card/Base';
import CardBody from 'core/components/Card/Body';

const Card = styled(CardBase)`
  background-color: ${({ theme }) => theme.card.role.background};
`;

const Body = styled(CardBody)`
  display: flex;
  flex-direction: row;

  > :not(:first-child) {
    margin-left: 50px;
  }
`;

export default {
  Body,
  Card
};

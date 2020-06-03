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

const CardCircle = styled(CardBase)`
  width: 303px;
  background: ${({ theme }) => theme.card.circle.background};
  transition: all 0.3s;

  :hover {
    transition: all 0.3s;
    transform: scale(1.03);
  }
`;

const CustomCardBody = styled(CardBody)`
  min-height: 100px;

  > * + * {
    margin-top: 10px;
  }
`;

export default {
  CardCircle,
  CardBody: CustomCardBody
};

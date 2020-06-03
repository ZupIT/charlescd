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
import Text from 'core/components/Text';
import { Props } from '.';

const CustomText = styled(Text.h4)``;

const CardRelease = styled(CardBase)<Partial<Props>>`
  background-color: ${({ theme, status }) =>
    theme.card.release.background[status]};

  :hover {
    ${CustomText} {
      white-space: normal;
      overflow: visible;
    }
  }
`;

const CustomCardBody = styled(CardBody)`
  ${CustomText} {
    width: 235px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export default {
  CardRelease,
  CardBody: CustomCardBody,
  Text: CustomText
};

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
import Text from 'core/components/Text';
import { Props } from '.';

const Title = styled(Text.h4)`
  width: 235px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Description = styled(Text.h5)`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 10px;

  :only-child {
    margin-top: 0;
  }
`;

const Content = styled.div`
  margin-top: 10px;
`;

const Card = styled(CardBase)<Partial<Props>>`
  background-color: ${({ theme, color }) => theme.card.main[color]};
  width: ${({ width }) => width && width};

  :hover {
    ${Title}, ${Description} {
      white-space: normal;
      overflow: visible;
    }
  }
`;

export default {
  Card,
  Title,
  Description,
  Content
};

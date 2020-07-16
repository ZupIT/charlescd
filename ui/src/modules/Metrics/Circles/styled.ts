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
import Text from 'core/components/Text';

const Content = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0 0 30px;
`;

const MiniCard = styled.div`
  background: ${({ theme }) => theme.metrics.dashboard.card};
  display: flex;
  height: 94px;
  width: 175px;
  margin-right: 20px;
  border-radius: 4px;
  box-sizing: border-box;
`;

const CirclesData = styled(Text.h1)`
  margin: auto;
  > * + * {
    margin-top: 5px;
  }
`;

const CirclesDataDetail = styled.div`
  margin: auto 25px auto 0;
  > * + * {
    margin-top: 5px;
  }
`;

export default {
  Content,
  MiniCard,
  CirclesData,
  CirclesDataDetail
};

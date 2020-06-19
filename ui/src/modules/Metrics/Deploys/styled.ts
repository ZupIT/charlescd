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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 61px 0 80px 37px;

  > * + * {
    margin-top: 20px;
  }
`;

interface Card {
  height?: string;
  width?: string;
}

const Plates = styled.div`
  display: flex;
  flex-direction: row;

  > * {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    > :not(:first-child) {
      margin-top: 12px;
    }
  }

  > :not(:first-child) {
    margin-left: 20px;
  }
`;

const Card = styled.div<Card>`
  background: ${({ theme }) => theme.metrics.dashboard.card};
  height: ${({ height }) => height || '94px'};
  width: ${({ width }) => width || '175px'};
  padding: 16px 20px;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Chart = styled.div`
  width: 700px;
`;

export default {
  Content,
  Card,
  Plates,
  Chart
};

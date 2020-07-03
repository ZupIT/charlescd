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
import SearchInputComponent from 'core/components/Form/SearchInput';

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

const HistoryWrapper = styled.div`
  background: ${({ theme }) => theme.metrics.dashboard.card};
  height: 641px;
  width: 1220px;
  border-radius: 5px;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
`;

const HistoryLegend = styled.div`
  display: flex;
  padding-left: 20px;

  span {
    margin-right: 15px;
  }
`;

interface Dot {
  active: boolean;
}

const Dot = styled.div<Dot>`
  height: 15px;
  width: 15px;
  background-color: ${({ theme, active }) =>
    active ? theme.metrics.circles.active : theme.metrics.circles.inactive};
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
`;

const HistorySearchInput = styled(SearchInputComponent)`
  background: ${({ theme }) => theme.metrics.circles.filter};
  width: 250px;
  border-radius: 5px;
  padding-left: 15px;
`;

export default {
  Content,
  MiniCard,
  CirclesData,
  CirclesDataDetail,
  HistoryWrapper,
  HistoryHeader,
  HistoryLegend,
  HistorySearchInput,
  Dot
};

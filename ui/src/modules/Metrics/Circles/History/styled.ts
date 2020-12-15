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
import SearchInputComponent from 'core/components/Form/SearchInput';

type ColumnProps = {
  width?: number;
};

const lineHeight = '40px';

const defaultTableRow = css`
  display: flex;
  height: ${lineHeight};
  border-radius: 4px;
  margin-bottom: 5px;
`;

const Table = styled.div`
  margin: 20px 20px 0 20px;
`;

const TableRow = styled.div`
  ${defaultTableRow}
  cursor: pointer;
`;

const TableHead = styled.div`
  ${defaultTableRow}
`;

const CircleRow = styled.div`
  position: relative;
  background-color: ${({ theme }) =>
    theme.metrics.circles.history.circleRow.background};
  margin-bottom: 5px;
  border-radius: 4px;
`;

const ReleaseRow = styled.div`
  position: relative;
  background-color: ${({ theme }) =>
    theme.metrics.circles.history.releaseRow.background};
  margin-bottom: 5px;
  border-radius: 4px;
`;

const ComponentsRow = styled.div`
  ${defaultTableRow}
  background-color: ${({ theme }) =>
    theme.metrics.circles.history.componentRow.background};
  border-radius: 4px;
`;

const ReleasesWrapper = styled.div`
  padding: 0 10px 10px 20px;
`;

const TableColumn = styled.div<ColumnProps>`
  display: flex;
  align-items: center;
  flex: ${({ width }) => width || 1};

  :first-child {
    padding-left: 30px;
  }
`;

const CircleRowWrapper = styled.div``;

const HistoryWrapper = styled.div`
  background: ${({ theme }) => theme.metrics.dashboard.card};
  height: auto;
  width: 1220px;
  border-radius: 5px;
  padding-bottom: 20px;
  margin-bottom: 50px;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
`;

const HistoryLegend = styled.div`
  display: flex;
  padding-left: 25px;

  span {
    margin-right: 15px;
  }
`;

interface Dot {
  status: string;
}

const Dot = styled.div<Dot>`
  height: 16px;
  width: 16px;
  background-color: ${({ theme, status }) => theme.metrics.circles[status]};
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

interface Line {
  status: string;
}

const StatusLine = styled.div<Line>`
  position: absolute;
  left: 0;
  height: calc(100% - 6px);
  width: 5px;
  background-color: ${({ theme, status }) => theme.metrics.circles[status]};
  margin: 3px 10px 0 5px;
  border-radius: 10px;
`;

const NoReleaseWrapper = styled.div`
  display: flex;
  padding-left: 10px;
  margin-bottom: 5px;

  span {
    margin-left: 5px;
    margin-top: 1px;
  }
`;

export default {
  Table,
  TableRow,
  TableColumn,
  TableHead,
  CircleRow,
  ReleaseRow,
  ReleasesWrapper,
  ComponentsRow,
  CircleRowWrapper,
  HistoryWrapper,
  HistoryHeader,
  HistoryLegend,
  HistorySearchInput,
  Dot,
  StatusLine,
  NoReleaseWrapper
};

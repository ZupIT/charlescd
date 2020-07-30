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

type ColumnProps = {
  width?: number;
};

const lineHeight = '40px';

const defaultTableRow = css`
  display: flex;
  height: ${lineHeight};
  border-radius: 4px;
  margin-bottom: 5px;
  width: 100%;
`;

const Table = styled.div`
  margin: 0 20px 0 20px;
`;

const TableRow = styled.div`
  ${defaultTableRow}
  cursor: pointer;
`;

const TableHead = styled.div`
  ${defaultTableRow}
`;

const ReleaseRow = styled.div`
  position: relative;
  background-color: ${({ theme }) =>
    theme.metrics.deploy.release.releaseRow.background};
  margin-bottom: 5px;
  border-radius: 4px;
`;

const ComponentsRow = styled.div`
  ${defaultTableRow}
  background-color: ${({ theme }) =>
    theme.metrics.deploy.release.componentRow.background};
  border-radius: 4px;
`;

const ReleasesWrapper = styled.div`
  padding: 0 10px 10px 25px;
`;

const TableColumn = styled.div<ColumnProps>`
  display: flex;
  align-items: center;
  flex: ${({ width }) => width || 1};

  :first-child {
    padding-left: 20px;
  }
`;

const ReleaseHistoryWrapper = styled.div`
  background: ${({ theme }) => theme.metrics.dashboard.card};
  height: 660px;
  width: 1220px;
  border-radius: 5px;
  padding-bottom: 20px;
  margin-bottom: 50px;
`;

const ReleaseHistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
`;

const ReleaseHistoryLegend = styled.div`
  display: flex;
  padding-left: 20px;
  padding-top: 20px;

  span {
    margin-right: 15px;
  }
`;

interface Dot {
  status: string;
}

const Dot = styled.div<Dot>`
  height: 15px;
  width: 15px;
  background-color: ${({ theme, status }) => theme.metrics.deploy[status]};
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
`;

interface Line {
  status: string;
}

const StatusLine = styled.div<Line>`
  position: absolute;
  left: 0;
  height: calc(100% - 6px);
  width: 5px;
  background-color: ${({ theme, status }) => theme.metrics.deploy[status]};
  margin: 3px 10px 0 5px;
  border-radius: 10px;
`;

export default {
  Table,
  TableRow,
  TableColumn,
  TableHead,
  ReleaseRow,
  ReleasesWrapper,
  ComponentsRow,
  ReleaseHistoryWrapper,
  ReleaseHistoryHeader,
  ReleaseHistoryLegend,
  Dot,
  StatusLine
};

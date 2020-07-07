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
  background-color: ${({ theme }) =>
    theme.metrics.circles.history.circleRow.background};
  margin-bottom: 5px;
`;

const ReleaseRow = styled.div`
  background-color: ${({ theme }) =>
    theme.metrics.circles.history.releaseRow.background};
  margin-bottom: 5px;
`;

const ComponentsRow = styled.div`
  ${defaultTableRow}
  background-color: ${({ theme }) =>
    theme.metrics.circles.history.componentRow.background};
`;

const ReleasesWrapper = styled.div`
  padding: 0 10px 10px 10px;
`;

const TableColumn = styled.div<ColumnProps>`
  display: flex;
  align-items: center;
  flex: ${({ width }) => width || 1};

  :first-child {
    padding-left: 20px;
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
  ComponentsRow
};

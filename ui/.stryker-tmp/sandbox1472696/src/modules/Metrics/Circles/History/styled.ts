// @ts-nocheck
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
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import styled, { css } from 'styled-components';
import SearchInputComponent from 'core/components/Form/SearchInput';
type ColumnProps = {
  width?: number;
};
const lineHeight = stryMutAct_9fa48("4819") ? "" : (stryCov_9fa48("4819"), '40px');
const defaultTableRow = stryMutAct_9fa48("4820") ? css`` : (stryCov_9fa48("4820"), css`
  display: flex;
  height: ${lineHeight};
  border-radius: 4px;
  margin-bottom: 5px;
`);
const Table = stryMutAct_9fa48("4821") ? styled.div`` : (stryCov_9fa48("4821"), styled.div`
  margin: 20px 20px 0 20px;
`);
const TableRow = stryMutAct_9fa48("4822") ? styled.div`` : (stryCov_9fa48("4822"), styled.div`
  ${defaultTableRow}
  cursor: pointer;
`);
const TableHead = stryMutAct_9fa48("4823") ? styled.div`` : (stryCov_9fa48("4823"), styled.div`
  ${defaultTableRow}
`);
const CircleRow = stryMutAct_9fa48("4824") ? styled.div`` : (stryCov_9fa48("4824"), styled.div`
  position: relative;
  background-color: ${stryMutAct_9fa48("4825") ? () => undefined : (stryCov_9fa48("4825"), ({
  theme
}) => theme.metrics.circles.history.circleRow.background)};
  margin-bottom: 5px;
  border-radius: 4px;
`);
const ReleaseRow = stryMutAct_9fa48("4826") ? styled.div`` : (stryCov_9fa48("4826"), styled.div`
  position: relative;
  background-color: ${stryMutAct_9fa48("4827") ? () => undefined : (stryCov_9fa48("4827"), ({
  theme
}) => theme.metrics.circles.history.releaseRow.background)};
  margin-bottom: 5px;
  border-radius: 4px;
`);
const ComponentsRow = stryMutAct_9fa48("4828") ? styled.div`` : (stryCov_9fa48("4828"), styled.div`
  ${defaultTableRow}
  background-color: ${stryMutAct_9fa48("4829") ? () => undefined : (stryCov_9fa48("4829"), ({
  theme
}) => theme.metrics.circles.history.componentRow.background)};
  border-radius: 4px;
`);
const ReleasesWrapper = stryMutAct_9fa48("4830") ? styled.div`` : (stryCov_9fa48("4830"), styled.div`
  padding: 0 10px 10px 20px;
`);
const TableColumn = stryMutAct_9fa48("4831") ? styled.div<ColumnProps>`` : (stryCov_9fa48("4831"), styled.div<ColumnProps>`
  display: flex;
  align-items: center;
  flex: ${stryMutAct_9fa48("4832") ? () => undefined : (stryCov_9fa48("4832"), ({
  width
}) => stryMutAct_9fa48("4835") ? width && 1 : stryMutAct_9fa48("4834") ? false : stryMutAct_9fa48("4833") ? true : (stryCov_9fa48("4833", "4834", "4835"), width || 1))};

  :first-child {
    padding-left: 30px;
  }
`);
const CircleRowWrapper = stryMutAct_9fa48("4836") ? styled.div`Stryker was here!` : (stryCov_9fa48("4836"), styled.div``);
const HistoryWrapper = stryMutAct_9fa48("4837") ? styled.div`` : (stryCov_9fa48("4837"), styled.div`
  background: ${stryMutAct_9fa48("4838") ? () => undefined : (stryCov_9fa48("4838"), ({
  theme
}) => theme.metrics.dashboard.card)};
  height: auto;
  width: 1220px;
  border-radius: 5px;
  padding-bottom: 20px;
  margin-bottom: 50px;
`);
const HistoryHeader = stryMutAct_9fa48("4839") ? styled.div`` : (stryCov_9fa48("4839"), styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
`);
const HistoryLegend = stryMutAct_9fa48("4840") ? styled.div`` : (stryCov_9fa48("4840"), styled.div`
  display: flex;
  padding-left: 25px;

  span {
    margin-right: 15px;
  }
`);
type DotProps = {
  status: string;
};
const Dot = stryMutAct_9fa48("4841") ? styled.div<DotProps>`` : (stryCov_9fa48("4841"), styled.div<DotProps>`
  height: 16px;
  width: 16px;
  background-color: ${stryMutAct_9fa48("4842") ? () => undefined : (stryCov_9fa48("4842"), ({
  theme,
  status
}) => theme.metrics.circles[status])};
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
`);
const HistorySearchInput = stryMutAct_9fa48("4843") ? styled(SearchInputComponent)`` : (stryCov_9fa48("4843"), styled(SearchInputComponent)`
  background: ${stryMutAct_9fa48("4844") ? () => undefined : (stryCov_9fa48("4844"), ({
  theme
}) => theme.metrics.circles.filter)};
  width: 250px;
  border-radius: 5px;
  padding-left: 15px;
`);
type LineProps = {
  status: string;
};
const StatusLine = stryMutAct_9fa48("4845") ? styled.div<LineProps>`` : (stryCov_9fa48("4845"), styled.div<LineProps>`
  position: absolute;
  left: 0;
  height: calc(100% - 6px);
  width: 5px;
  background-color: ${stryMutAct_9fa48("4846") ? () => undefined : (stryCov_9fa48("4846"), ({
  theme,
  status
}) => theme.metrics.circles[status])};
  margin: 3px 10px 0 5px;
  border-radius: 10px;
`);
const NoReleaseWrapper = stryMutAct_9fa48("4847") ? styled.div`` : (stryCov_9fa48("4847"), styled.div`
  display: flex;
  padding-left: 10px;
  margin-bottom: 5px;

  span {
    margin-left: 5px;
    margin-top: 1px;
  }
`);
export default stryMutAct_9fa48("4848") ? {} : (stryCov_9fa48("4848"), {
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
});
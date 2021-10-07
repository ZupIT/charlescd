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
type ColumnProps = {
  width?: number;
};
const lineHeight = stryMutAct_9fa48("4891") ? "" : (stryCov_9fa48("4891"), '40px');
const defaultTableRow = stryMutAct_9fa48("4892") ? css`` : (stryCov_9fa48("4892"), css`
  display: flex;
  height: ${lineHeight};
  border-radius: 4px;
  margin-bottom: 5px;
  width: 100%;
`);
const Table = stryMutAct_9fa48("4893") ? styled.div`` : (stryCov_9fa48("4893"), styled.div`
  margin: 0 20px 0 20px;
`);
const TableRow = stryMutAct_9fa48("4894") ? styled.div`` : (stryCov_9fa48("4894"), styled.div`
  ${defaultTableRow}
  cursor: pointer;
`);
const TableHead = stryMutAct_9fa48("4895") ? styled.div`` : (stryCov_9fa48("4895"), styled.div`
  ${defaultTableRow}
`);
const ReleaseRow = stryMutAct_9fa48("4896") ? styled.div`` : (stryCov_9fa48("4896"), styled.div`
  position: relative;
  background-color: ${stryMutAct_9fa48("4897") ? () => undefined : (stryCov_9fa48("4897"), ({
  theme
}) => theme.metrics.deploy.release.releaseRow.background)};
  margin-bottom: 5px;
  border-radius: 4px;
`);
const ComponentsRow = stryMutAct_9fa48("4898") ? styled.div`` : (stryCov_9fa48("4898"), styled.div`
  ${defaultTableRow}
  background-color: ${stryMutAct_9fa48("4899") ? () => undefined : (stryCov_9fa48("4899"), ({
  theme
}) => theme.metrics.deploy.release.componentRow.background)};
  border-radius: 4px;
`);
const ReleasesWrapper = stryMutAct_9fa48("4900") ? styled.div`` : (stryCov_9fa48("4900"), styled.div`
  padding: 0 10px 10px 25px;
`);
const TableColumn = stryMutAct_9fa48("4901") ? styled.div<ColumnProps>`` : (stryCov_9fa48("4901"), styled.div<ColumnProps>`
  display: flex;
  align-items: center;
  flex: ${stryMutAct_9fa48("4902") ? () => undefined : (stryCov_9fa48("4902"), ({
  width
}) => stryMutAct_9fa48("4905") ? width && 1 : stryMutAct_9fa48("4904") ? false : stryMutAct_9fa48("4903") ? true : (stryCov_9fa48("4903", "4904", "4905"), width || 1))};

  :first-child {
    padding-left: 20px;
  }
`);
const ReleaseHistoryWrapper = stryMutAct_9fa48("4906") ? styled.div`` : (stryCov_9fa48("4906"), styled.div`
  background: ${stryMutAct_9fa48("4907") ? () => undefined : (stryCov_9fa48("4907"), ({
  theme
}) => theme.metrics.dashboard.card)};
  height: 660px;
  width: 1220px;
  border-radius: 5px;
  padding-bottom: 20px;
  margin-bottom: 50px;
`);
const ReleaseHistoryHeader = stryMutAct_9fa48("4908") ? styled.div`` : (stryCov_9fa48("4908"), styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
`);
const ReleaseHistoryLegend = stryMutAct_9fa48("4909") ? styled.div`` : (stryCov_9fa48("4909"), styled.div`
  display: flex;
  padding-left: 20px;
  padding-top: 20px;

  span {
    margin-right: 15px;
  }
`);
type DotProps = {
  status: string;
};
const Dot = stryMutAct_9fa48("4910") ? styled.div<DotProps>`` : (stryCov_9fa48("4910"), styled.div<DotProps>`
  height: 15px;
  width: 15px;
  background-color: ${stryMutAct_9fa48("4911") ? () => undefined : (stryCov_9fa48("4911"), ({
  theme,
  status
}) => theme.metrics.deploy[status])};
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
`);
type LineProps = {
  status: string;
};
const StatusLine = stryMutAct_9fa48("4912") ? styled.div<LineProps>`` : (stryCov_9fa48("4912"), styled.div<LineProps>`
  position: absolute;
  left: 0;
  height: calc(100% - 6px);
  width: 5px;
  background-color: ${stryMutAct_9fa48("4913") ? () => undefined : (stryCov_9fa48("4913"), ({
  theme,
  status
}) => theme.metrics.deploy[status])};
  margin: 3px 10px 0 5px;
  border-radius: 10px;
`);
export default stryMutAct_9fa48("4914") ? {} : (stryCov_9fa48("4914"), {
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
});
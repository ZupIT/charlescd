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
// @ts-nocheck

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

import styled from 'styled-components';
import Text from 'core/components/Text';
const Header = stryMutAct_9fa48("1172") ? styled.div`` : (stryCov_9fa48("1172"), styled.div`
  height: 41px;
  background-color: ${stryMutAct_9fa48("1173") ? () => undefined : (stryCov_9fa48("1173"), ({
  theme
}) => theme.tabPanel.header.background)};
  padding-right: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`);
const Panel = stryMutAct_9fa48("1174") ? styled.div`` : (stryCov_9fa48("1174"), styled.div`
  width: 660px;
  box-sizing: border-box;
  border-right: 1px solid ${stryMutAct_9fa48("1175") ? () => undefined : (stryCov_9fa48("1175"), ({
  theme
}) => theme.tabPanel.border)};
`);
const Content = stryMutAct_9fa48("1176") ? styled.div`` : (stryCov_9fa48("1176"), styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding-right: 32px;
  padding-left: 32px;
  overflow: auto;
  height: calc(100vh - 90px);
`);
const Actions = stryMutAct_9fa48("1177") ? styled.div`` : (stryCov_9fa48("1177"), styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: row;
`);
const Title = stryMutAct_9fa48("1178") ? styled.div`` : (stryCov_9fa48("1178"), styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > * + * {
    margin-left: 8px;
  }
`);
const TabPanelText = stryMutAct_9fa48("1179") ? styled(Text)`` : (stryCov_9fa48("1179"), styled(Text)`
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`);
const Tab = stryMutAct_9fa48("1180") ? styled.div`` : (stryCov_9fa48("1180"), styled.div`
  color: ${stryMutAct_9fa48("1181") ? () => undefined : (stryCov_9fa48("1181"), ({
  theme
}) => theme.tabPanel.color)};
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 233px;
  height: 41px;
  box-sizing: border-box;
  padding-left: 31px;
  background-color: ${stryMutAct_9fa48("1182") ? () => undefined : (stryCov_9fa48("1182"), ({
  theme
}) => theme.tabPanel.background)};

  > * + * {
    margin-left: auto;
    margin-right: 12px;
  }
`);
export default stryMutAct_9fa48("1183") ? {} : (stryCov_9fa48("1183"), {
  Content,
  TabPanelText,
  Header,
  Panel,
  Tab,
  Title,
  Actions
});
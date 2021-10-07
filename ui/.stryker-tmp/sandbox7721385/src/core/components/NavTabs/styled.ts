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
import Text from 'core/components/Text';
type TabItemProps = {
  isActive?: boolean;
};
const TabList = stryMutAct_9fa48("1054") ? styled.div`` : (stryCov_9fa48("1054"), styled.div`
  display: flex;
  border-bottom: 2px solid ${stryMutAct_9fa48("1055") ? () => undefined : (stryCov_9fa48("1055"), ({
  theme
}) => theme.navTabs.list.border)};
`);
const Tab = stryMutAct_9fa48("1056") ? styled.div`` : (stryCov_9fa48("1056"), styled.div`
  padding: 20px 0;
`);
const TabItem = stryMutAct_9fa48("1057") ? styled.div<TabItemProps>`` : (stryCov_9fa48("1057"), styled.div<TabItemProps>`
  padding: 16px 26px 18px 26px;
  position: relative;
  top: 2px;
  cursor: pointer;

  ${stryMutAct_9fa48("1058") ? () => undefined : (stryCov_9fa48("1058"), ({
  isActive
}) => stryMutAct_9fa48("1061") ? isActive || css`
      border-bottom: 2px solid ${({
  theme
}) => theme.navTabs.item.border};
    ` : stryMutAct_9fa48("1060") ? false : stryMutAct_9fa48("1059") ? true : (stryCov_9fa48("1059", "1060", "1061"), isActive && (stryMutAct_9fa48("1062") ? css`` : (stryCov_9fa48("1062"), css`
      border-bottom: 2px solid ${stryMutAct_9fa48("1063") ? () => undefined : (stryCov_9fa48("1063"), ({
  theme
}) => theme.navTabs.item.border)};
    `))))}
`);
const Placeholder = stryMutAct_9fa48("1064") ? styled.div`` : (stryCov_9fa48("1064"), styled.div`
  margin-top: 80px;
  margin-bottom: 80px;
  margin-left: 120px;
`);
const PlaceholderTitle = stryMutAct_9fa48("1065") ? styled(Text)`` : (stryCov_9fa48("1065"), styled(Text)`
  margin-bottom: 10px;
`);
export default stryMutAct_9fa48("1066") ? {} : (stryCov_9fa48("1066"), {
  TabList,
  Tab,
  TabItem,
  Placeholder,
  PlaceholderTitle
});
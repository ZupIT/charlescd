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
import { Input } from 'core/components/Form';
const Search = stryMutAct_9fa48("6606") ? styled(Input)`` : (stryCov_9fa48("6606"), styled(Input)`
  margin-top: 5px;
  margin-bottom: 20px;
  margin: 5px 40px 10px;

  > input {
    background-color: transparent;
    border-bottom: 1px solid ${stryMutAct_9fa48("6607") ? () => undefined : (stryCov_9fa48("6607"), ({
  theme
}) => theme.token.workspace.search.input)};
  }
`);
const Wrapper = stryMutAct_9fa48("6608") ? styled.div`` : (stryCov_9fa48("6608"), styled.div`
  height: 50px;
`);
const Item = stryMutAct_9fa48("6609") ? styled.div`` : (stryCov_9fa48("6609"), styled.div`
  border-top: 1px solid ${stryMutAct_9fa48("6610") ? () => undefined : (stryCov_9fa48("6610"), ({
  theme
}) => theme.token.workspace.item.border)};
  border-bottom: 1px solid ${stryMutAct_9fa48("6611") ? () => undefined : (stryCov_9fa48("6611"), ({
  theme
}) => theme.token.workspace.item.border)};
  height: 70px;
  padding: 0 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  :last-child {
    border: hidden;
  }
`);
const Content = stryMutAct_9fa48("6612") ? styled.div`` : (stryCov_9fa48("6612"), styled.div`
  margin-top: 16px;
  height: 500px;
  overflow-y: auto;
`);
const Description = stryMutAct_9fa48("6613") ? styled.div`Stryker was here!` : (stryCov_9fa48("6613"), styled.div``);
const Subtitle = stryMutAct_9fa48("6614") ? styled.div`` : (stryCov_9fa48("6614"), styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
`);
export default stryMutAct_9fa48("6615") ? {} : (stryCov_9fa48("6615"), {
  Search,
  Wrapper,
  Item,
  Content,
  Description,
  Subtitle
});
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

import styled from 'styled-components';
import InputComponent from 'core/components/Form/Input';
import IconComponent from 'core/components/Icon';
const Wrapper = stryMutAct_9fa48("568") ? styled.div`` : (stryCov_9fa48("568"), styled.div`
  position: relative;
`);
const Input = stryMutAct_9fa48("569") ? styled(InputComponent)`` : (stryCov_9fa48("569"), styled(InputComponent)`
  > input {
    background-color: ${stryMutAct_9fa48("570") ? () => undefined : (stryCov_9fa48("570"), ({
  theme
}) => theme.input.action.background)};
    height: 34px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    padding: 0 35px 0 15px;
  }
`);
const Icon = stryMutAct_9fa48("571") ? styled(IconComponent)`` : (stryCov_9fa48("571"), styled(IconComponent)`
  background-color: ${stryMutAct_9fa48("572") ? () => undefined : (stryCov_9fa48("572"), ({
  theme
}) => theme.input.action.background)};
  padding-left: 10px;
`);
const Action = stryMutAct_9fa48("573") ? styled.button`` : (stryCov_9fa48("573"), styled.button`
  background: none;
  bottom: 8px;
  border: none;
  display: flex;
  cursor: pointer;
  position: absolute;
  right: 10px;
`);
export default stryMutAct_9fa48("574") ? {} : (stryCov_9fa48("574"), {
  Wrapper,
  Input,
  Icon,
  Action
});
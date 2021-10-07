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
import Input from 'core/components/Form/Input';
const Wrapper = stryMutAct_9fa48("600") ? styled.div`` : (stryCov_9fa48("600"), styled.div`
  display: flex;
  align-items: flex-end;
`);
const InputPhoto = stryMutAct_9fa48("601") ? styled(Input)`` : (stryCov_9fa48("601"), styled(Input)`
  width: 334px;
  margin-right: 10px;

  input {
    background-color: ${stryMutAct_9fa48("602") ? () => undefined : (stryCov_9fa48("602"), ({
  theme,
  resume
}) => resume ? stryMutAct_9fa48("603") ? "" : (stryCov_9fa48("603"), 'transparent') : theme.input.title.background)};
    border: none;
    border-radius: 4px;
    height: 30px;
    font-size: ${stryMutAct_9fa48("604") ? () => undefined : (stryCov_9fa48("604"), ({
  resume
}) => resume ? stryMutAct_9fa48("605") ? "" : (stryCov_9fa48("605"), '18px') : stryMutAct_9fa48("606") ? "" : (stryCov_9fa48("606"), '12px'))};
    cursor: ${stryMutAct_9fa48("607") ? () => undefined : (stryCov_9fa48("607"), ({
  resume
}) => resume ? stryMutAct_9fa48("608") ? "" : (stryCov_9fa48("608"), 'pointer') : stryMutAct_9fa48("609") ? "" : (stryCov_9fa48("609"), 'auto'))};
    padding: ${stryMutAct_9fa48("610") ? () => undefined : (stryCov_9fa48("610"), ({
  resume
}) => resume ? stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), '0') : stryMutAct_9fa48("612") ? "" : (stryCov_9fa48("612"), '0 0 0 10px'))};
  }
`);
export default stryMutAct_9fa48("613") ? {} : (stryCov_9fa48("613"), {
  Wrapper,
  InputPhoto
});
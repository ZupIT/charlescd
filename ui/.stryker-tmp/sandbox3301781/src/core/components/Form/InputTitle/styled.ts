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
import Input from 'core/components/Form/Input';
import Text from 'core/components/Text';
const Wrapper = stryMutAct_9fa48("614") ? styled.div`` : (stryCov_9fa48("614"), styled.div`
  display: flex;
  flex-direction: column;
`);
const Field = stryMutAct_9fa48("615") ? styled.div`` : (stryCov_9fa48("615"), styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`);
const InputTitle = stryMutAct_9fa48("616") ? styled(Input)`` : (stryCov_9fa48("616"), styled(Input)`
  width: 334px;
  height: 30px;
  margin-right: 10px;

  input {
    padding-left: 10px;
    padding-top: 2px;
    height: 30px;
    background-color: ${stryMutAct_9fa48("617") ? () => undefined : (stryCov_9fa48("617"), ({
  theme
}) => theme.input.title.background)};

    ${stryMutAct_9fa48("618") ? () => undefined : (stryCov_9fa48("618"), ({
  resume
}) => stryMutAct_9fa48("621") ? resume || css`
        height: auto;
        cursor: pointer;
        padding: 10px 10px 10px 0;
        background-color: transparent;
      ` : stryMutAct_9fa48("620") ? false : stryMutAct_9fa48("619") ? true : (stryCov_9fa48("619", "620", "621"), resume && (stryMutAct_9fa48("622") ? css`` : (stryCov_9fa48("622"), css`
        height: auto;
        cursor: pointer;
        padding: 10px 10px 10px 0;
        background-color: transparent;
      `))))};

    ${stryMutAct_9fa48("623") ? () => undefined : (stryCov_9fa48("623"), ({
  readOnly
}) => stryMutAct_9fa48("626") ? readOnly || css`
        cursor: default;
      ` : stryMutAct_9fa48("625") ? false : stryMutAct_9fa48("624") ? true : (stryCov_9fa48("624", "625", "626"), readOnly && (stryMutAct_9fa48("627") ? css`` : (stryCov_9fa48("627"), css`
        cursor: default;
      `))))};

    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: ${stryMutAct_9fa48("628") ? () => undefined : (stryCov_9fa48("628"), ({
  resume
}) => resume ? stryMutAct_9fa48("629") ? "" : (stryCov_9fa48("629"), '18px') : stryMutAct_9fa48("630") ? "" : (stryCov_9fa48("630"), '12px'))};
  }
`);
const Error = stryMutAct_9fa48("631") ? styled(Text)`` : (stryCov_9fa48("631"), styled(Text)`
  margin-top: 3px;
`);
export default stryMutAct_9fa48("632") ? {} : (stryCov_9fa48("632"), {
  Wrapper,
  Field,
  InputTitle,
  Error
});
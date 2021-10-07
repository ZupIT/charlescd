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

import Input from 'core/components/Form/Input';
import styled from 'styled-components';
const Wrapper = stryMutAct_9fa48("575") ? styled.div`` : (stryCov_9fa48("575"), styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`);
const InputWrapper = stryMutAct_9fa48("576") ? styled.div`` : (stryCov_9fa48("576"), styled.div`
  cursor: pointer;
  height: 41px;
  width: 142px;
  border: 1px solid ${stryMutAct_9fa48("577") ? () => undefined : (stryCov_9fa48("577"), ({
  theme
}) => theme.input.label)};
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;

  label {
    display: flex;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    height: 100%;
    align-items: center;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 130px;
    }
    svg {
      padding-left: 7px;
    }
  }
`);
const InputFile = stryMutAct_9fa48("578") ? styled(Input)`` : (stryCov_9fa48("578"), styled(Input)`
  display: none;
`);
export default stryMutAct_9fa48("579") ? {} : (stryCov_9fa48("579"), {
  Wrapper,
  InputWrapper,
  InputFile
});
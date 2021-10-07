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
const Toggle = stryMutAct_9fa48("1162") ? styled.i`` : (stryCov_9fa48("1162"), styled.i`
  position: relative;
  display: inline-block;
  width: 24px;
  height: 15px;
  background-color: ${stryMutAct_9fa48("1163") ? () => undefined : (stryCov_9fa48("1163"), ({
  theme
}) => theme.switch.border)};
  border-radius: 23px;
  vertical-align: text-bottom;
  transition: all 0.3s linear;

  ::before {
    content: '';
    position: absolute;
    left: 0;
    width: 20px;
    height: 11px;
    background-color: ${stryMutAct_9fa48("1164") ? () => undefined : (stryCov_9fa48("1164"), ({
  theme
}) => theme.switch.background)};
    border-radius: 11px;
    transform: translate3d(2px, 2px, 0) scale3d(1, 1, 1);
    transition: all 0.25s linear;
  }

  ::after {
    content: '';
    position: absolute;
    left: 1px;
    top: 1px;
    width: 9px;
    height: 9px;
    background-color: ${stryMutAct_9fa48("1165") ? () => undefined : (stryCov_9fa48("1165"), ({
  theme
}) => theme.switch.toggle.background)};
    border-radius: 11px;
    box-shadow: 0 2px 2px ${stryMutAct_9fa48("1166") ? () => undefined : (stryCov_9fa48("1166"), ({
  theme
}) => theme.switch.shadow)};
    transform: translate3d(2px, 2px, 0);
    transition: all 0.2s ease-in-out;
  }
`);
const Input = stryMutAct_9fa48("1167") ? styled.input`` : (stryCov_9fa48("1167"), styled.input`
  display: none;

  :checked + ${Toggle} {
    background-color: ${stryMutAct_9fa48("1168") ? () => undefined : (stryCov_9fa48("1168"), ({
  theme
}) => theme.switch.active.background)};
  }

  :checked + ${Toggle}::before {
    transform: translate3d(10px, 2px, 0) scale3d(0, 0, 0);
  }

  :checked + ${Toggle}::after {
    transform: translate3d(12px, 2px, 0);
  }
`);
const Switch = stryMutAct_9fa48("1169") ? styled.label`` : (stryCov_9fa48("1169"), styled.label`
  display: inline-block;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;

  > :last-child {
    margin-left: 5px;
  }

  :active {
    ${Input}:checked + ${Toggle}::after {
      transform: translate3d(2px, 2px, 0);
    }

    ${Toggle}::after {
      width: 10px;
      transform: translate3d(2px, 2px, 0);
    }
  }
`);
export default stryMutAct_9fa48("1170") ? {} : (stryCov_9fa48("1170"), {
  Switch,
  Input,
  Toggle
});
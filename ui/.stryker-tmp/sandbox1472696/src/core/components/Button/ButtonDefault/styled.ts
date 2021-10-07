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
import Icon from 'core/components/Icon';
import { Props, HEIGHT } from './index';
const Button = stryMutAct_9fa48("211") ? styled.button<Partial<Props>>`` : (stryCov_9fa48("211"), styled.button<Partial<Props>>`
  position: relative;
  background-color: ${stryMutAct_9fa48("212") ? () => undefined : (stryCov_9fa48("212"), ({
  theme
}) => theme.button.default.background)};
  border: none;
  border-radius: 4px;
  color: ${stryMutAct_9fa48("213") ? () => undefined : (stryCov_9fa48("213"), ({
  theme
}) => theme.button.default.color)};
  font-size: 10px;
  height: ${stryMutAct_9fa48("214") ? () => undefined : (stryCov_9fa48("214"), ({
  size
}) => HEIGHT[size])};
  line-height: ${stryMutAct_9fa48("215") ? () => undefined : (stryCov_9fa48("215"), ({
  size
}) => HEIGHT[size])};
  font-weight: bold;
  padding: 0 33px;
  cursor: pointer;
  transition: 0.2s;
  width: fit-content;

  :hover {
    transform: scale(1.1);
  }

  ${stryMutAct_9fa48("216") ? () => undefined : (stryCov_9fa48("216"), ({
  size
}) => stryMutAct_9fa48("219") ? HEIGHT[size] === HEIGHT.EXTRA_SMALL || css`
      padding: 0 18px;
    ` : stryMutAct_9fa48("218") ? false : stryMutAct_9fa48("217") ? true : (stryCov_9fa48("217", "218", "219"), (stryMutAct_9fa48("222") ? HEIGHT[size] !== HEIGHT.EXTRA_SMALL : stryMutAct_9fa48("221") ? false : stryMutAct_9fa48("220") ? true : (stryCov_9fa48("220", "221", "222"), HEIGHT[size] === HEIGHT.EXTRA_SMALL)) && (stryMutAct_9fa48("223") ? css`` : (stryCov_9fa48("223"), css`
      padding: 0 18px;
    `))))};

  ${stryMutAct_9fa48("224") ? () => undefined : (stryCov_9fa48("224"), ({
  theme,
  disabled
}) => stryMutAct_9fa48("227") ? disabled || css`
      background-color: ${theme.button.default.disabled.background};
      color: ${theme.button.default.disabled.color};
      cursor: default;
      opacity: 0.3;

      > * {
        cursor: default;
      }

      :hover {
        transform: scale(1);
      }
    ` : stryMutAct_9fa48("226") ? false : stryMutAct_9fa48("225") ? true : (stryCov_9fa48("225", "226", "227"), disabled && (stryMutAct_9fa48("228") ? css`` : (stryCov_9fa48("228"), css`
      background-color: ${theme.button.default.disabled.background};
      color: ${theme.button.default.disabled.color};
      cursor: default;
      opacity: 0.3;

      > * {
        cursor: default;
      }

      :hover {
        transform: scale(1);
      }
    `))))};
`);
const Loading = stryMutAct_9fa48("229") ? styled(Icon)`` : (stryCov_9fa48("229"), styled(Icon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`);
export default stryMutAct_9fa48("230") ? {} : (stryCov_9fa48("230"), {
  Button,
  Loading
});
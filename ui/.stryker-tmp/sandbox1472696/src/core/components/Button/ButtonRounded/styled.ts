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

import styled, { css } from 'styled-components';
type Size = 'small' | 'medium' | 'default';
interface ButtonProps {
  backgroundColor: 'default' | 'primary';
  size: Size;
}
export enum HEIGHT {
  small = '30px',
  medium = '40px',
  default = '50px',
}
export enum PADDING {
  small = '9px 18px',
  medium = '12px 25px',
  default = '15px 33px',
}
export enum RADIUS {
  small = '15px',
  medium = '20px',
  default = '30px',
}
const Button = stryMutAct_9fa48("231") ? styled.button<ButtonProps>`` : (stryCov_9fa48("231"), styled.button<ButtonProps>`
  border: none;
  background: ${stryMutAct_9fa48("232") ? () => undefined : (stryCov_9fa48("232"), ({
  backgroundColor,
  theme
}) => theme.button.rounded.background[backgroundColor])};
  height: 50px;
  border-radius: ${stryMutAct_9fa48("233") ? () => undefined : (stryCov_9fa48("233"), ({
  size
}) => RADIUS[size])};
  height: ${stryMutAct_9fa48("234") ? () => undefined : (stryCov_9fa48("234"), ({
  size
}) => HEIGHT[size])};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${stryMutAct_9fa48("235") ? () => undefined : (stryCov_9fa48("235"), ({
  size
}) => PADDING[size])};
  cursor: pointer;
  transition: 0.2s;
  width: fit-content;

  :hover {
    transform: scale(1.03);
  }

  > * + * {
    margin-left: 10px;
  }

  ${stryMutAct_9fa48("236") ? () => undefined : (stryCov_9fa48("236"), ({
  disabled
}) => stryMutAct_9fa48("239") ? disabled || css`
      cursor: default;
      opacity: 0.3;

      > * {
        cursor: default;
      }

      :hover {
        transform: scale(1);
      }
    ` : stryMutAct_9fa48("238") ? false : stryMutAct_9fa48("237") ? true : (stryCov_9fa48("237", "238", "239"), disabled && (stryMutAct_9fa48("240") ? css`` : (stryCov_9fa48("240"), css`
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
export default stryMutAct_9fa48("241") ? {} : (stryCov_9fa48("241"), {
  Button
});
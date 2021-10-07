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
import { Props } from './';
import ComponentIcon from 'core/components/Icon';
import ComponentText from 'core/components/Text';
import ReactTooltip from 'react-tooltip';
import { dark as darkTheme } from 'core/assets/themes/dropdown';
const Icon = stryMutAct_9fa48("426") ? styled(ComponentIcon)`Stryker was here!` : (stryCov_9fa48("426"), styled(ComponentIcon)``);
const Text = stryMutAct_9fa48("427") ? styled(ComponentText)`Stryker was here!` : (stryCov_9fa48("427"), styled(ComponentText)``);
const Item = stryMutAct_9fa48("428") ? styled.button<Partial<Props>>`` : (stryCov_9fa48("428"), styled.button<Partial<Props>>`
  color: ${stryMutAct_9fa48("429") ? () => undefined : (stryCov_9fa48("429"), ({
  theme
}) => theme.dropdown.color)};
  cursor: pointer;
  border: none;
  background: transparent;
  height: 34px;
  display: flex;
  flex-direction: row;
  align-items: center;

  :hover {
    background: ${stryMutAct_9fa48("430") ? () => undefined : (stryCov_9fa48("430"), ({
  theme
}) => theme.dropdown.bgHover)};
  }

  > * + * {
    margin-left: 5px;
  }

  ${stryMutAct_9fa48("431") ? () => undefined : (stryCov_9fa48("431"), ({
  isInactive
}) => stryMutAct_9fa48("434") ? isInactive || css`
      ${Icon}, ${Text} {
        color: ${({
  theme
}) => theme.dropdown.disabled.color};
        opacity: 0.7;
      }
    ` : stryMutAct_9fa48("433") ? false : stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432", "433", "434"), isInactive && (stryMutAct_9fa48("435") ? css`` : (stryCov_9fa48("435"), css`
      ${Icon}, ${Text} {
        color: ${stryMutAct_9fa48("436") ? () => undefined : (stryCov_9fa48("436"), ({
  theme
}) => theme.dropdown.disabled.color)};
        opacity: 0.7;
      }
    `))))};
`);
const ReactTooltipStyled = stryMutAct_9fa48("437") ? styled(ReactTooltip)`` : (stryCov_9fa48("437"), styled(ReactTooltip)`
  padding: 8px 21px !important;
  font-size: 10px !important;
  color: ${darkTheme.color} !important;

  > span {
    text-align: left !important;
    padding: 0px !important;
    font-size: 12px;
    width: 120px;
    background-color: ${stryMutAct_9fa48("438") ? () => undefined : (stryCov_9fa48("438"), ({
  theme
}) => theme.dropdown.background)};
    color: ${stryMutAct_9fa48("439") ? () => undefined : (stryCov_9fa48("439"), ({
  theme
}) => theme.dropdown.color)};
  }
`);
export default stryMutAct_9fa48("440") ? {} : (stryCov_9fa48("440"), {
  Item,
  Icon,
  Text,
  ReactTooltipStyled
});
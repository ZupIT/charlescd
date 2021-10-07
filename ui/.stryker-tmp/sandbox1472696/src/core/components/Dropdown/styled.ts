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
import { scaleIn } from 'core/assets/style/animate';
type DropDownProps = {
  isBase?: boolean;
};
const Wrapper = stryMutAct_9fa48("441") ? styled.div`` : (stryCov_9fa48("441"), styled.div`
  position: relative;
  width: auto;
  height: auto;
`);
const Dropdown = stryMutAct_9fa48("442") ? styled.div<DropDownProps>`` : (stryCov_9fa48("442"), styled.div<DropDownProps>`
  animation: ${scaleIn} 0.15s cubic-bezier(0.2, 0, 0.13, 1.5);
  position: absolute;
  right: 0;
  top: 0;
  background: ${stryMutAct_9fa48("443") ? () => undefined : (stryCov_9fa48("443"), ({
  theme
}) => theme.dropdown.background)};
  border-radius: 4px;
  width: auto;
  min-width: 136px;
  box-shadow: 0px 2px 10px 0px ${stryMutAct_9fa48("444") ? () => undefined : (stryCov_9fa48("444"), ({
  theme
}) => theme.dropdown.shadow)};
  display: flex;
  overflow-y: auto;
  justify-content: flex-start;
  flex-direction: column;
  z-index: ${stryMutAct_9fa48("445") ? () => undefined : (stryCov_9fa48("445"), ({
  theme
}) => theme.zIndex.OVER_3)};

  ${stryMutAct_9fa48("446") ? () => undefined : (stryCov_9fa48("446"), ({
  isBase
}) => stryMutAct_9fa48("449") ? isBase || css`
      right: 8px;
      top: 27px;
    ` : stryMutAct_9fa48("448") ? false : stryMutAct_9fa48("447") ? true : (stryCov_9fa48("447", "448", "449"), isBase && (stryMutAct_9fa48("450") ? css`` : (stryCov_9fa48("450"), css`
      right: 8px;
      top: 27px;
    `))))}
`);
const PopperContainer = stryMutAct_9fa48("451") ? styled.div`` : (stryCov_9fa48("451"), styled.div`
  z-index: 3;
  background-color: white;
  height: auto;
  width: auto;

  #arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    &:after {
      content: ' ';
      box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
      position: absolute;
      top: -25px;
      left: 0;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
    }
  }

  &[data-popper-placement^='top'] > #arrow {
    bottom: -30px;
    :after {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
`);
export default stryMutAct_9fa48("452") ? {} : (stryCov_9fa48("452"), {
  Wrapper,
  Dropdown,
  PopperContainer
});
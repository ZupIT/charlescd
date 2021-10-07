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
import IconComponent from 'core/components/Icon';
import Text from 'core/components/Text';
import { Props } from '.';
const Action = stryMutAct_9fa48("884") ? styled.div`` : (stryCov_9fa48("884"), styled.div`
  padding: 5px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
`);
const Wrapper = stryMutAct_9fa48("885") ? styled.div<Partial<Props>>`` : (stryCov_9fa48("885"), styled.div<Partial<Props>>`
  display: inline-block;
`);
const Content = stryMutAct_9fa48("886") ? styled.div`Stryker was here!` : (stryCov_9fa48("886"), styled.div``);
const Actions = stryMutAct_9fa48("887") ? styled.div`` : (stryCov_9fa48("887"), styled.div`
  position: absolute;
  background: ${stryMutAct_9fa48("888") ? () => undefined : (stryCov_9fa48("888"), ({
  theme
}) => theme.menu.background)};
  border-radius: 4px;
  color: ${stryMutAct_9fa48("889") ? () => undefined : (stryCov_9fa48("889"), ({
  theme
}) => theme.menu.color)};
  z-index: ${stryMutAct_9fa48("890") ? () => undefined : (stryCov_9fa48("890"), ({
  theme
}) => theme.zIndex.OVER_1)};
`);
const WrapperIcon = stryMutAct_9fa48("891") ? styled.div`` : (stryCov_9fa48("891"), styled.div`
  position: relative;
  width: 15px;
  padding: 3px 12px 12px 0;
`);
const Icon = stryMutAct_9fa48("892") ? styled(IconComponent)`` : (stryCov_9fa48("892"), styled(IconComponent)`
  position: absolute;
  top: 0;
  padding-left: 5px;
`);
const MenuText = stryMutAct_9fa48("893") ? styled(Text)`` : (stryCov_9fa48("893"), styled(Text)`
  padding-right: 16px;
`);
export default stryMutAct_9fa48("894") ? {} : (stryCov_9fa48("894"), {
  Action,
  Actions,
  Content,
  MenuText,
  Icon,
  Wrapper,
  WrapperIcon
});
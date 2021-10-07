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
import ButtonComponentRounded from 'core/components/Button/ButtonRounded';
const Button = stryMutAct_9fa48("6500") ? styled(ButtonComponentRounded)`` : (stryCov_9fa48("6500"), styled(ButtonComponentRounded)`
  margin-top: 10px;
`);
interface ContentProps {
  left?: boolean;
  displayAction?: boolean;
}
const Content = stryMutAct_9fa48("6501") ? styled.div<ContentProps>`` : (stryCov_9fa48("6501"), styled.div<ContentProps>`
  margin-top: 10px;
  display: ${stryMutAct_9fa48("6502") ? () => undefined : (stryCov_9fa48("6502"), ({
  displayAction = stryMutAct_9fa48("6503") ? false : (stryCov_9fa48("6503"), true)
}) => displayAction ? stryMutAct_9fa48("6504") ? "" : (stryCov_9fa48("6504"), 'block') : stryMutAct_9fa48("6505") ? "" : (stryCov_9fa48("6505"), 'none'))};

  > * {
    margin-bottom: 10px;
  }

  ${stryMutAct_9fa48("6506") ? () => undefined : (stryCov_9fa48("6506"), ({
  left
}) => stryMutAct_9fa48("6509") ? left || css`
    margin-left: 35px;
  ` : stryMutAct_9fa48("6508") ? false : stryMutAct_9fa48("6507") ? true : (stryCov_9fa48("6507", "6508", "6509"), left && (stryMutAct_9fa48("6510") ? css`` : (stryCov_9fa48("6510"), css`
    margin-left: 35px;
  `))))}
`);
const Description = stryMutAct_9fa48("6511") ? styled.div`` : (stryCov_9fa48("6511"), styled.div`
  width: 550px;
  margin-bottom: 32px;
`);
const View = stryMutAct_9fa48("6512") ? styled.div`Stryker was here!` : (stryCov_9fa48("6512"), styled.div``);
const ViewHead = stryMutAct_9fa48("6513") ? styled.div`` : (stryCov_9fa48("6513"), styled.div`
  display: flex;
  margin-bottom: 10px;

  * {
    flex-grow: 1;
    flex-basis: 50%;
  }
  
  >:first-child {
    padding-left: 10px;
  }
`);
const ViewItem = stryMutAct_9fa48("6514") ? styled.div`` : (stryCov_9fa48("6514"), styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 4px;
  background-color: ${stryMutAct_9fa48("6515") ? () => undefined : (stryCov_9fa48("6515"), ({
  theme
}) => theme.token.scope.view.background)};
  padding-left: 10px;
  margin-bottom: 10px;

  * {
    flex-grow: 1;
    flex-basis: 50%;
  }
`);
const ViewScope = stryMutAct_9fa48("6516") ? styled.div`` : (stryCov_9fa48("6516"), styled.div`
  display: flex;
  align-items: center;

  >:first-child{
    flex-grow: 0;
    flex-basis: auto;
    padding-right: 10px;
  }
`);
export default stryMutAct_9fa48("6517") ? {} : (stryCov_9fa48("6517"), {
  Button,
  Content,
  Description,
  View,
  ViewHead,
  ViewItem,
  ViewScope
});
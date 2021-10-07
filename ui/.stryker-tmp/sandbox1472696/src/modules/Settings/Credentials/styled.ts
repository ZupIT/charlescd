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
import { slideInLeft, fadeIn } from 'core/assets/style/animate';
const Wrapper = stryMutAct_9fa48("6345") ? styled.div`` : (stryCov_9fa48("6345"), styled.div`
  animation: 0.2s ${slideInLeft} linear;
`);
const Content = stryMutAct_9fa48("6346") ? styled.div`` : (stryCov_9fa48("6346"), styled.div`
  margin-top: 15px;
  margin-left: 45px;

  > :not(:first-child) {
    margin-top: 10px;
  }
`);
const Actions = stryMutAct_9fa48("6347") ? styled.div`` : (stryCov_9fa48("6347"), styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;

  > :last-child {
    margin-left: 36px;
  }
`);
const Layer = stryMutAct_9fa48("6348") ? styled.div`` : (stryCov_9fa48("6348"), styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 40px;

  :last-child {
    padding-bottom: 235px;
  }
`);
const Form = stryMutAct_9fa48("6349") ? styled.div`` : (stryCov_9fa48("6349"), styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 51px;
  margin-left: 30px;

  :last-child {
    padding-bottom: 40px;
  }
`);
const Type = stryMutAct_9fa48("6350") ? styled.div`` : (stryCov_9fa48("6350"), styled.div`
  margin-left: 43px;
  margin-top: 6px;
  margin-bottom: 9px;
`);
export default stryMutAct_9fa48("6351") ? {} : (stryCov_9fa48("6351"), {
  Actions,
  Wrapper,
  Content,
  Layer,
  Form,
  Type
});
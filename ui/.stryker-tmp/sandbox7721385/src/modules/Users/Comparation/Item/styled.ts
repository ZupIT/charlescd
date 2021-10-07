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

import styled from 'styled-components';
import ComponentContentIcon from 'core/components/ContentIcon';
import ComponentLayer from 'core/components/Layer';
import { slideInLeft } from 'core/assets/style/animate';
const Wrapper = stryMutAct_9fa48("6774") ? styled.div`` : (stryCov_9fa48("6774"), styled.div`
  animation: 0.2s ${slideInLeft} linear;
`);
const Layer = stryMutAct_9fa48("6775") ? styled(ComponentLayer)`` : (stryCov_9fa48("6775"), styled(ComponentLayer)`
  span + span {
    margin-top: 10px;
  }
`);
const ContentIcon = stryMutAct_9fa48("6776") ? styled(ComponentContentIcon)`` : (stryCov_9fa48("6776"), styled(ComponentContentIcon)`
  align-items: center;
`);
const Actions = stryMutAct_9fa48("6777") ? styled.div`` : (stryCov_9fa48("6777"), styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;

  > :last-child {
    margin-left: 36px;
  }
`);
const Groups = stryMutAct_9fa48("6778") ? styled.div`` : (stryCov_9fa48("6778"), styled.div`
  display: flex;
  flex-direction: column;

  > div {
    margin-top: 10px;
  }
`);
const FieldErrorWrapper = stryMutAct_9fa48("6779") ? styled.div`` : (stryCov_9fa48("6779"), styled.div`
  display: flex;
  margin-top: 2px;

  span {
    margin-left: 5px;
    margin-top: 2px;
  }
`);
export default stryMutAct_9fa48("6780") ? {} : (stryCov_9fa48("6780"), {
  FieldErrorWrapper,
  Wrapper,
  ContentIcon,
  Layer,
  Groups,
  Actions
});
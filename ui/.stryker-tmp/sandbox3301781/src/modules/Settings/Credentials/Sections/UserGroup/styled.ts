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
import SelectComponent from 'core/components/Form/Select';
import AsyncSelect from 'core/components/Form/Select/Async';
import { fadeIn } from 'core/assets/style/animate';
const Title = stryMutAct_9fa48("6268") ? styled.div`` : (stryCov_9fa48("6268"), styled.div`
  display: flex;
`);
const Roles = stryMutAct_9fa48("6269") ? styled.div`` : (stryCov_9fa48("6269"), styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  > * {
    margin-bottom: 10px;
  }

  > :nth-child(odd) {
    margin-left: 0px;
  }
`);
const Description = stryMutAct_9fa48("6270") ? styled.div`` : (stryCov_9fa48("6270"), styled.div`
  margin: 20px 0;

  > :first-child {
    margin-bottom: 3px;
  }
`);
const Content = stryMutAct_9fa48("6271") ? styled.div`` : (stryCov_9fa48("6271"), styled.div`
  display: flex;
  flex-direction: column;
  animation: 0.3s ${fadeIn} linear;
  margin-top: 10px;
  margin-left: 40px;

  > :last-child {
    margin-top: 20px;
  }
`);
const Select = stryMutAct_9fa48("6272") ? styled(SelectComponent.Single)`` : (stryCov_9fa48("6272"), styled(SelectComponent.Single)`
  width: 271px;
`);
const SelectAsync = stryMutAct_9fa48("6273") ? styled(AsyncSelect)`` : (stryCov_9fa48("6273"), styled(AsyncSelect)`
  width: 271px;
`);
const Fields = stryMutAct_9fa48("6274") ? styled.div`` : (stryCov_9fa48("6274"), styled.div`
  margin-top: 19px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`);
export default stryMutAct_9fa48("6275") ? {} : (stryCov_9fa48("6275"), {
  Content,
  Title,
  Select,
  SelectAsync,
  Fields,
  Roles,
  Description
});
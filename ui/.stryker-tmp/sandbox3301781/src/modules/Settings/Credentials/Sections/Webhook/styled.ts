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
const Content = stryMutAct_9fa48("6337") ? styled.div`` : (stryCov_9fa48("6337"), styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 40px;

  > :first-child {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > :last-child {
      margin-left: 10px;
    }
  }
`);
const Form = stryMutAct_9fa48("6338") ? styled.form`Stryker was here!` : (stryCov_9fa48("6338"), styled.form``);
const Fields = stryMutAct_9fa48("6339") ? styled.div`` : (stryCov_9fa48("6339"), styled.div`
  width: 310px;
  margin: 19px 0 20px 0;

  > * {
    margin-top: 19px;
  }
`);
const Field = stryMutAct_9fa48("6340") ? styled.div`` : (stryCov_9fa48("6340"), styled.div`
  > :last-child {
    margin-top: 5px;
    margin-left: 30px;
  }
`);
const Actions = stryMutAct_9fa48("6341") ? styled.div`` : (stryCov_9fa48("6341"), styled.div`
  display: flex;
  flex-direction: column;

  > * {
    margin-top: 19px;
  }
`);
export default stryMutAct_9fa48("6342") ? {} : (stryCov_9fa48("6342"), {
  Form,
  Content,
  Fields,
  Field,
  Actions
});
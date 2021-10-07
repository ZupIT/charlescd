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
const Card = stryMutAct_9fa48("242") ? styled.div`` : (stryCov_9fa48("242"), styled.div`
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  width: 269px;
  background-color: ${stryMutAct_9fa48("243") ? () => undefined : (stryCov_9fa48("243"), ({
  color
}) => color)};

  ${stryMutAct_9fa48("244") ? () => undefined : (stryCov_9fa48("244"), ({
  onClick
}) => stryMutAct_9fa48("247") ? onClick || css`
      cursor: pointer;
      :hover {
        transition: all 0.3s;
        transform: scale(1.03);
      }
    ` : stryMutAct_9fa48("246") ? false : stryMutAct_9fa48("245") ? true : (stryCov_9fa48("245", "246", "247"), onClick && (stryMutAct_9fa48("248") ? css`` : (stryCov_9fa48("248"), css`
      cursor: pointer;
      :hover {
        transition: all 0.3s;
        transform: scale(1.03);
      }
    `))))}

  > * + * {
    margin-top: 10px;
  }
`);
export default stryMutAct_9fa48("249") ? {} : (stryCov_9fa48("249"), {
  Card
});
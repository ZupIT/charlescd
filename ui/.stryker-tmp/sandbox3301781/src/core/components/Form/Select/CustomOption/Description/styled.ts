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
import Text from 'core/components/Text';
import IconComponent from 'core/components/Icon';
const Wrapper = stryMutAct_9fa48("652") ? styled.div`` : (stryCov_9fa48("652"), styled.div`
  display: flex;
  justify-content: space-between;
`);
const checkWidth = stryMutAct_9fa48("653") ? "" : (stryCov_9fa48("653"), '30px');
interface CheckProps {
  isActive: boolean;
}
const Check = stryMutAct_9fa48("654") ? styled.div<CheckProps>`` : (stryCov_9fa48("654"), styled.div<CheckProps>`
  visibility: ${stryMutAct_9fa48("655") ? () => undefined : (stryCov_9fa48("655"), ({
  isActive
}) => isActive ? stryMutAct_9fa48("656") ? "" : (stryCov_9fa48("656"), 'visible') : stryMutAct_9fa48("657") ? "" : (stryCov_9fa48("657"), 'hidden'))};
  width: ${checkWidth};
`);
const Icon = stryMutAct_9fa48("658") ? styled(IconComponent)`Stryker was here!` : (stryCov_9fa48("658"), styled(IconComponent)``);
const Content = stryMutAct_9fa48("659") ? styled.div`` : (stryCov_9fa48("659"), styled.div`
  width: calc(100% - ${checkWidth});
`);
const Label = stryMutAct_9fa48("660") ? styled(Text)`` : (stryCov_9fa48("660"), styled(Text)`
  margin-bottom: 5px;
`);
const Description = stryMutAct_9fa48("661") ? styled(Text)`Stryker was here!` : (stryCov_9fa48("661"), styled(Text)``);
export default stryMutAct_9fa48("662") ? {} : (stryCov_9fa48("662"), {
  Wrapper,
  Check,
  Icon,
  Content,
  Label,
  Description
});
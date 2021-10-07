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
import { scaleIn } from 'core/assets/style/animate';
const Wrapper = stryMutAct_9fa48("1135") ? styled.div`` : (stryCov_9fa48("1135"), styled.div`
  position: relative;
`);
const Anchor = stryMutAct_9fa48("1136") ? styled.div`` : (stryCov_9fa48("1136"), styled.div`
  width: auto;
  height: auto;
`);
const Content = stryMutAct_9fa48("1137") ? styled.div`Stryker was here!` : (stryCov_9fa48("1137"), styled.div``);
const Link = stryMutAct_9fa48("1138") ? styled.a`` : (stryCov_9fa48("1138"), styled.a`
  text-decoration: none;

  :hover {
    text-decoration: underline;
    text-decoration-color: ${stryMutAct_9fa48("1139") ? () => undefined : (stryCov_9fa48("1139"), ({
  theme
}) => theme.popover.link.decorationColor)};
  }
`);
const Popover = stryMutAct_9fa48("1140") ? styled.div`` : (stryCov_9fa48("1140"), styled.div`
  animation: ${scaleIn} 0.15s cubic-bezier(0.2, 0, 0.13, 1.5);
  position: absolute;
  background: ${stryMutAct_9fa48("1141") ? () => undefined : (stryCov_9fa48("1141"), ({
  theme
}) => theme.popover.background)};
  border-radius: 4px;
  padding: 14px 19px;
  width: 258px;
  left: 40px;
  top: -3px;
  box-shadow: 0px 2px 10px 0px ${stryMutAct_9fa48("1142") ? () => undefined : (stryCov_9fa48("1142"), ({
  theme
}) => theme.popover.shadow)};
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  box-sizing: border-box;
  z-index: ${stryMutAct_9fa48("1143") ? () => undefined : (stryCov_9fa48("1143"), ({
  theme
}) => theme.zIndex.OVER_1)};

  > * + * {
    margin-top: 10px;
  }

  :after {
    content: '';
    position: absolute;
    left: 0;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-right-color: ${stryMutAct_9fa48("1144") ? () => undefined : (stryCov_9fa48("1144"), ({
  theme
}) => theme.popover.background)};
    border-left: 0;
    margin-top: -5px;
    margin-left: -6px;
  }
`);
export default stryMutAct_9fa48("1145") ? {} : (stryCov_9fa48("1145"), {
  Link,
  Wrapper,
  Anchor,
  Content,
  Popover
});
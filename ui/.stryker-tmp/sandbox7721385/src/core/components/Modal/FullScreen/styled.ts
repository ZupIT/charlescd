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
interface WrapperProps {
  isOpen?: boolean;
  className?: string;
}
const Wrapper = stryMutAct_9fa48("900") ? styled(stryMutAct_9fa48("899") ? "" : (stryCov_9fa48("899"), 'div'))<WrapperProps>`` : (stryCov_9fa48("900"), styled(stryMutAct_9fa48("899") ? "" : (stryCov_9fa48("899"), 'div'))<WrapperProps>`
  display: ${stryMutAct_9fa48("901") ? () => undefined : (stryCov_9fa48("901"), ({
  isOpen
}: WrapperProps) => (stryMutAct_9fa48("902") ? isOpen : (stryCov_9fa48("902"), !isOpen)) ? stryMutAct_9fa48("903") ? "" : (stryCov_9fa48("903"), 'none') : stryMutAct_9fa48("904") ? "" : (stryCov_9fa48("904"), 'flex'))};
  z-index: ${stryMutAct_9fa48("905") ? () => undefined : (stryCov_9fa48("905"), ({
  theme
}) => theme.zIndex.OVER_4)};
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`);
const Header = stryMutAct_9fa48("906") ? styled.div`` : (stryCov_9fa48("906"), styled.div`
  background: ${stryMutAct_9fa48("907") ? () => undefined : (stryCov_9fa48("907"), ({
  theme
}) => theme.modal.default.header)};
  height: 40px;
  width: 100%;

  i {
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 10px;
  };
`);
const Container = stryMutAct_9fa48("908") ? styled.div`` : (stryCov_9fa48("908"), styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${stryMutAct_9fa48("909") ? () => undefined : (stryCov_9fa48("909"), ({
  theme
}) => theme.modal.default.background)};
  color: ${stryMutAct_9fa48("910") ? () => undefined : (stryCov_9fa48("910"), ({
  theme
}) => theme.modal.default.text)};
  text-align: left;
  opacity: 1.2;
  border-radius: 4px;
  height: 100%;
  width: 100%;
`);
const Content = stryMutAct_9fa48("911") ? styled.div`` : (stryCov_9fa48("911"), styled.div`
  overflow-y: auto;
  max-height: 100vh;
  height: 100%;
`);
export default stryMutAct_9fa48("912") ? {} : (stryCov_9fa48("912"), {
  Wrapper,
  Container,
  Content,
  Header
});
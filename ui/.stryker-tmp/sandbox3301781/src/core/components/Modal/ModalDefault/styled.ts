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
import Text from 'core/components/Text';
interface WrapperProps {
  isOpen?: boolean;
  className?: string;
}
const Wrapper = stryMutAct_9fa48("914") ? styled(stryMutAct_9fa48("913") ? "" : (stryCov_9fa48("913"), 'div'))<WrapperProps>`` : (stryCov_9fa48("914"), styled(stryMutAct_9fa48("913") ? "" : (stryCov_9fa48("913"), 'div'))<WrapperProps>`
  display: ${stryMutAct_9fa48("915") ? () => undefined : (stryCov_9fa48("915"), ({
  isOpen
}: WrapperProps) => (stryMutAct_9fa48("916") ? isOpen : (stryCov_9fa48("916"), !isOpen)) ? stryMutAct_9fa48("917") ? "" : (stryCov_9fa48("917"), 'none') : stryMutAct_9fa48("918") ? "" : (stryCov_9fa48("918"), 'flex'))};
  z-index: ${stryMutAct_9fa48("919") ? () => undefined : (stryCov_9fa48("919"), ({
  theme
}) => theme.zIndex.OVER_3)};
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`);
const Buttons = stryMutAct_9fa48("920") ? styled.div`` : (stryCov_9fa48("920"), styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`);
const Message = stryMutAct_9fa48("921") ? styled.div`` : (stryCov_9fa48("921"), styled.div`
  font-size: 15px;
`);
const Background = stryMutAct_9fa48("922") ? styled.div`` : (stryCov_9fa48("922"), styled.div`
  background: ${stryMutAct_9fa48("923") ? () => undefined : (stryCov_9fa48("923"), ({
  theme
}) => theme.modal.default.screen)};
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${stryMutAct_9fa48("924") ? () => undefined : (stryCov_9fa48("924"), ({
  theme
}) => theme.zIndex.OVER_3)};
  opacity: 0.8;
`);
const Dialog = stryMutAct_9fa48("925") ? styled.div`` : (stryCov_9fa48("925"), styled.div`
  position: relative;
  width: auto;
  max-width: 500px;
  margin: 1.75rem auto;
  min-height: calc(100% - (1.75rem * 2));
`);
const Container = stryMutAct_9fa48("926") ? styled.div`` : (stryCov_9fa48("926"), styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${stryMutAct_9fa48("927") ? () => undefined : (stryCov_9fa48("927"), ({
  theme
}) => theme.modal.default.background)};
  z-index: ${stryMutAct_9fa48("928") ? () => undefined : (stryCov_9fa48("928"), ({
  theme
}) => theme.zIndex.OVER_4)};
  color: ${stryMutAct_9fa48("929") ? () => undefined : (stryCov_9fa48("929"), ({
  theme
}) => theme.modal.default.text)};
  padding: 35px 41px 28px 40px;
  top: 15%;
  transform: translate(-50%, 0);
  text-align: left;
  opacity: 1.2;
  border-radius: 4px;
`);
const Content = stryMutAct_9fa48("930") ? styled.div`` : (stryCov_9fa48("930"), styled.div`
  overflow-y: auto;
  max-height: 100vh;
`);
const Title = stryMutAct_9fa48("931") ? styled(Text)`` : (stryCov_9fa48("931"), styled(Text)`
  text-align: left;
  margin-bottom: 20px;
  color: ${stryMutAct_9fa48("932") ? () => undefined : (stryCov_9fa48("932"), ({
  theme
}) => theme.modal.default.text)};
`);
const Button = stryMutAct_9fa48("933") ? styled.div`` : (stryCov_9fa48("933"), styled.div`
  position: absolute;
  top: 15px;
  right: 10px;
`);
export default stryMutAct_9fa48("934") ? {} : (stryCov_9fa48("934"), {
  Wrapper,
  Background,
  Dialog,
  Container,
  Content,
  Buttons,
  Button,
  Message,
  Title
});
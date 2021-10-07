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
import DefaultButton from 'core/components/Button/ButtonDefault';
import LabeledIcon from 'core/components/LabeledIcon';
const Wrapper = stryMutAct_9fa48("935") ? styled.div`Stryker was here!` : (stryCov_9fa48("935"), styled.div``);
const Buttons = stryMutAct_9fa48("936") ? styled.div`` : (stryCov_9fa48("936"), styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`);
const Background = stryMutAct_9fa48("937") ? styled.div`` : (stryCov_9fa48("937"), styled.div`
  background: ${stryMutAct_9fa48("938") ? () => undefined : (stryCov_9fa48("938"), ({
  theme
}) => theme.modal.trigger.screen)};
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${stryMutAct_9fa48("939") ? () => undefined : (stryCov_9fa48("939"), ({
  theme
}) => theme.zIndex.OVER_3)};
  opacity: 0.8;
`);
const Content = stryMutAct_9fa48("940") ? styled.div`` : (stryCov_9fa48("940"), styled.div`
  position: fixed;
  display: flex-inline;
  flex-direction: column;
  z-index: ${stryMutAct_9fa48("941") ? () => undefined : (stryCov_9fa48("941"), ({
  theme
}) => theme.zIndex.OVER_4)};
  top: 25%;
  left: calc(50% - 204px);
  padding: 11px 41px 28px 40px;
  text-align: left;
  background: ${stryMutAct_9fa48("942") ? () => undefined : (stryCov_9fa48("942"), ({
  theme
}) => theme.modal.trigger.background)};
  width: 408px;
  min-height: 210px;
  box-sizing: border-box;
  border-radius: 6px;
  opacity: 1.2;
`);
const Title = stryMutAct_9fa48("943") ? styled(Text)`` : (stryCov_9fa48("943"), styled(Text)`
  text-align: left;
  margin-bottom: 0;
`);
const Description = stryMutAct_9fa48("944") ? styled.div`` : (stryCov_9fa48("944"), styled.div`
  margin: 16px 0 24px 0;

  span {
    line-height: 1.3;
  }
`);
const ContinueButton = stryMutAct_9fa48("945") ? styled(DefaultButton)`` : (stryCov_9fa48("945"), styled(DefaultButton)`
  padding: 5px;
  margin-top: 0;
  margin-left: 15px;
  align-items: center;
  height: 40px;
  width: 160px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  background-color: ${stryMutAct_9fa48("946") ? () => undefined : (stryCov_9fa48("946"), ({
  theme
}) => theme.modal.trigger.continue)};
`);
const DismissButton = stryMutAct_9fa48("947") ? styled(DefaultButton)`` : (stryCov_9fa48("947"), styled(DefaultButton)`
  cursor: pointer;
  padding: 5px;
  margin-top: 0;
  align-items: center;
  height: 40px;
  width: 160px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  border: 0.1rem solid ${stryMutAct_9fa48("948") ? () => undefined : (stryCov_9fa48("948"), ({
  theme
}) => theme.modal.trigger.border)};
  background-color: transparent;

  span {
    color: ${stryMutAct_9fa48("949") ? () => undefined : (stryCov_9fa48("949"), ({
  theme
}) => theme.modal.trigger.border)};
  }
`);
const CloseButtonContainer = stryMutAct_9fa48("950") ? styled.div`` : (stryCov_9fa48("950"), styled.div`
  margin-left: 324px;
`);
const ItemName = stryMutAct_9fa48("951") ? styled(LabeledIcon)`` : (stryCov_9fa48("951"), styled(LabeledIcon)`
  padding: 16px 0 0 0;
`);
export default stryMutAct_9fa48("952") ? {} : (stryCov_9fa48("952"), {
  ItemName,
  Buttons,
  Button: stryMutAct_9fa48("953") ? {} : (stryCov_9fa48("953"), {
    Continue: ContinueButton,
    Dismiss: DismissButton,
    Container: CloseButtonContainer
  }),
  Content,
  Background,
  Title,
  Description,
  Wrapper
});